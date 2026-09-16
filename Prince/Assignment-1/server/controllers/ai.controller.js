const aiService = require('../services/ai.service');

// List of allowed task modes
const ALLOWED_MODES = ['explain', 'mcq', 'summarize', 'improve'];

/**
 * Controller handler for POST /api/ai/generate
 */
const generateResponse = async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    // 1. Validate prompt presence
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required and must be a non-empty string.',
      });
    }

    // 2. Validate mode presence and allowed values
    if (!mode || typeof mode !== 'string' || !ALLOWED_MODES.includes(mode.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid or missing task mode. Allowed modes are: ${ALLOWED_MODES.join(', ')}`,
      });
    }

    const selectedMode = mode.toLowerCase().trim();
    const userPrompt = prompt.trim();

    // 3. Call AI Service logic (separated from controller)
    const result = await aiService.generateResponse(userPrompt, selectedMode);

    // 4. Send successful response
    return res.status(200).json({
      success: true,
      mode: selectedMode,
      response: result.raw,
      data: result.data,
      isJson: result.isJson,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI response. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  generateResponse,
  ALLOWED_MODES,
};
