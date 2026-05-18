import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function Glossary({ items, index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="paper-texture manuscript-border bg-paper-light p-4 rounded-lg shadow-md border-r-4 border-brown-dark"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-brown-soft" />
            <h4 className="font-bold text-brown-dark text-lg underline decoration-dotted decoration-brown-soft">
              {item.term}
            </h4>
          </div>
          <p className="text-brown-soft leading-relaxed font-medium">
            {item.definition}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
