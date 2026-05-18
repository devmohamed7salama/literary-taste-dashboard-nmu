import { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Search, GraduationCap, CheckCircle, HelpCircle, BookOpen, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QuestionCard from './components/QuestionCard';
import NoteCard from './components/NoteCard';
import Glossary from './components/Glossary';
import SectionStats from './components/SectionStats';
import { data } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState(data.sections[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Extract all MCQ answers for distractor generation (as a fallback)
  const allAnswers = useMemo(() => {
    return data.sections
      .filter(s => s.type === 'mcq')
      .flatMap(s => s.items.map(item => item.a));
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const questions = data.sections.filter(s => s.type === 'mcq' || s.type === 'tf');
    const total = questions.reduce((acc, s) => acc + s.items.length, 0);
    const mcqCount = data.sections.filter(s => s.type === 'mcq').reduce((acc, s) => acc + s.items.length, 0);
    const tfCount = data.sections.filter(s => s.type === 'tf').reduce((acc, s) => acc + s.items.length, 0);
    const answered = Object.keys(answeredQuestions).length;
    const correct = Object.values(answeredQuestions).filter(status => status === true).length;

    return { total, mcqCount, tfCount, answered, correct };
  }, [answeredQuestions]);

  const handleAnswer = (uniqueId, isCorrect) => {
    if (isCorrect === null) {
      const newAnswers = { ...answeredQuestions };
      delete newAnswers[uniqueId];
      setAnsweredQuestions(newAnswers);
    } else {
      setAnsweredQuestions(prev => ({ ...prev, [uniqueId]: isCorrect }));
    }
  };

  const filteredSections = data.sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const q = String(item.q || item.title || item.category || '').toLowerCase();
      const a = String(item.a || item.content || item.term || '').toLowerCase();
      const points = Array.isArray(item.points) ? item.points.join(' ').toLowerCase() : '';
      const definition = String(item.definition || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      return q.includes(search) || a.includes(search) || points.includes(search) || definition.includes(search);
    })
  })).filter(section => section.items.length > 0);

  return (
    <div className="flex min-h-screen bg-paper paper-texture font-cairo overflow-x-hidden">
      {/* Sidebar with Fixed Layout */}
      <Sidebar 
        sections={data.sections} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        stats={stats}
      />

      <div className="flex-1 flex flex-col min-w-0 md:pr-80">
        <Header />
        
        {/* Top Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 md:right-80 h-1.5 bg-brown-dark z-[70] origin-right"
          style={{ scaleX }}
        />

        <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          
          {/* Stats Summary Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <div className="paper-texture manuscript-border bg-paper-light p-6 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="bg-brown-dark text-paper p-3 rounded-xl"><CheckCircle size={28}/></div>
              <div>
                <p className="text-sm font-bold text-brown-soft">معدل الإجابة</p>
                <p className="text-2xl font-black text-brown-dark">{stats.answered} / {stats.total}</p>
              </div>
            </div>
            <div className="paper-texture manuscript-border bg-paper-light p-6 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="bg-brown-soft text-paper p-3 rounded-xl"><HelpCircle size={28}/></div>
              <div>
                <p className="text-sm font-bold text-brown-soft">أسئلة الاختيار</p>
                <p className="text-2xl font-black text-brown-dark">{stats.mcqCount} سؤال</p>
              </div>
            </div>
            <div className="paper-texture manuscript-border bg-paper-light p-6 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="bg-brown-dark/80 text-paper p-3 rounded-xl"><BookOpen size={28}/></div>
              <div>
                <p className="text-sm font-bold text-brown-soft">صح وخطأ</p>
                <p className="text-2xl font-black text-brown-dark">{stats.tfCount} سؤال</p>
              </div>
            </div>
            <div className="paper-texture manuscript-border bg-paper-light p-6 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="bg-green-700 text-paper p-3 rounded-xl"><AlertCircle size={28}/></div>
              <div>
                <p className="text-sm font-bold text-brown-soft">إجابات صحيحة</p>
                <p className="text-2xl font-black text-green-800">{stats.correct}</p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="mb-16 relative group max-w-4xl mx-auto">
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-brown-soft group-focus-within:text-brown-dark transition-colors">
              <Search size={24} />
            </div>
            <input
              type="text"
              placeholder="ابحث عن أي معلومة أو سؤال..."
              className="w-full bg-paper-light border-4 border-brown-soft/20 rounded-2xl py-5 pr-14 pl-8 focus:outline-none focus:border-brown-dark shadow-xl transition-all text-xl font-bold placeholder:text-brown-soft/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-24">
            {filteredSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-12">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 flex items-center gap-3 md:gap-6"
                >
                  <div className="h-1 flex-1 bg-gradient-to-l from-brown-dark to-transparent rounded-full hidden sm:block" />
                  <h2 className="text-2xl md:text-4xl font-black text-brown-dark px-2 md:px-4 text-center leading-tight">
                    {section.title}
                  </h2>
                  <div className="h-1 flex-1 bg-gradient-to-r from-brown-dark to-transparent rounded-full hidden sm:block" />
                </motion.div>

                <div className={section.type === 'glossary' ? 'space-y-0' : 'space-y-6'}>
                  {section.type === 'glossary' ? (
                    <Glossary items={section.items} />
                  ) : section.type === 'notes' || section.type === 'rules' ? (
                    section.items.map((item, i) => (
                      <NoteCard 
                        key={i} 
                        index={i}
                        type={section.type}
                        title={item.title || item.category} 
                        content={item.content || item}
                      />
                    ))
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {section.items.map((item, i) => (
                        <QuestionCard 
                          key={`${section.id}-${i}`} 
                          index={i}
                          type={section.type}
                          question={item.q}
                          answer={item.a}
                          note={item.note}
                          allAnswers={allAnswers}
                          predefinedOptions={item.options}
                          onAnswer={(idx, status) => handleAnswer(`${section.id}-${idx}`, status)}
                        />
                      ))}
                      
                      {/* Sub-section Stats */}
                      <SectionStats 
                        items={section.items} 
                        sectionAnswers={
                          Object.fromEntries(
                            Object.entries(answeredQuestions).filter(([key]) => key.startsWith(section.id))
                          )
                        } 
                      />
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-32 paper-texture manuscript-border rounded-3xl bg-paper-light/50">
              <p className="text-3xl text-brown-soft font-black italic">نأسف، لم نجد ما تبحث عنه في المخطوطة...</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 text-brown-dark underline font-bold text-xl hover:text-brown-soft"
              >
                عرض كل المحتوى
              </button>
            </div>
          )}
        </main>

        <footer className="paper-texture bg-brown-dark text-paper-light py-20 mt-32 border-t-[12px] border-brown-soft relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brown-soft text-paper px-8 py-2 rounded-full font-black shadow-xl">
             تم بحمد الله
           </div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-paper p-3 rounded-2xl text-brown-dark shadow-inner">
                  <GraduationCap size={40} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-paper">جامعة المنصورة الجديدة</h3>
              </div>
              <p className="text-paper/70 max-w-md font-bold text-lg leading-relaxed">
                منصة تعليمية متكاملة لطلبة كلية علوم وهندسة الحاسب، مصممة لتسهيل تذوق الأدب العربي وفهم أبعاده الفنية والجمالية بأحدث التقنيات الرقمية.
              </p>
            </div>
            <div className="flex flex-col md:items-end justify-center space-y-4">
              <div className="text-right">
                <p className="text-paper font-black text-2xl">إعداد المهندس محمد سلامة</p>
                <p className="text-brown-soft font-bold text-xl italic mt-1 underline decoration-dotted">مادة التذوق الأدبي</p>
              </div>
              <p className="text-paper/50 font-bold">جميع الحقوق محفوظة © 2026</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
