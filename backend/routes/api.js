const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const aiController = require('../controllers/aiController');


// Route for video upload
router.post('/upload-video', upload.single('video'), aiController.uploadVideo);

// Route for text summarization
router.post('/summarize-text', aiController.summarizeText);

// Route for table generation
router.post('/generate-table', aiController.generateTable);

// Debug/Health Route
router.get('/health', (req, res) => {
    const rawKey = process.env.HF_API_KEY || '';
    const sanitizedKey = rawKey.trim().replace(/^["']|["']$/g, '');

    res.json({
        status: 'ok',
        env: {
            node_version: process.version,
            has_raw_key: !!rawKey,
            raw_key_length: rawKey.length,
            sanitized_key_length: sanitizedKey.length,
            starts_with_hf: sanitizedKey.startsWith('hf_'),
            contains_quotes: rawKey.includes('"') || rawKey.includes("'")
        }
    });
});

module.exports = router;
