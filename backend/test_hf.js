const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.HF_API_KEY;
const MODEL = "facebook/bart-large-cnn";
const TEXT = "This is a test sentence to check the API connection.";

const urls = [
    `https://api-inference.huggingface.co/models/${MODEL}`,
    `https://router.huggingface.co/models/${MODEL}`,
    `https://router.huggingface.co/${MODEL}`,
    `https://router.huggingface.co/hf-inference/models/${MODEL}`
];

async function log(msg) {
    console.log(msg);
    fs.appendFileSync('hf_test_result.txt', msg + '\n');
}

async function testUrl(url) {
    await log(`Testing: ${url}`);
    try {
        const response = await axios.post(
            url,
            { inputs: TEXT },
            {
                headers: { Authorization: `Bearer ${API_KEY}` },
                timeout: 5000
            }
        );
        await log(`SUCCESS [${url}]: ${response.status}`);
    } catch (error) {
        await log(`FAILED [${url}]: ${error.response ? error.response.status : error.message}`);
        if (error.response?.data) await log("Error Data: " + JSON.stringify(error.response.data));
    }
    await log("-------------------");
}

async function run() {
    fs.writeFileSync('hf_test_result.txt', 'Starting Test...\n');
    for (const url of urls) {
        await testUrl(url);
    }
}

run();
