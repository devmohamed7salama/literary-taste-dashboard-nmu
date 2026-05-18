import { motion } from 'framer-motion';
import { PieChart, CheckCircle, XCircle, BarChart2 } from 'lucide-react';

export default function SectionStats({ items, sectionAnswers }) {
  // Filter for questions only (MCQ and TF)
  const questionIds = items
    .filter(item => item.q) // Only items with a question field
    .map((_, i) => i);
    
  const total = questionIds.length;
  if (total === 0) return null;

  const answered = Object.keys(sectionAnswers).length;
  const correct = Object.values(sectionAnswers).filter(v => v === true).length;
  const wrong = answered - correct;
  const progress = (answered / total) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 mb-8 paper-texture manuscript-border bg-paper-light/80 p-6 rounded-3xl shadow-xl border-t-8 border-brown-dark"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 relative w-32 h-32 flex items-center justify-center">
           {/* Simple Progress Ring */}
           <svg className="w-full h-full transform -rotate-90">
             <circle
               cx="64"
               cy="64"
               r="58"
               stroke="currentColor"
               strokeWidth="8"
               fill="transparent"
               className="text-brown-soft/10"
             />
             <motion.circle
               cx="64"
               cy="64"
               r="58"
               stroke="currentColor"
               strokeWidth="8"
               fill="transparent"
               strokeDasharray="364.4"
               initial={{ strokeDashoffset: 364.4 }}
               animate={{ strokeDashoffset: 364.4 - (364.4 * progress) / 100 }}
               className="text-brown-dark"
               strokeLinecap="round"
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-2xl font-black text-brown-dark">{Math.round(progress)}%</span>
             <span className="text-[10px] font-bold text-brown-soft">معدل الإنجاز</span>
           </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-paper p-4 rounded-2xl flex items-center gap-4 border border-brown-soft/10">
            <div className="bg-brown-dark text-paper p-2 rounded-xl"><BarChart2 size={24}/></div>
            <div>
              <p className="text-xs font-bold text-brown-soft">إجمالي الأسئلة</p>
              <p className="text-xl font-black text-brown-dark">{total}</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-4 border border-green-100">
            <div className="bg-green-600 text-white p-2 rounded-xl"><CheckCircle size={24}/></div>
            <div>
              <p className="text-xs font-bold text-green-700">إجابات صحيحة</p>
              <p className="text-xl font-black text-green-800">{correct}</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-4 border border-red-100">
            <div className="bg-red-600 text-white p-2 rounded-xl"><XCircle size={24}/></div>
            <div>
              <p className="text-xs font-bold text-red-700">إجابات خاطئة</p>
              <p className="text-xl font-black text-red-800">{wrong}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm font-bold text-brown-soft italic">
          {answered === total ? "✨ رائع! لقد أتممت هذا القسم بالكامل" : `أكملت ${answered} من أصل ${total} أسئلة في هذا الجزء`}
        </p>
      </div>
    </motion.div>
  );
}
