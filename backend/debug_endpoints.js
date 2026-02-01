const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HF_API_KEY;

const configs = [
    {
        name: "Old Domain - BART",
        url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    },
    {
        name: "Router Domain - BART",
        url: "https://router.huggingface.co/models/facebook/bart-large-cnn"
    },
    {
        name: "Router HF-Inf Path - BART",
        url: "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
    },
    {
        name: "Old Domain - Mistral",
        url: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
    }
];

async function check() {
    console.log("--- START DEBUG ---");
    for (const config of configs) {
        try {
            console.log(`Checking: ${config.name} (${config.url})`);
            const res = await axios.post(config.url,
                { inputs: "Hello world" },
                { headers: { Authorization: `Bearer ${API_KEY}` }, timeout: 8000 }
            );
            console.log(`✅ SUCCESS [${res.status}]`);
        } catch (err) {
            console.log(`❌ FAILED [${err.response ? err.response.status : 'ERR'}] - ${err.message}`);
            if (err.response?.data) {
                try {
                    const dataStr = JSON.stringify(err.response.data);
                    console.log(`   Msg: ${dataStr.substring(0, 100)}`);
                } catch (e) { }
            }
        }
        console.log("---");
    }
    console.log("--- END DEBUG ---");
}

check();
