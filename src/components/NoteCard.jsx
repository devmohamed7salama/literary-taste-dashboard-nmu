import { motion } from 'framer-motion';
import { Lightbulb, Star } from 'lucide-react';

export default function NoteCard({ title, content, type, index }) {
  const isRule = type === 'rules';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className="paper-texture manuscript-border p-6 rounded-xl bg-paper-light border-l-8 border-brown-dark shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brown-dark p-2 rounded-full text-paper">
            {isRule ? <Star size={24} /> : <Lightbulb size={24} />}
          </div>
          <h3 className="text-xl font-bold text-brown-dark decoration-wavy underline decoration-brown-soft">
            {title}
          </h3>
        </div>
        
        {typeof content === 'string' ? (
          <p className="text-lg leading-relaxed text-brown-soft font-medium">
            {content}
          </p>
        ) : (
          <div className="space-y-4">
            <ul className="space-y-2">
              {content.points && content.points.map((p, j) => (
                <li key={j} className="flex items-start gap-2 text-brown-soft">
                  <span className="text-brown-dark font-bold">•</span>
                  <span className="text-lg font-medium">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
