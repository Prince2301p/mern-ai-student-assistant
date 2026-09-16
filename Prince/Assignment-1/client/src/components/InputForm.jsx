import React from 'react';
import { Sparkles, Trash2, HelpCircle, BookOpen, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

const TASK_MODES = [
  {
    id: 'explain',
    name: 'Explain a Concept',
    icon: BookOpen,
    description: 'Simplifies complex topics with beginner-friendly language & examples.',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
  },
  {
    id: 'mcq',
    name: 'Generate MCQs',
    icon: HelpCircle,
    description: 'Creates interactive 4-option quiz questions with correct answers.',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
  },
  {
    id: 'summarize',
    name: 'Summarize Text',
    icon: FileText,
    description: 'Distills long articles into key bullet points and core takeaways.',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'improve',
    name: 'Improve Writing',
    icon: CheckCircle2,
    description: 'Polishes grammar, clarity, and tone while preserving intent.',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  },
];

const SAMPLE_PROMPTS = [
  { text: 'Explain JavaScript closures with a practical code example.', mode: 'explain' },
  { text: 'Generate MCQs on Database Normalization (1NF, 2NF, 3NF, BCNF).', mode: 'mcq' },
  { text: 'Summarize the 7 layers of the OSI networking model.', mode: 'summarize' },
  { text: 'Improve writing: "Artificial intelligence is good for student learning because it helps them study faster and fix mistakes."', mode: 'improve' },
];

export default function InputForm({ prompt, setPrompt, mode, setMode, onSubmit, isLoading, onClear }) {
  const maxChars = 3000;

  const handlePromptChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setPrompt(e.target.value);
    }
  };

  const handleSelectSample = (sample) => {
    setPrompt(sample.text);
    setMode(sample.mode);
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-800 transition-all">
      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* Mode Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span>Select Task Mode</span>
            <span className="text-xs font-normal text-slate-400">Choose AI prompt engineering rules</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TASK_MODES.map((item) => {
              const Icon = item.icon;
              const isSelected = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? `bg-slate-800/90 ${item.color} shadow-md border-indigo-500/50 ring-2 ring-indigo-500/30`
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-sm flex items-center space-x-2 text-slate-200">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="prompt-input" className="block text-sm font-semibold text-slate-300">
              Student Input / Topic / Text
            </label>
            <span className={`text-xs ${prompt.length >= maxChars ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
              {prompt.length} / {maxChars} characters
            </span>
          </div>
          <div className="relative">
            <textarea
              id="prompt-input"
              rows={5}
              value={prompt}
              onChange={handlePromptChange}
              placeholder={
                mode === 'explain'
                  ? 'Enter a technical concept or question (e.g., Explain Virtual Memory in Operating Systems)...'
                  : mode === 'mcq'
                  ? 'Enter a topic to generate 4 test questions for (e.g., React Hooks & State Management)...'
                  : mode === 'summarize'
                  ? 'Paste an article, paragraph, or paper excerpt to summarize...'
                  : 'Paste text to correct grammar, improve clarity, and refine academic tone...'
              }
              className="w-full bg-slate-900/90 text-slate-100 border border-slate-700/80 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all resize-y placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-2">Need ideas? Try sample prompts:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-slate-800 transition-all text-left"
              >
                💡 {sample.text.length > 45 ? sample.text.substring(0, 45) + '...' : sample.text}
              </button>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClear}
            disabled={!prompt && !isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Generating Response...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Response</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
