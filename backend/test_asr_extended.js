const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HF_API_KEY);

const models = [
    "facebook/wav2vec2-large-960h-lv60-self",
    "facebook/wav2vec2-base-960h",
    "microsoft/speecht5_asr",
    "openai/whisper-tiny.en",
    "openai/whisper-small.en"
];

const wavHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
    0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20,
    0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00,
    0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61,
    0x00, 0x00, 0x00, 0x00
]);

async function check() {
    console.log("--- PROBING ---");
    for (const model of models) {
        try {
            console.log(`Checking: ${model}`);
            const res = await hf.automaticSpeechRecognition({
                model: model,
                data: wavHeader
            });
            console.log(`✅ ALIVE: ${model}`);
            // If we found one, we can stop or keep checking.
            // But let's seeing the first one is enough? 
            // Wav2Vec2 output might be uppercase, but that's fine.
        } catch (err) {
            const msg = err.message || "";
            if (msg.includes("No Inference Provider")) console.log(`❌ DEAD: ${model}`);
            else if (msg.includes("credits")) console.log(`❌ PAID: ${model}`);
            else console.log(`✅ ALIVE (Error): ${model} - ${msg.substring(0, 30)}`);
        }
    }
}

check();
