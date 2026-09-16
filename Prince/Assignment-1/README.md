# ScholarAI - AI-Powered Student Assistant 🎓✨
*(MERN Stack + Google Gemini AI Integration & Prompt Engineering)*

ScholarAI is a full-stack MERN application designed to assist university and college students with complex academic tasks using structured Google Gemini LLM prompt engineering. 

The application allows students to input a concept, topic, or text fragment, select one of four specialized AI task modes, and receive structured, high-quality, anti-hallucinated AI responses.

---

## 🌟 Key Features

- 🎓 **Explain a Concept**: Simplifies complex technical and academic concepts using beginner-friendly language, practical examples, and a 150-word constraint.
- 📝 **Generate Interactive MCQs**: Produces 4 multiple-choice assessment questions in strict JSON format, rendered inside an interactive React Quiz component with instant answer checking and explanations.
- 📌 **Summarize Text**: Distills long academic articles and notes into structured bullet points preserving core takeaways.
- ✨ **Improve Writing Quality**: Polishes grammar, spelling, clarity, and academic tone while preserving original intent.
- 🛡️ **Anti-Hallucination Guardrails**: Prompts explicitly instruct the model to report uncertainty when reliable information is missing rather than fabricating facts.
- 🎨 **Modern Sleek UI**: Built with React 18, Vite, Tailwind CSS, Lucide Icons, Glassmorphism design system, and Light/Dark Mode toggle.
- 📜 **Local Storage Query History**: Saves recent queries locally, allowing students to reload previous AI responses anytime.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS 4, Axios, Lucide React Icons, React Markdown |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **AI Integration** | Google Gemini API (`@google/generative-ai` SDK - `gemini-1.5-flash`) |
| **Testing** | Node.js native HTTP test suite (`server/test-api.js`) |

---

## 📁 Project Architecture & Structure

```
ai-student-assistant/
│
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Functional Components
│   │   │   ├── Navbar.jsx       # Header with branding, status & theme toggle
│   │   │   ├── InputForm.jsx    # Textarea, mode chips, char counter & actions
│   │   │   ├── ResponseBox.jsx  # Markdown viewer, skeleton loader & copy tool
│   │   │   ├── MCQCard.jsx      # Interactive JSON quiz component
│   │   │   └── HistoryList.jsx  # Slide-out drawer for saved query history
│   │   ├── pages/
│   │   │   └── Home.jsx         # Main container coordinating layout & state
│   │   ├── services/
│   │   │   └── api.js           # Axios API client for POST /api/ai/generate
│   │   ├── App.jsx
│   │   ├── index.css            # Tailwind CSS & Glassmorphism theme tokens
│   │   └── main.jsx             # React DOM entry point
│   ├── vite.config.js           # Vite server proxy configuration
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── routes/
│   │   └── ai.routes.js         # Endpoint mapping for /api/ai/generate
│   ├── controllers/
│   │   └── ai.controller.js     # Request validation & HTTP error handling
│   ├── services/
│   │   └── ai.service.js        # Prompt engineering logic & Gemini API calls
│   ├── test-api.js              # Automated backend test suite
│   ├── app.js                   # Express app setup & CORS middleware
│   ├── server.js                # Server entry point
│   ├── .env.example             # Environment variables template
│   └── package.json
│
├── .gitignore                   # Ignores .env and node_modules
├── package.json                 # Root script runner (concurrent execution)
└── README.md                    # Technical documentation & prompt report
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **Google Gemini API Key**: Obtain a free key from [Google AI Studio](https://aistudio.google.com/).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-student-assistant.git
cd ai-student-assistant
```

### 2. Install Dependencies
Run the installation command in the root folder to install packages for root, server, and client:
```bash
npm run install:all
```
*(Or manually run `npm install` inside both `server/` and `client/` directories)*.

### 3. Environment Variable Configuration
Navigate to the `server/` directory and create a `.env` file based on `.env.example`:

```bash
# server/.env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Note**: If `GEMINI_API_KEY` is not provided or set to the placeholder, the backend automatically operates in **Simulation Fallback Mode**, allowing full offline UI testing without crashing!

---

## 💻 How to Run the Application

### Option A: Run Client & Server Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

### Option B: Run Services Separately
In Terminal 1 (Backend):
```bash
cd server
npm run dev
```
In Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

---

## 📡 Backend API Documentation

### **Endpoint**: `POST /api/ai/generate`

#### Request Headers
`Content-Type: application/json`

#### Request Body Schema
```json
{
  "prompt": "Explain JavaScript closures",
  "mode": "explain"
}
```

#### Allowed Task Modes:
- `"explain"`: Explain a concept in simple language
- `"mcq"`: Generate 4 interactive multiple-choice questions
- `"summarize"`: Summarize long text into bullet points
- `"improve"`: Polish writing quality and grammar

#### Sample Response (Explain Mode)
```json
{
  "success": true,
  "mode": "explain",
  "response": "A JavaScript closure is created when an inner function retains access to variables in its outer enclosing function's scope...",
  "data": "A JavaScript closure is created...",
  "isJson": false,
  "timestamp": "2026-09-16T15:00:00.000Z"
}
```

#### Sample Response (MCQ Mode)
```json
{
  "success": true,
  "mode": "mcq",
  "response": "{\n  \"topic\": \"DBMS Normalization\",\n  \"questions\": [...] \n}",
  "data": {
    "topic": "DBMS Normalization",
    "questions": [
      {
        "id": 1,
        "question": "Which normal form removes partial functional dependencies?",
        "options": ["1NF", "2NF", "3NF", "BCNF"],
        "correctAnswer": "2NF",
        "explanation": "2NF requires the table to be in 1NF and all non-key attributes to be fully dependent on the primary key."
      }
    ]
  },
  "isJson": true
}
```

#### Error Response Examples
- **Missing Prompt (HTTP 400)**:
  ```json
  { "success": false, "message": "Prompt is required and must be a non-empty string." }
  ```
- **Invalid Task Mode (HTTP 400)**:
  ```json
  { "success": false, "message": "Invalid or missing task mode. Allowed modes are: explain, mcq, summarize, improve" }
  ```

---

## 🧠 Mandatory Prompt Engineering Explanation

Raw user input is **never** sent directly to the Gemini LLM. The AI call logic is encapsulated inside `server/services/ai.service.js`, where structured prompts are dynamically built based on the selected mode.

### 1. Structure of Prompts
Every prompt follows a strict 5-part architecture:
1. **Role Definition**: Assigns an academic persona to the AI model (e.g., *Experienced University Instructor*, *Assessment Creator*).
2. **Task Context**: Sets clear boundaries on what the user wants to accomplish.
3. **Explicit Rules & Constraints**: Sets quantitative constraints (word count under 150 words, exact 4 options per question).
4. **Anti-Hallucination Guardrails**: Mandates stating uncertainty if facts are missing.
5. **Output Formatting Instructions**: Enforces markdown formatting or clean JSON schemas.

---

### 2. Deep Dive into Task Modes

#### A. Explain Mode (`explain`)
- **Role**: Experienced University Instructor.
- **Constraints**: Simple language, under 150 words limit, real-world analogies.
- **Prompt Template**:
  ```text
  You are an experienced university instructor.
  Your task is to explain the following academic/technical concept to a beginner student.

  Rules & Constraints:
  - Use simple, intuitive, and clear language.
  - Avoid overly complex jargon; explain essential terms if used.
  - Provide a brief, practical real-world example if helpful.
  - Keep the explanation under 150 words.
  - Guardrail: If you are not confident that reliable information exists, state clearly: "I do not have sufficient reliable information to explain this concept accurately." Do NOT invent or fabricate facts.

  Concept: {{userInput}}
  ```

#### B. Generate MCQs Mode (`mcq`)
- **Role**: Assessment Creation Specialist.
- **Constraints**: Exactly 4 questions, 4 options each, exactly 1 correct answer, 1-sentence explanation, strict JSON schema output without markdown backticks.
- **Why JSON output constraint?**: Enables the React frontend to parse raw AI text into interactive React Quiz components where students can select options, view instant correct/incorrect visual feedback, and calculate quiz scores.
- **Prompt Template**:
  ```text
  You are an experienced university professor and assessment creator.
  Your task is to generate 4 multiple-choice questions (MCQs) based on the topic provided.

  Rules & Constraints:
  - Generate exactly 4 multiple-choice questions.
  - Each question must have exactly 4 distinct options.
  - Exactly ONE option must be the correct answer.
  - Provide a brief 1-sentence explanation for why the answer is correct.
  - Output Format: Return ONLY a raw valid JSON object. Do NOT include markdown code blocks.

  Required JSON Structure:
  {
    "topic": "{{userInput}}",
    "questions": [
      {
        "id": 1,
        "question": "Question text",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A",
        "explanation": "Why option A is correct."
      }
    ]
  }

  Topic: {{userInput}}
  ```

#### C. Summarize Text Mode (`summarize`)
- **Role**: Academic Summarization Assistant.
- **Constraints**: Extract core takeaways, bullet point format, concise, zero extrapolation.
- **Prompt Template**:
  ```text
  You are an academic summarization assistant.
  Summarize the following text for a university student.

  Rules & Constraints:
  - Extract the core key takeaways and main concepts.
  - Format the summary using bullet points for high readability.
  - Guardrail: Do NOT add information or assumptions that are not present in the original text.
  - Guardrail: If the input text is unclear, explicitly mention the ambiguity.

  Text to Summarize: {{userInput}}
  ```

#### D. Improve Writing Quality Mode (`improve`)
- **Role**: Senior Academic Writing Coach & Editor.
- **Constraints**: Correct grammar/spelling, preserve original meaning, academic tone, include a "Key Enhancements Made" section.
- **Prompt Template**:
  ```text
  You are a senior academic writing assistant and editor.
  Improve the writing quality of the following text.

  Rules & Constraints:
  - Correct all grammatical, spelling, and punctuation errors.
  - Enhance clarity, readability, and sentence flow.
  - Maintain an appropriate, professional academic tone.
  - Guardrail: Preserve the original core meaning and intent of the author entirely.
  - Include a brief "Key Enhancements Made" section listing 2-3 bullet points.

  Original Text: {{userInput}}
  ```

---

## 🛡️ Guardrails Rationale

Prompt guardrails are critical for LLM deployment in academic environments:
- **Reducing Hallucination**: Instructing the model to admit when reliable information is missing prevents students from studying fabricated concepts.
- **Context Isolation**: For summarization and rewriting, guardrails enforce that no external claims are inserted into student essays.
- **Format Reliability**: Formatting constraints ensure predictable API structures for seamless client-side parsing.

---

## 🧪 Automated Verification & Testing

The backend includes a native verification runner located in `server/test-api.js`.

Run the automated test suite:
```bash
node server/test-api.js
```

### Test Coverage:
1. `POST /api/ai/generate` missing prompt input validation (HTTP 400)
2. `POST /api/ai/generate` invalid mode validation (HTTP 400)
3. Mode `"explain"` execution & text structure
4. Mode `"mcq"` JSON parsing & question count verification
5. Mode `"summarize"` execution
6. Mode `"improve"` execution

---

## 📄 License

This project is submitted as an assignment for the **MERN Stack Front End Developer Intern** position. All rights reserved.
