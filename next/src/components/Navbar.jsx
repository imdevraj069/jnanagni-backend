"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { logoutAction } from '@/actions/auth';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Zustand State
  const { user, isAuthenticated, logout, openModal } = useAuthStore();
  
  const handleLogout = async () => {
    await logoutAction(); // Clear server cookie
    logout(); // Clear client store
  };

  const links = ['Home', 'About', 'Events', 'Team', 'Schedule'];

  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-jnanagni-dark/80 backdrop-blur-md border-b border-white/5">
        
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-display font-bold tracking-widest bg-clip-text text-transparent bg-glow-gradient">ZN</Link>
          
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {links.map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wider transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
            
            <div className="w-px h-6 bg-white/20"></div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                // LOGGED IN STATE
                <div className="flex items-center gap-4">
                  <span className="text-sm text-jnanagni-accent font-mono tracking-wide">
                    {user?.name || user?.email || 'CADET'}
                  </span>
                  <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors uppercase">
                    Logout
                  </button>
                </div>
              ) : (
                // LOGGED OUT STATE
                <>
                  <button onClick={() => openModal('login')} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                    Login
                  </button>
                  <motion.button onClick={() => openModal('register')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-jnanagni-primary to-jnanagni-accent rounded-full text-white text-sm font-bold uppercase tracking-wide shadow-lg">
                    Register
                  </motion.button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Toggle (Simplified for brevity) */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white text-2xl">☰</button>
        </div>
      </motion.nav>

      {/* Render Modal - Controlled by Store now */}
      <AuthModal />
    </>
  );
}