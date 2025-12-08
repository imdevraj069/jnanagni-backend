"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { logoutAction } from '@/actions/auth';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, openModal } = useAuthStore();

  const handleLogout = async () => {
    await logoutAction();
    logout();
    setIsMobileMenuOpen(false);
  };

  // Common Links
  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Events', href: '/#events' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-jnanagni-dark/90 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link href="/" className="text-2xl font-display font-bold tracking-widest bg-clip-text text-transparent bg-glow-gradient z-50 relative">
            ZN
          </Link>
          
          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wider transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              {/* DASHBOARD LINK (Desktop) */}
              {isAuthenticated && (
                <li>
                  <Link href="/dashboard" className="text-sm font-bold text-jnanagni-accent hover:text-white uppercase tracking-wider transition-colors">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            
            <div className="w-px h-6 bg-white/20"></div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors uppercase">
                  Logout
                </button>
              ) : (
                <>
                  <button onClick={() => openModal('login')} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Login</button>
                  <button onClick={() => openModal('register')} className="px-6 py-2 bg-gradient-to-r from-jnanagni-primary to-jnanagni-accent rounded-full text-white text-sm font-bold uppercase tracking-wide shadow-lg hover:scale-105 transition-transform">Register</button>
                </>
              )}
            </div>
          </div>

          {/* --- MOBILE HAMBURGER BUTTON --- */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-white text-3xl z-50 relative focus:outline-none"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full bg-[#0a0118] border-b border-white/10 shadow-2xl md:hidden flex flex-col items-center pt-24 pb-10 space-y-6 z-40"
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-gray-300 text-lg uppercase tracking-widest hover:text-white"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="text-jnanagni-accent text-lg font-bold uppercase tracking-widest"
                  >
                    Dashboard
                  </Link>
                  <hr className="w-12 border-white/20" />
                  <button onClick={handleLogout} className="text-red-500 font-bold uppercase tracking-widest">Logout</button>
                </>
              ) : (
                <>
                  <hr className="w-12 border-white/20" />
                  <button onClick={() => { openModal('login'); setIsMobileMenuOpen(false); }} className="text-white font-bold text-lg uppercase">Login</button>
                  <button onClick={() => { openModal('register'); setIsMobileMenuOpen(false); }} className="px-8 py-3 bg-glow-gradient rounded-full font-bold uppercase tracking-wide text-white">Register</button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal />
    </>
  );
}