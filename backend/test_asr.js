const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HF_API_KEY);

const models = [
    "openai/whisper-tiny",
    "openai/whisper-base",
    "facebook/wav2vec2-large-960h-lv60-self",
    "facebook/s2t-small-librispeech-asr"
];

// Create a minimal dummy WAV header + silence (just to trigger the model, even if it fails decoding)
// This is better than sending random text bytes.
const wavHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x24, 0x00, 0x00, 0x00, // ChunkSize
    0x57, 0x41, 0x56, 0x45, // WAVE
    0x66, 0x6d, 0x74, 0x20, // fmt 
    0x10, 0x00, 0x00, 0x00, // Subchunk1Size
    0x01, 0x00,          // AudioFormat (PCM)
    0x01, 0x00,          // NumChannels (1)
    0x44, 0xac, 0x00, 0x00, // SampleRate (44100)
    0x88, 0x58, 0x01, 0x00, // ByteRate
    0x02, 0x00,          // BlockAlign
    0x10, 0x00,          // BitsPerSample
    0x64, 0x61, 0x74, 0x61, // data
    0x00, 0x00, 0x00, 0x00  // Subchunk2Size (0)
]);

async function check() {
    console.log("--- PROBING ASR MODELS ---");
    for (const model of models) {
        try {
            console.log(`Checking: ${model}`);
            // We expect this to fail with "Audio too short" or similar if the model is ACTIVE.
            // We expect "No Inference Provider" if the model is INACTIVE.
            const res = await hf.automaticSpeechRecognition({
                model: model,
                data: wavHeader
            });
            console.log(`✅ ALIVE (Success):`, res.text);
        } catch (err) {
            const msg = err.message || "";
            if (msg.includes("No Inference Provider")) {
                console.log(`❌ DEAD (No Provider)`);
            } else if (msg.includes("credits")) {
                console.log(`❌ PAID ONLY`);
            } else {
                // If it's a processing error (like invalid file), the model is actually ALIVE!
                console.log(`✅ ALIVE (Processing Error): ${msg.substring(0, 50)}`);
            }
        }
        console.log("---");
    }
}

check();
