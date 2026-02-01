const { HfInference } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const wavefile = require('wavefile');

// Dynamic import for Xenova (ESM module) handling if needed, or standard require if CJS supported
// @xenova/transformers is compatible with CJS in recent versions
const { pipeline } = require('@xenova/transformers');

// Configure ffmpeg to use the static binary
ffmpeg.setFfmpegPath(ffmpegPath);

require('dotenv').config();

// Remove global initialization to prevent startup race conditions or stale env vars
// const hf = new HfInference(process.env.HF_API_KEY);

// Helper to get authenticated client per request
function getClient() {
    let key = process.env.HF_API_KEY;
    if (!key) throw new Error("HF_API_KEY is missing via process.env");
    key = key.trim().replace(/^["']|["']$/g, '');
    return new HfInference(key);
}

// Lazy-load the transcriber to avoid startup delay
let transcriber = null;

async function getTranscriber() {
    if (!transcriber) {
        console.log("Loading local Whisper model... (fallback only)");
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    }
    return transcriber;
}

/**
 * Controller for Text Summarization
 * Uses Qwen (Ungated, Reliable)
 */
exports.summarizeText = async (req, res) => {
    try {
        const { text, type } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

        const hf = getClient(); // Instantiate here

        const instruction = type === 'short'
            ? "Provide a concise summary in bullet points (Markdown)."
            : "Provide a detailed structured summary. Use Markdown headers (###), bold text for key terms, and bullet points for lists.";

        const messages = [
            { role: "system", content: "You are an expert summarizer. improved readability is your goal. Always output valid Markdown." },
            { role: "user", content: `${instruction}\n\nText:\n${text}` }
        ];

        const chatRes = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: messages,
            max_tokens: 800,
            temperature: 0.7
        });

        res.json({ summary: chatRes.choices[0].message.content });
    } catch (error) {
        console.error("HF Text Summary Error:", error);
        console.error("HF Text Summary Error (JSON):", JSON.stringify(error, null, 2)); // Log full object
        res.status(500).json({ error: "Failed to summarize text", details: error.message || JSON.stringify(error) });
    }
};

/**
 * Controller for Data to Table
 * Model: Qwen/Qwen2.5-7B-Instruct (High quality instruction following)
 */
exports.generateTable = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ error: "Data is required" });

        const hf = getClient(); // Instantiate here

        const prompt = `You are a data formatting assistant. Convert the following unstructured text into a valid JSON array of objects. 
        Ensure all objects have the same keys. Do not include any markdown formatting (like \`\`\`json), just return the raw JSON.
        
        Data:
        ${data}`;

        const chatCompletion = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000
        });

        let generatedText = chatCompletion.choices[0].message.content;

        // Clean up markdown if present
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        let tableData;
        try {
            tableData = JSON.parse(generatedText);
        } catch (e) {
            console.error("JSON Parse Error:", generatedText);
            throw new Error("Failed to parse AI output as JSON");
        }

        res.json({ table: tableData });

    } catch (error) {
        console.error("HF Table Gen Error:", error);
        res.status(500).json({ error: "Failed to generate table", details: error.message });
    }
};

/**
 * Controller for Video Upload
 * Uses Cloud Whisper (Safe Model)
 */
exports.uploadVideo = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

    const videoPath = req.file.path;
    const audioPath = path.join(path.dirname(videoPath), `${req.file.filename}.wav`);

    try {
        // 1. Extract Audio using ffmpeg -> WAV 16kHz Mono (Required for Xenova)
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .toFormat('wav')
                .audioFrequency(16000)
                .audioChannels(1)
                .on('end', resolve)
                .on('error', reject)
                .save(audioPath);
        });

        // 2. Transcribe with HuggingFace API (Remote) to save memory
        const audioBuffer = fs.readFileSync(audioPath);

        console.log("Sending audio to HF API for transcription...");
        console.log("Sending audio to HF API for transcription...");
        // const hf = getClient(); 
        // Use raw fetch to bypass specific SDK bug with file uploads/tokens

        let apiKey = process.env.HF_API_KEY;
        if (!apiKey) throw new Error("HF_API_KEY missing");
        apiKey = apiKey.trim().replace(/^["']|["']$/g, '');

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo",
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "audio/wav",
                },
                method: "POST",
                body: audioBuffer,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HF API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const asrRes = await response.json();

        const transcript = asrRes.text;
        console.log("Transcription received:", transcript ? transcript.substring(0, 50) + "..." : "Empty");

        if (!transcript || transcript.trim().length === 0) {
            throw new Error("Transcription yielded empty result from API.");
        }

        // 3. Summarize Transcript with Cloud BART
        const summaryRes = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: transcript,
            parameters: { max_length: 150, min_length: 30 }
        });

        // Cleanup
        try {
            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);
        } catch (e) { }

        res.json({ transcript, summary: summaryRes.summary_text });

    } catch (error) {
        console.error("Local Video Processing Error:", error);
        // Cleanup
        try {
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        } catch (e) { }

        res.status(500).json({ error: "Failed to process video", details: error.message });
    }
};
