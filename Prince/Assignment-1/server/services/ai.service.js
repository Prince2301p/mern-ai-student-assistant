const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to construct structured prompts and interface with Google Gemini API.
 */
class AIService {
  constructor() {
    // Initialize Gemini API client if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.isConfigured = true;
    } else {
      this.genAI = null;
      this.isConfigured = false;
      console.warn('⚠️ GEMINI_API_KEY is not set or using placeholder. Running in fallback simulation mode.');
    }
  }

  /**
   * Constructs a structured prompt based on task mode, role, rules, and guardrails.
   * @param {string} userInput - Raw input provided by student
   * @param {string} mode - Selected task mode
   * @returns {string} - Formatted prompt string
   */
  buildPrompt(userInput, mode) {
    const cleanInput = userInput.trim();

    switch (mode) {
      case 'explain':
        return `You are an experienced university instructor.
Your task is to explain the following academic/technical concept to a beginner student.

Rules & Constraints:
- Use simple, intuitive, and clear language.
- Avoid overly complex jargon; explain essential terms if used.
- Provide a brief, practical real-world example if helpful.
- Keep the explanation under 150 words.
- Guardrail: If you are not confident that reliable information exists for this concept, state clearly: "I do not have sufficient reliable information to explain this concept accurately." Do NOT invent or fabricate facts.

Concept:
${cleanInput}`;

      case 'mcq':
        return `You are an experienced university professor and assessment creator.
Your task is to generate 4 multiple-choice questions (MCQs) based on the topic provided.

Rules & Constraints:
- Generate exactly 4 multiple-choice questions.
- Each question must have exactly 4 distinct options.
- Exactly ONE option must be the correct answer.
- Provide a brief 1-sentence explanation for why the answer is correct.
- Guardrail: Do NOT fabricate facts. If reliable information is unavailable for this topic, return a JSON with an error key.
- Output Format: You must return ONLY a raw valid JSON object. Do NOT include markdown code blocks, backticks (e.g. \`\`\`json), or conversational text.

Required JSON Structure:
{
  "topic": "${cleanInput.replace(/"/g, '\\"')}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correctAnswer": "Option A text",
      "explanation": "Brief explanation why this option is correct."
    }
  ]
}

Topic:
${cleanInput}`;

      case 'summarize':
        return `You are an academic summarization assistant.
Your task is to summarize the following text for a university student.

Rules & Constraints:
- Extract the core key takeaways and main concepts.
- Format the summary using bullet points for high readability.
- Remove unnecessary fluff and repetition.
- Guardrail: Do NOT add information or assumptions that are not present in the original text.
- Guardrail: If the input text is unclear or incoherent, explicitly mention the ambiguity.
- Keep the summary concise and direct.

Text to Summarize:
${cleanInput}`;

      case 'improve':
        return `You are a senior academic writing assistant and editor.
Your task is to improve the writing quality of the following text.

Rules & Constraints:
- Correct all grammatical, spelling, and punctuation errors.
- Enhance clarity, readability, and sentence flow.
- Maintain an appropriate, professional academic tone.
- Guardrail: Preserve the original core meaning and intent of the author entirely. Do NOT insert unsupported claims.
- After the improved text, include a brief "Key Enhancements Made" section listing 2-3 bullet points of changes.

Original Text:
${cleanInput}`;

      default:
        throw new Error(`Unsupported task mode: ${mode}`);
    }
  }

  /**
   * Generates AI response using Gemini API or mock fallback.
   * @param {string} prompt - User input string
   * @param {string} mode - Task mode ('explain', 'mcq', 'summarize', 'improve')
   * @returns {Promise<object>} - Result object containing raw content & parsed data if applicable
   */
  async generateResponse(prompt, mode) {
    const structuredPrompt = this.buildPrompt(prompt, mode);

    // If Gemini API Key is configured, make actual LLM API call
    if (this.isConfigured) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(structuredPrompt);
        const response = await result.response;
        const textResponse = response.text() || '';
        return this.parseAndFormatOutput(textResponse, mode);
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Secondary attempt with gemini-1.5-pro if flash fails
        try {
          const fallbackModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
          const result = await fallbackModel.generateContent(structuredPrompt);
          const response = await result.response;
          return this.parseAndFormatOutput(response.text() || '', mode);
        } catch (secErr) {
          throw new Error(`AI Generation Error: ${error.message}`);
        }
      }
    }

    // Fallback simulation mode for testing without an active API key
    return this.generateMockResponse(prompt, mode);
  }

  /**
   * Cleans and formats the raw text response based on mode (e.g. JSON parsing for MCQs)
   */
  parseAndFormatOutput(rawText, mode) {
    if (mode === 'mcq') {
      try {
        // Strip markdown backticks if present
        let cleanedJson = rawText.trim();
        if (cleanedJson.startsWith('```json')) {
          cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        } else if (cleanedJson.startsWith('```')) {
          cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/```\s*$/, '');
        }

        const parsedData = JSON.parse(cleanedJson);
        return {
          raw: rawText,
          data: parsedData,
          isJson: true,
        };
      } catch (jsonErr) {
        console.warn('Failed to parse MCQ JSON output directly:', jsonErr.message);
        return {
          raw: rawText,
          data: null,
          isJson: false,
        };
      }
    }

    return {
      raw: rawText,
      data: rawText,
      isJson: false,
    };
  }

  /**
   * Generates realistic structured mock responses when GEMINI_API_KEY is not configured.
   */
  generateMockResponse(userInput, mode) {
    const topic = userInput.trim();

    if (mode === 'explain') {
      return {
        raw: `[Simulated Gemini Response]\n\n**${topic}** is a fundamental concept. A JavaScript closure, for example, is a feature where an inner function retains access to variables in its outer enclosing function's scope, even after that outer function has finished executing.\n\nImagine a backpack: whenever a function is created, it packs along all the variables available in its surrounding environment so it can use them anytime later.`,
        data: `**${topic}** is a fundamental concept. A JavaScript closure, for example, is a feature where an inner function retains access to variables in its outer enclosing function's scope, even after that outer function has finished executing.\n\nImagine a backpack: whenever a function is created, it packs along all the variables available in its surrounding environment so it can use them anytime later.`,
        isJson: false,
      };
    }

    if (mode === 'mcq') {
      const mockMcq = {
        topic: topic,
        questions: [
          {
            id: 1,
            question: `Which statement best describes ${topic}?`,
            options: [
              `It allows inner functions to access scope variables of parent functions.`,
              `It is a method used exclusively for styling CSS elements.`,
              `It immediately closes the database connection.`,
              `It replaces standard HTML tags with dynamic elements.`
            ],
            correctAnswer: `It allows inner functions to access scope variables of parent functions.`,
            explanation: `Closures allow inner functions to remember and access variables from their outer scope even after execution.`
          },
          {
            id: 2,
            question: `Where are variables stored in a closure environment?`,
            options: [
              `In the global browser cookies`,
              `In the lexical environment scope chain`,
              `In local storage as strings`,
              `In external CSS stylesheets`
            ],
            correctAnswer: `In the lexical environment scope chain`,
            explanation: `Closures maintain references to variables in their lexical environment scope chain.`
          },
          {
            id: 3,
            question: `What primary benefit do closures provide in module design patterns?`,
            options: [
              `Data privacy and encapsulation`,
              `Faster CSS grid rendering`,
              `Automatic server deployment`,
              `GPU hardware acceleration`
            ],
            correctAnswer: `Data privacy and encapsulation`,
            explanation: `Closures enable private variable state encapsulation in JavaScript modules.`
          },
          {
            id: 4,
            question: `What risk can occur if closures reference heavy objects indefinitely?`,
            options: [
              `Memory leak / increased memory usage`,
              `Database corruptions`,
              `Syntax compilation error`,
              `Operating system restart`
            ],
            correctAnswer: `Memory leak / increased memory usage`,
            explanation: `Retaining reference to outer variables prevents garbage collection, potentially causing memory leaks.`
          }
        ]
      };

      return {
        raw: JSON.stringify(mockMcq, null, 2),
        data: mockMcq,
        isJson: true,
      };
    }

    if (mode === 'summarize') {
      return {
        raw: `### Core Summary Points:\n\n- **Primary Concept**: ${topic} outlines essential operational principles for modern web applications.\n- **Key Functionality**: Facilitates modular component architecture and efficient client-server data flow.\n- **Practical Takeaway**: Understanding this topic empowers developers to write cleaner, more maintainable code with reduced bug frequency.`,
        data: `### Core Summary Points:\n\n- **Primary Concept**: ${topic} outlines essential operational principles for modern web applications.\n- **Key Functionality**: Facilitates modular component architecture and efficient client-server data flow.\n- **Practical Takeaway**: Understanding this topic empowers developers to write cleaner, more maintainable code with reduced bug frequency.`,
        isJson: false,
      };
    }

    if (mode === 'improve') {
      return {
        raw: `### Improved Text:\n${topic.charAt(0).toUpperCase() + topic.slice(1)}. Understanding this concept thoroughly enhances software development efficiency and code quality.\n\n### Key Enhancements Made:\n- Corrected grammatical structure and phrasing.\n- Enhanced clarity and professional academic tone.\n- Preserved the original meaning and core intent of the input text.`,
        data: `### Improved Text:\n${topic.charAt(0).toUpperCase() + topic.slice(1)}. Understanding this concept thoroughly enhances software development efficiency and code quality.\n\n### Key Enhancements Made:\n- Corrected grammatical structure and phrasing.\n- Enhanced clarity and professional academic tone.\n- Preserved the original meaning and core intent of the input text.`,
        isJson: false,
      };
    }

    return {
      raw: `AI response generated for mode ${mode}.`,
      data: `AI response generated for mode ${mode}.`,
      isJson: false,
    };
  }
}

module.exports = new AIService();
