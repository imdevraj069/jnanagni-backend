"use client";
import { motion } from 'framer-motion';

const TimerBox = ({ value, label }) => (
  <div className="flex flex-col items-center mx-2 md:mx-4">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-2xl md:text-3xl font-display font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]">
      {value}
    </div>
    <span className="text-gray-500 text-[10px] md:text-xs mt-2 uppercase tracking-widest">{label}</span>
  </div>
);

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center text-center pt-20 overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-40 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-jnanagni-dark via-jnanagni-dark/80 to-transparent z-10"></div>
      
      {/* Animated Orb */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-jnanagni-primary rounded-full blur-[120px] z-0 mix-blend-screen"
      />

      <div className="relative z-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-4 py-1 mb-6 rounded-full border border-jnanagni-accent/30 bg-jnanagni-accent/10 backdrop-blur-sm text-jnanagni-accent tracking-[0.4em] text-xs font-bold"
        >
          COMING SOON
        </motion.div>

        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white mb-6 leading-tight drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]"
        >
          JNANAGNI
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center mt-12"
        >
          <TimerBox value="02" label="Days" />
          <TimerBox value="05" label="Hours" />
          <TimerBox value="30" label="Mins" />
          <TimerBox value="10" label="Secs" />
        </motion.div>
      </div>
    </section>
  );
}