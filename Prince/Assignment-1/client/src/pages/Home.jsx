import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import InputForm from '../components/InputForm';
import ResponseBox from '../components/ResponseBox';
import HistoryList from '../components/HistoryList';
import { generateAIResponse, checkServerHealth } from '../services/api';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('explain');
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [serverStatus, setServerStatus] = useState('checking');

  // Check server health on mount & load history from localStorage
  useEffect(() => {
    checkServerHealth().then((data) => {
      setServerStatus(data.status === 'ok' ? 'ok' : 'simulation');
    });

    try {
      const savedHistory = localStorage.getItem('ai_assistant_history');
      if (savedHistory) {
        setHistoryItems(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newEntry) => {
    try {
      const updated = [newEntry, ...historyItems.slice(0, 19)]; // Keep latest 20 items
      setHistoryItems(updated);
      localStorage.setItem('ai_assistant_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setErrorMessage('Please enter a question or topic before submitting.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = await generateAIResponse(prompt, mode);
      setResponseData(data);

      // Save to local history
      saveToHistory({
        prompt,
        mode,
        responseData: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (error) {
      console.error('AI Submit Error:', error);
      setErrorMessage(error.message || 'Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Clear
  const handleClear = () => {
    setPrompt('');
    setResponseData(null);
    setErrorMessage('');
  };

  // Handle Select History Item
  const handleSelectHistory = (item) => {
    setPrompt(item.prompt);
    setMode(item.mode);
    if (item.responseData) {
      setResponseData(item.responseData);
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('ai_assistant_history');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Navigation */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        toggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        serverStatus={serverStatus}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Tagline */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MERN Stack + Gemini Prompt Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            AI-Powered <span className="gradient-text">Student Assistant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Enter your question, select a structured prompt mode, and get tailored academic guidance powered by Google Gemini API.
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-rose-400 font-bold hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Grid: Input Form (Left/Top) & Response Box (Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Form Input */}
          <InputForm
            prompt={prompt}
            setPrompt={setPrompt}
            mode={mode}
            setMode={setMode}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onClear={handleClear}
          />

          {/* Response Box */}
          <ResponseBox
            responseData={responseData}
            isLoading={isLoading}
            currentMode={mode}
          />

        </div>

      </main>

      {/* History Drawer */}
      <HistoryList
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
