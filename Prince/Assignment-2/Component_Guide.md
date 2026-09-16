# Assignment 2 - Component Design Guide 🎨📘
**Candidate**: Prince  
**Role**: MERN Stack Front End Developer Intern  
**Project**: AI-Powered Student Assistant (ScholarAI)

---

## 1. Overview & Component Catalog

This guide provides a detailed technical reference for all React functional components developed for the ScholarAI application. Each component is designed for reusability, strict prop validation, responsive layout adaptability, and seamless integration with Tailwind CSS.

---

## 2. Global Design System & Styling Tokens

### 2.1 Palette Tokens
- **Primary Background**: `bg-slate-950` (#020617) / `bg-slate-900` (#0f172a)
- **Primary Accent**: `from-indigo-600 to-purple-600`
- **Text Color Primary**: `text-slate-100` (#f8fafc)
- **Text Color Secondary**: `text-slate-400` (#94a3b8)
- **Border Tokens**: `border-slate-800` (rgba(255, 255, 255, 0.08))

### 2.2 Glassmorphism Utility
```css
.glass-card {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

## 3. Detailed Component Specifications

### 3.1 `Navbar` Component
- **File**: `client/src/components/Navbar.jsx`
- **Description**: Sticky top header bar displaying branding, API connection health badge, query history drawer trigger, and light/dark theme switcher.

#### Props API:
| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `isDarkMode` | `boolean` | Current active theme state |
| `toggleDarkMode` | `function` | Callback to toggle light/dark theme |
| `toggleHistory` | `function` | Callback to toggle slide-out history drawer |
| `serverStatus` | `string` | Connection status (`'ok'`, `'simulation'`, `'offline'`) |

---

### 3.2 `InputForm` Component
- **File**: `client/src/components/InputForm.jsx`
- **Description**: Interactive input panel featuring task mode selection cards, multi-line prompt textarea with character counter, quick sample chips, and action buttons.

#### Props API:
| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `prompt` | `string` | Controlled textarea input string |
| `setPrompt` | `function` | State setter for prompt input |
| `mode` | `string` | Currently selected task mode (`'explain'`, `'mcq'`, `'summarize'`, `'improve'`) |
| `setMode` | `function` | State setter for task mode |
| `onSubmit` | `function` | Form submission handler triggering AI API call |
| `isLoading` | `boolean` | Loading state indicating pending API response |
| `onClear` | `function` | Reset handler clearing text & current output |

---

### 3.3 `ResponseBox` Component
- **File**: `client/src/components/ResponseBox.jsx`
- **Description**: Multi-format display box that renders markdown text responses, loading skeleton state, word count metadata, copy-to-clipboard tool, and delegates MCQ payloads to `MCQCard`.

#### Props API:
| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `responseData` | `object \| null` | API response payload containing `response`, `data`, `isJson`, and `mode` |
| `isLoading` | `boolean` | Triggers skeleton loading pulse state |
| `currentMode` | `string` | Selected mode identifier |

---

### 3.4 `MCQCard` Component
- **File**: `client/src/components/MCQCard.jsx`
- **Description**: Interactive assessment quiz card parsing structured JSON payloads into clickable question cards, instant correct/incorrect visual feedback, explanations, and score tracking.

#### Props API:
| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `mcqData` | `object` | JSON object containing `topic` and `questions` array |

#### Internal State:
- `selectedAnswers`: Maps question ID to student's chosen option.
- `showResults`: Boolean lock revealing score summary and answer explanations.

---

### 3.5 `HistoryList` Component
- **File**: `client/src/components/HistoryList.jsx`
- **Description**: Slide-out drawer overlay displaying previously saved query history from `localStorage`, allowing students to reload previous AI prompts and outputs.

#### Props API:
| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `isOpen` | `boolean` | Controls drawer visibility |
| `onClose` | `function` | Dismisses drawer overlay |
| `historyItems` | `array` | List of historical query objects |
| `onSelectHistory` | `function` | Callback reloading chosen item into active state |
| `onClearHistory` | `function` | Clears all history from state & `localStorage` |

---

## 4. Component Testing & Verification Checklist

- [x] All functional components use React 18 hooks (`useState`, `useEffect`).
- [x] UI elements pass accessibility guidelines (aria labels, contrast ratios).
- [x] Interactive states respond smoothly with micro-animations.
- [x] Responsive layout tested across Mobile (375px), Tablet (768px), and Desktop (1440px).
