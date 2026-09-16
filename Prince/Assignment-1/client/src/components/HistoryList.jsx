import React from 'react';
import { History, X, Trash2, ArrowRight, Clock, BookOpen, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

const MODE_ICONS = {
  explain: BookOpen,
  mcq: HelpCircle,
  summarize: FileText,
  improve: CheckCircle2,
};

export default function HistoryList({ isOpen, onClose, historyItems, onSelectHistory, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-slate-100 font-bold font-heading text-lg">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Request History</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{historyItems.length} saved queries</span>
          {historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-rose-400 hover:text-rose-300 font-medium flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {historyItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No previous query history found.</p>
              <p className="text-[11px] text-slate-400">Your AI prompts and responses will be saved here automatically.</p>
            </div>
          ) : (
            historyItems.map((item, index) => {
              const Icon = MODE_ICONS[item.mode] || BookOpen;
              return (
                <div
                  key={index}
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.mode}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{item.timestamp || 'Recently'}</span>
                  </div>

                  <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed">
                    "{item.prompt}"
                  </p>

                  <div className="flex items-center justify-end text-[11px] text-slate-400 group-hover:text-indigo-300 font-medium">
                    <span>Reload item</span>
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
