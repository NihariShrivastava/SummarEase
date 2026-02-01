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

const hf = new HfInference(process.env.HF_API_KEY);

// Lazy-load the transcriber to avoid startup delay
let transcriber = null;
async function getTranscriber() {
    if (!transcriber) {
        console.log("Loading local Whisper model... (this may take a moment on first run)");
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    }
    return transcriber;
}

/**
 * Controller for Text Summarization
 * Uses Qwen (Chat) for structured Markdown output
 */
exports.summarizeText = async (req, res) => {
    try {
        const { text, type } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

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
        res.status(500).json({ error: "Failed to summarize text", details: error.message });
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
 * Uses Local Whisper (Xenova) for Transcription + Cloud BART for Summary
 * Hybrid approach for maximum reliability on free tier.
 */
exports.uploadVideo = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

    const videoPath = req.file.path;
    const audioPath = path.join('uploads', `${req.file.filename}.wav`);

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

        // 2. Transcribe Locally
        // Load the model
        const pipe = await getTranscriber();

        // Read the WAV file buffer
        const buffer = fs.readFileSync(audioPath);

        // Parse the WAV file
        const wav = new wavefile.WaveFile(buffer);
        wav.toBitDepth('32f'); // Convert to 32-bit float
        const audioData = wav.getSamples();

        // If stereo, getSamples returns 2 channels. We need mono. 
        // But we forced ffmpeg to mono (audioChannels(1)), so audioData should be a Float64Array (or similar) of samples
        // Check if it's an array of arrays (multi-channel) or single array
        let rawAudio = audioData;
        if (Array.isArray(audioData)) {
            // If multiple channels, take the first one
            rawAudio = audioData[0];
        }

        // Run inference with the raw audio object
        const output = await pipe(rawAudio);
        const transcript = output.text;

        if (!transcript || transcript.trim().length === 0) {
            throw new Error("Transcription yielded empty result.");
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
