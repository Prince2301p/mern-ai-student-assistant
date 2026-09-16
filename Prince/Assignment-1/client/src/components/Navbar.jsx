import React from 'react';
import { Sparkles, GraduationCap, Moon, Sun, Activity, History } from 'lucide-react';

export default function Navbar({ isDarkMode, toggleDarkMode, toggleHistory, serverStatus }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-heading text-white tracking-tight">
                Scholar<span className="gradient-text">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Gemini 1.5
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI-Powered Student Study Assistant</p>
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center space-x-3">
          
          {/* Server Connection Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/60 text-xs">
            <span className={`w-2 h-2 rounded-full ${serverStatus === 'ok' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-medium">
              {serverStatus === 'ok' ? 'API Connected' : 'Simulation Mode'}
            </span>
          </div>

          {/* Drawer / History Button */}
          <button
            onClick={toggleHistory}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 transition-all flex items-center space-x-1 text-sm font-medium"
            title="View Saved Query History"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 transition-all"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

      </div>
    </header>
  );
}
