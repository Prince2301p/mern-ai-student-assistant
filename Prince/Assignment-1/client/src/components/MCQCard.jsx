import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw, Info } from 'lucide-react';

export default function MCQCard({ mcqData }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!mcqData || !mcqData.questions || !Array.isArray(mcqData.questions)) {
    return (
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-sm">
        ⚠️ Unable to render interactive MCQ format. Showing raw output below.
      </div>
    );
  }

  const handleSelectOption = (questionId, option) => {
    if (showResults) return; // Lock choices once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const totalQuestions = mcqData.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    mcqData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="space-y-6">
      
      {/* Quiz Header & Scoreboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-purple-500/20 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>Topic: {mcqData.topic || 'Multiple Choice Questions'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your knowledge with 4 AI-generated assessment questions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {showResults && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Score: {score}/{totalQuestions} ({percentage}%)</span>
            </div>
          )}

          <button
            onClick={handleResetQuiz}
            className="p-2 text-xs bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 flex items-center space-x-1"
            title="Reset Quiz Choices"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {mcqData.questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctAnswer;

          return (
            <div
              key={q.id || idx}
              className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-md space-y-4"
            >
              {/* Question Label */}
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-slate-200 text-sm leading-relaxed">
                  <span className="text-indigo-400 font-mono mr-2">Q{idx + 1}.</span>
                  {q.question}
                </h4>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  const isSelected = userChoice === option;
                  const isThisCorrect = option === q.correctAnswer;

                  let btnStyle = 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800';

                  if (showResults) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-medium';
                    } else if (isSelected && !isThisCorrect) {
                      btnStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold ring-1 ring-indigo-500/40';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, option)}
                      disabled={showResults}
                      className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-700/60 font-mono text-[10px] text-slate-300">
                          {letter}
                        </span>
                        <span>{option}</span>
                      </span>

                      {showResults && isThisCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {showResults && isSelected && !isThisCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation section when results are revealed */}
              {showResults && (
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-start space-x-2 bg-slate-950/40 p-3 rounded-lg">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-indigo-300">Explanation: </span>
                    {q.explanation || `Correct answer is option "${q.correctAnswer}".`}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Submit Answers Footer */}
      {!showResults && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowResults(true)}
            disabled={answeredCount === 0}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Check Answers ({answeredCount}/{totalQuestions})</span>
          </button>
        </div>
      )}

    </div>
  );
}
