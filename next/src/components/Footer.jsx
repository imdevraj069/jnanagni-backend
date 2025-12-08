"use client";
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative z-10 pt-20 pb-10 bg-gradient-to-t from-black to-jnanagni-dark border-t border-white/5">
      <div className="text-center mb-20 px-4">
        <h3 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider">Wanna Join Us?</h3>
        <div className="flex items-center justify-center gap-4 mb-8">
           <span className="text-2xl text-gray-500 line-through decoration-red-500 decoration-2">₹ 2500</span>
           <span className="text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-glow-gradient">₹ 1000</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 bg-gradient-to-r from-jnanagni-primary to-jnanagni-pink rounded-full text-white font-bold text-xl uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.4)]"
        >
          Register Now
        </motion.button>
      </div>
      <div className="text-center text-gray-600 text-xs">© Jnanagni 2025</div>
    </footer>
  );
}