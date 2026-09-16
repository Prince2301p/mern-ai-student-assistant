# Assignment 2 Technical & Architecture Report 📊
**Candidate**: Prince  
**Role**: MERN Stack Front End Developer Intern  
**Date**: September 2026  

---

## 1. Executive Summary

This report presents a thorough technical evaluation and architectural breakdown of the **AI-Powered Student Assistant (ScholarAI)** full-stack web application. The application enables university students to leverage Google Gemini LLM capabilities across four specialized task modes (*Explain Concept*, *Generate MCQs*, *Summarize Text*, and *Improve Writing Quality*).

The implementation adheres to modern MERN stack standards, emphasizing strict component modularity, prompt engineering guardrails, state isolation, and production-grade user interface design.

---

## 2. System Architecture & Data Flow

### 2.1 Decoupled Layer Architecture

```text
[ React 18 Single Page App ]
       │
       ▼ (HTTP POST /api/ai/generate via Axios Client)
[ Express.js REST API Controller ]
       │
       ▼ (Data Validation & Task Mode Routing)
[ AI Service Layer (ai.service.js) ] ◄── [ Dynamic Prompt Construction Engine ]
       │
       ▼ (Google Generative AI SDK - gemini-1.5-flash)
[ Google Gemini LLM API ]
```

### 2.2 Key Architectural Patterns Enforced
- **Service Layer Separation**: The AI interaction logic is completely decoupled from route handlers and HTTP controllers, satisfying the assignment requirement that raw LLM calls reside in a dedicated helper file (`server/services/ai.service.js`).
- **Resilient Fallback Mode**: If `GEMINI_API_KEY` is absent or unconfigured, the AI service automatically engages a structured simulation engine, preventing runtime crashes during local offline testing.
- **Client-Side State Persistence**: Recent queries and responses are automatically synced to browser `localStorage`, granting students quick retrieval of historical study materials.

---

## 3. Component Architecture & UI System

### 3.1 Functional Component Breakdown

| Component Name | Responsibility | Key Features |
| :--- | :--- | :--- |
| `Home.jsx` | Main Page Container | Coordinates state across form inputs, response display, history drawer, and health checks. |
| `Navbar.jsx` | Application Header | Brand identity, API server connection badge, theme toggle, history toggle. |
| `InputForm.jsx` | Student Input Interface | Mode selection cards, text area with live character counter (0-3000), sample prompt chips, submit/clear actions. |
| `ResponseBox.jsx` | AI Response Presenter | Markdown renderer, skeleton loader, word counter, copy-to-clipboard utility. |
| `MCQCard.jsx` | Interactive Quiz Card | JSON payload parsing, option selection, instant correct/incorrect visual feedback, score summary. |
| `HistoryList.jsx` | Query History Drawer | Slide-out overlay displaying recent queries, mode badges, and item reloading. |

### 3.2 Design System Tokens
- **Typography**: `Outfit` for display headings and `Inter` for interface prose.
- **Color Palette**: Deep slate background (`bg-slate-950`), vibrant indigo accents (`indigo-500` / `indigo-600`), and soft dark mode borders (`border-slate-800`).
- **Glassmorphism**: Backdrop blur overlays (`backdrop-blur-md`) with translucent backgrounds (`bg-slate-900/80`).

---

## 4. Prompt Engineering & Guardrail Framework

The system utilizes structured prompt construction rather than passing raw user input.

```text
Prompt = [Role Definition] + [Context] + [Explicit Constraints] + [Guardrails] + [Output Formatting] + [User Input]
```

### 4.1 Task Mode Matrix

| Mode | Assigned Persona | Core Constraints | Output Format |
| :--- | :--- | :--- | :--- |
| **Explain** | University Instructor | Beginner-friendly, <150 words, practical analogy | Formatted Markdown |
| **MCQ** | Assessment Specialist | 4 questions, 4 options, 1 correct answer, explanation | Strict Valid JSON |
| **Summarize** | Summarization Assistant | Bullet points, extract key takeaways, omit fluff | Bulleted Markdown |
| **Improve** | Academic Writing Editor | Fix grammar/spelling, preserve original intent, add change summary | Formatted Markdown |

### 4.2 Anti-Hallucination Guardrails
To prevent LLM hallucinations, system prompts explicitly instruct:
> *"Guardrail: If you are not confident that reliable information exists for this topic, state clearly: 'I do not have sufficient reliable information to explain this concept accurately.' Do NOT invent or fabricate facts."*

---

## 5. Quality Assurance & Automated Verification

### 5.1 Automated Backend Test Suite
The project includes a native test runner (`server/test-api.js`) verifying:
1. HTTP 400 rejection on empty prompts.
2. HTTP 400 rejection on invalid task modes.
3. Successful HTTP 200 payload generation across all 4 modes.
4. Valid JSON structure and array lengths for MCQ responses.

### 5.2 Verification Summary
- **Backend Tests**: 6 / 6 Passed
- **Frontend Build**: Built in 3.79s via Vite with 0 syntax or lint errors.

---

## 6. Conclusion

The application successfully satisfies all functional, architectural, and documentation requirements for the MERN Stack Front End Developer Internship assignment.
