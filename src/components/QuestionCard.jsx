import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, HelpCircle, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function QuestionCard({ question, answer, type, note, index, allAnswers = [], onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate exactly 4 options for MCQ
  const options = useMemo(() => {
    if (type !== 'mcq') return [true, false];
    
    const uniqueDistractors = [...new Set(allAnswers.filter(a => a !== answer))];
    const selectedDistractors = uniqueDistractors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    return [answer, ...selectedDistractors].sort(() => 0.5 - Math.random());
  }, [type, answer, allAnswers]);

  const handleOptionClick = (option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setIsSubmitted(true);
    
    // Notify parent about the answer
    if (onAnswer) {
      onAnswer(index, option === answer);
    }
  };

  const resetQuiz = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    setIsSubmitted(false);
    if (onAnswer) {
      onAnswer(index, null); // Reset status in parent
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div 
        className={cn(
          "paper-texture manuscript-border p-6 rounded-xl bg-paper-light shadow-lg transition-all duration-300 border-r-8",
          isSubmitted 
            ? (selectedOption === answer ? "border-green-600 shadow-green-100/50" : "border-red-600 shadow-red-100/50")
            : "border-brown-soft hover:border-brown-dark"
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <span className="bg-brown-dark text-paper w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 shadow-md">
              {index + 1}
            </span>
            <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-brown-dark">
              {question}
            </h3>
          </div>
          {isSubmitted && (
            <button 
              onClick={resetQuiz}
              className="p-2 hover:bg-paper rounded-full text-brown-soft transition-colors"
              title="إعادة المحاولة"
            >
              <RotateCcw size={20} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {type === 'tf' ? (
            <>
              {[true, false].map((opt) => (
                <button
                  key={opt.toString()}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isSubmitted}
                  className={cn(
                    "p-4 rounded-lg border-2 font-bold text-lg transition-all flex items-center justify-center gap-3",
                    !isSubmitted && "border-brown-soft/20 text-brown-soft hover:bg-paper hover:border-brown-dark",
                    isSubmitted && opt === answer && "bg-green-100 border-green-600 text-green-800",
                    isSubmitted && selectedOption === opt && opt !== answer && "bg-red-100 border-red-600 text-red-800",
                    isSubmitted && selectedOption !== opt && opt !== answer && "opacity-50 border-gray-200"
                  )}
                >
                  {opt ? "صح ✓" : "خطأ ✗"}
                  {isSubmitted && opt === answer && <CheckCircle2 size={20} />}
                  {isSubmitted && selectedOption === opt && opt !== answer && <XCircle size={20} />}
                </button>
              ))}
            </>
          ) : (
            options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                disabled={isSubmitted}
                className={cn(
                  "p-4 rounded-lg border-2 font-bold text-right transition-all flex items-center justify-between gap-3 group",
                  !isSubmitted && "border-brown-soft/20 text-brown-soft hover:bg-paper hover:border-brown-dark",
                  isSubmitted && opt === answer && "bg-green-100 border-green-600 text-green-800 scale-[1.02]",
                  isSubmitted && selectedOption === opt && opt !== answer && "bg-red-100 border-red-600 text-red-800",
                  isSubmitted && selectedOption !== opt && opt !== answer && "opacity-50 border-gray-200"
                )}
              >
                <span className="text-base md:text-lg">{opt}</span>
                <div className="flex-shrink-0">
                  {isSubmitted && opt === answer && <CheckCircle2 size={22} className="text-green-600" />}
                  {isSubmitted && selectedOption === opt && opt !== answer && <XCircle size={22} className="text-red-600" />}
                </div>
              </button>
            ))
          )}
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t-2 border-brown-soft/10">
                <div className={cn(
                  "flex items-start gap-3 p-4 rounded-xl",
                  selectedOption === answer ? "bg-green-50 text-green-900 border border-green-200" : "bg-red-50 text-red-900 border border-red-200"
                )}>
                  {selectedOption === answer ? (
                    <CheckCircle2 size={24} className="mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle size={24} className="mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-black text-xl mb-1">
                      {selectedOption === answer ? "إجابة عبقرية!" : "للأسف، حاول مرة أخرى"}
                    </p>
                    <p className="font-bold opacity-80 text-lg">
                      الإجابة الصحيحة هي: <span className="underline decoration-wavy">{type === 'tf' ? (answer ? 'صح' : 'خطأ') : answer}</span>
                    </p>
                  </div>
                </div>
                
                {note && (
                  <div className="mt-4 flex items-start gap-3 text-brown-soft bg-paper/50 p-4 rounded-xl italic border border-brown-soft/10 shadow-inner">
                    <HelpCircle size={20} className="mt-1 flex-shrink-0" />
                    <span className="text-lg leading-relaxed">{note}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
