"use client";
import { motion } from 'framer-motion';

const placeholders = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80',
  'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=500&q=80',
];

export default function GridSection({ title, id, isReversed = false }) {
  return (
    <section id={id} className="py-20 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-12 text-center md:text-left">
          <span className="bg-clip-text text-transparent bg-glow-gradient">{title}</span>
        </h2>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:auto-rows-fr' : ''}`}>
          
          {/* Text Content */}
          {isReversed && (
            <div className="text-gray-300 text-lg leading-relaxed space-y-4">
              <p>Success is not something that appears overnight; it is built slowly with dedication, patience, and constant effort.</p>
              <p>Every great achievement starts with a dream, but only those who are willing to work hard fuel the fire of Jnanagni.</p>
            </div>
          )}

          {/* Grid */}
          <div className={`grid grid-cols-2 gap-4 ${isReversed ? 'lg:order-first' : ''}`}>
            {placeholders.map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`relative rounded-2xl overflow-hidden shadow-xl aspect-video ${index % 3 === 0 ? 'col-span-2' : 'col-span-1'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img src={src} alt="Event" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}