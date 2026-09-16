const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

/**
 * @route POST /api/ai/generate
 * @desc Generate AI response based on student prompt & task mode
 * @access Public
 */
router.post('/generate', aiController.generateResponse);

module.exports = router;
