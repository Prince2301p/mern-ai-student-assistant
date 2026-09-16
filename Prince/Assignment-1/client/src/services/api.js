import axios from 'axios';

// Base API setup
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/ai';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for LLM generation
});

/**
 * Sends student prompt and task mode to backend Express API.
 * @param {string} prompt - User input query or text
 * @param {string} mode - Task mode ('explain', 'mcq', 'summarize', 'improve')
 * @returns {Promise<object>} Response data from server
 */
export const generateAIResponse = async (prompt, mode) => {
  try {
    const response = await apiClient.post('/generate', {
      prompt,
      mode,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Server error generating AI response');
    } else if (error.request) {
      throw new Error('Unable to connect to AI server. Please check backend connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};

/**
 * Health check verification function
 */
export const checkServerHealth = async () => {
  try {
    const res = await axios.get('/api/health');
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};
