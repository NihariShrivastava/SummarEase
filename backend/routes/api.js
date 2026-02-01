const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const aiController = require('../controllers/aiController');

// Video Route
router.post('/upload-video', upload.single('video'), aiController.uploadVideo);

// Text Route
router.post('/summarize-text', aiController.summarizeText);

// Data Route
router.post('/generate-table', aiController.generateTable);

module.exports = router;
