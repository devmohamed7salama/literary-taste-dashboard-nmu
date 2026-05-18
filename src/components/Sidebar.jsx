import { motion } from 'framer-motion';
import { Menu, X, BookOpen, HelpCircle, Lightbulb, Star, Info, GraduationCap, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

const icons = {
  mcq: <HelpCircle size={20} />,
  tf: <BookOpen size={20} />,
  notes: <Info size={20} />,
  rules: <Star size={20} />,
  glossary: <Lightbulb size={20} />,
};

export default function Sidebar({ sections, activeSection, onSectionChange, stats }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const progressPercentage = stats.total > 0 ? (stats.answered / stats.total) * 100 : 0;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[70] p-3 bg-brown-dark text-paper rounded-full md:hidden shadow-2xl border-2 border-brown-soft active:scale-95 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Sidebar - Fixed Position for absolute stability */}
      <aside
        className={`fixed top-0 right-0 h-screen z-50 w-80 bg-paper-light border-l-4 border-brown-dark shadow-2xl paper-texture flex flex-col transition-transform duration-300 ease-in-out ${
          isDesktop ? "translate-x-0" : (isOpen ? "translate-x-0" : "translate-x-full")
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b-2 border-brown-soft bg-paper/60 backdrop-blur-sm flex-shrink-0 z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-brown-dark p-2 rounded-xl text-paper shadow-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brown-dark leading-tight">
                لوحة التحكم
              </h2>
              <p className="text-[10px] text-brown-soft font-bold opacity-70">إدارة محتوى المادة</p>
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-end text-xs font-bold text-brown-dark">
              <span className="opacity-70">إجمالي الإنجاز</span>
              <span className="text-sm font-black">{stats.answered} / {stats.total}</span>
            </div>
            <div className="h-3 w-full bg-paper rounded-full overflow-hidden border border-brown-soft/30 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-l from-brown-dark to-brown-soft"
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  setIsOpen(false);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all duration-200 text-right group relative overflow-hidden ${
                  activeSection === section.id
                    ? "bg-brown-dark text-paper shadow-xl translate-x-[-4px]"
                    : "text-brown-soft hover:bg-brown-soft/10"
                }`}
              >
                <span className={activeSection === section.id ? "text-paper" : "text-brown-dark/40 group-hover:text-brown-dark"}>
                  {icons[section.type]}
                </span>
                <span className="text-sm leading-tight flex-1">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t-2 border-brown-soft bg-paper/60 backdrop-blur-sm flex-shrink-0">
          <div className="bg-paper p-4 rounded-2xl manuscript-border text-center group transition-colors hover:bg-paper-light">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GraduationCap size={18} className="text-brown-dark" />
              <p className="text-xs font-black text-brown-dark">جامعة المنصورة الجديدة</p>
            </div>
            <p className="text-[10px] text-brown-soft font-bold">كلية علوم وهندسة الحاسب</p>
          </div>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-brown-dark/60 backdrop-blur-md z-40 md:hidden"
        />
      )}
    </>
  );
}
