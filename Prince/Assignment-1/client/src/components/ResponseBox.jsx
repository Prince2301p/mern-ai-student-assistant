import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, HelpCircle, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import MCQCard from './MCQCard';

const MODE_LABELS = {
  explain: { label: 'Concept Explanation', icon: BookOpen, badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  mcq: { label: 'Multiple Choice Quiz', icon: HelpCircle, badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  summarize: { label: 'Academic Summary', icon: FileText, badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  improve: { label: 'Writing Improvement', icon: CheckCircle2, badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
};

export default function ResponseBox({ responseData, isLoading, currentMode }) {
  const [copied, setCopied] = useState(false);

  // Handle Copy to Clipboard
  const handleCopy = () => {
    if (!responseData) return;
    const textToCopy = typeof responseData.response === 'string' 
      ? responseData.response 
      : JSON.stringify(responseData.data, null, 2);

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Skeleton Loading State
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4 animate-pulse">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-slate-800"></div>
            <div className="w-32 h-4 rounded bg-slate-800"></div>
          </div>
          <div className="w-16 h-6 rounded-full bg-slate-800"></div>
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800/80 rounded w-full"></div>
          <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
          <div className="h-4 bg-slate-800/40 rounded w-2/3"></div>
        </div>
        <div className="pt-4 flex items-center justify-center text-xs text-indigo-400 space-x-2">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Applying prompt engineering rules & querying Gemini LLM...</span>
        </div>
      </div>
    );
  }

  // Render Initial Empty State
  if (!responseData) {
    return (
      <div className="glass-card rounded-2xl p-8 shadow-xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-1 font-heading">
          AI Generated Response Area
        </h3>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
          Select a task mode above, enter your question or text, and click <strong className="text-slate-300">Generate Response</strong> to see structured AI outputs.
        </p>
      </div>
    );
  }

  const modeInfo = MODE_LABELS[responseData.mode || currentMode] || MODE_LABELS.explain;
  const ModeIcon = modeInfo.icon;
  const textContent = responseData.response || '';
  const wordCount = textContent ? textContent.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-800 space-y-5 transition-all">
      
      {/* Response Box Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl border ${modeInfo.badgeColor} flex items-center justify-center`}>
            <ModeIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 font-heading">
              {modeInfo.label}
            </h3>
            <span className="text-[11px] text-slate-400">
              {wordCount} words • Generated via Gemini API
            </span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
          title="Copy response to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Response</span>
            </>
          )}
        </button>
      </div>

      {/* Response Content Body */}
      <div>
        {/* If MCQ Mode and valid JSON data exists, render interactive quiz! */}
        {responseData.isJson && responseData.data && responseData.data.questions ? (
          <MCQCard mcqData={responseData.data} />
        ) : (
          /* Render Markdown for Text Explanations & Summaries */
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-3 font-sans">
            <ReactMarkdown>{textContent}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Guardrail Disclaimer Footer */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Structured prompt rules & anti-hallucination guardrails active</span>
        </span>
        <span className="font-mono text-slate-500">Gemini 1.5</span>
      </div>

    </div>
  );
}
