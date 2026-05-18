import { motion } from 'framer-motion';
import { Scroll, GraduationCap, Building2, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="paper-texture bg-paper-light border-b-4 border-brown-dark relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 py-12 relative z-10">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="bg-brown-dark p-4 rounded-full text-paper shadow-2xl">
            <Scroll size={48} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-brown-dark tracking-wider mb-4">
              منصة التذوق الأدبي الرقمية
            </h1>
            <div className="h-1 w-64 bg-brown-soft mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">
            <div className="flex items-center justify-center gap-3 bg-paper p-4 rounded-lg manuscript-border">
              <GraduationCap className="text-brown-dark" />
              <span className="font-bold text-brown-soft">مادة التذوق الأدبي</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-paper p-4 rounded-lg manuscript-border">
              <Building2 className="text-brown-dark" />
              <div className="text-right">
                <p className="font-bold text-brown-soft text-sm leading-tight">كلية علوم وهندسة الحاسب</p>
                <p className="text-xs text-brown-dark">جامعة المنصورة الجديدة</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-paper p-4 rounded-lg manuscript-border">
              <User className="text-brown-dark" />
              <div className="text-right">
                <p className="font-bold text-brown-soft text-sm leading-tight">إعداد المهندس</p>
                <p className="font-black text-brown-dark">محمد سلامة</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] rotate-180 pointer-events-none" />
    </header>
  );
}
