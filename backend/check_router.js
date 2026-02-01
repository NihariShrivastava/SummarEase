const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.HF_API_KEY;

const urls = [
    "https://router.huggingface.co/facebook/bart-large-cnn",
    "https://router.huggingface.co/models/facebook/bart-large-cnn",
    "https://router.huggingface.co/v1/models/facebook/bart-large-cnn"
];

async function run() {
    console.log("START");
    for (const url of urls) {
        try {
            console.log(`Checking: ${url}`);
            const res = await axios.post(url, { inputs: "Hello" }, { headers: { Authorization: `Bearer ${API_KEY}` } });
            console.log(`SUCCESS: ${res.status}`);
            console.log(JSON.stringify(res.data).substring(0, 50));
        } catch (e) {
            console.log(`FAIL [${e.response?.status}]: ${e.message}`);
        }
        console.log("--");
    }
    console.log("END");
}
run();
