const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function getModels() {
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const stream = fs.createWriteStream('models_list.txt');
        response.data.models.forEach(m => {
            stream.write(`${m.name}\n`);
        });
        stream.end();
        console.log("Written to models_list.txt");
    } catch (error) {
        console.error("Error fetching models:", error.response ? error.response.data : error.message);
    }
}

getModels();
