const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HF_API_KEY);

async function run() {
    console.log("Testing Qwen...");
    try {
        const chatRes = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [{ role: "user", content: "Say 'Qwen Works' if you see this." }],
            max_tokens: 10
        });
        console.log("✅ Qwen Result:", chatRes.choices[0].message.content);
    } catch (e) {
        console.error("❌ Qwen Error:", e.name, e.message);
    }
}

run();
