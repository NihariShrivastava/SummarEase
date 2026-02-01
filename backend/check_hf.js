const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HF_API_KEY;

// List of potential endpoints
const endpoints = [
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    "https://router.huggingface.co/models/facebook/bart-large-cnn",
    "https://router.huggingface.co/facebook/bart-large-cnn",
    "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
];

async function check() {
    console.log("--- START CHECK ---");
    for (const url of endpoints) {
        try {
            console.log(`Checking: ${url}`);
            const res = await axios.post(url,
                { inputs: "Hello" },
                { headers: { Authorization: `Bearer ${API_KEY}` }, timeout: 10000 }
            );
            console.log(`[${res.status}] ${url}`);
        } catch (err) {
            console.log(`[${err.response ? err.response.status : 'ERR'}] ${url} - ${err.message}`);
            if (err.response?.data) {
                try {
                    console.log("Msg:", JSON.stringify(err.response.data));
                } catch (e) { }
            }
        }
    }
    console.log("--- END CHECK ---");
}

check();
