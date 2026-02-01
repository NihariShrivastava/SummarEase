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
    res.json({
        status: 'ok',
        env: {
            node_version: process.version,
            has_hf_key: !!process.env.HF_API_KEY,
            key_length: process.env.HF_API_KEY ? process.env.HF_API_KEY.length : 0
        }
    });
});

module.exports = router;
