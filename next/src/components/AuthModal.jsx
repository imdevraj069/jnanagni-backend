"use client";

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUserAction, registerUserAction, forgotPasswordAction } from '@/actions/auth'; 
import { useAuthStore } from '@/store/authStore';

// --- SUBMIT BUTTON ---
function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <motion.button 
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      disabled={pending}
      className="w-full py-3 mt-4 bg-gradient-to-r from-jnanagni-primary to-jnanagni-pink rounded-lg text-white font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden group"
    >
      <span className="relative z-10">{pending ? 'Processing...' : label}</span>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    </motion.button>
  );
}

// --- MAIN COMPONENT ---
export default function AuthModal() {
  // Zustand State
  const { isAuthModalOpen, closeModal, modalView, setModalView, setUser } = useAuthStore();
  
  // Server Actions
  const [loginState, loginAction] = useFormState(loginUserAction, { type: '', message: '' });
  const [regState, regAction] = useFormState(registerUserAction, { type: '', message: '' });
  const [forgotState, forgotAction] = useFormState(forgotPasswordAction, { type: '', message: '' });

  // Handle Close
  const handleClose = () => {
    closeModal();
    // Optional: clear messages logic here if needed
  };

  // Effect: Close modal on successful login/register
  useEffect(() => {
    if (loginState.type === 'success') {
       setUser(loginState.user);
       setTimeout(closeModal, 1500);
    }
    if (regState.type === 'success') {
       setUser(regState.user);
       setTimeout(closeModal, 1500);
    }
  }, [loginState, regState, setUser, closeModal]);

  // Determine current form state and action based on view
  let currentAction, currentState, buttonLabel;
  if (modalView === 'login') {
    currentAction = loginAction;
    currentState = loginState;
    buttonLabel = 'Initialize Login';
  } else if (modalView === 'register') {
    currentAction = regAction;
    currentState = regState;
    buttonLabel = 'Initialize Registration';
  } else {
    currentAction = forgotAction;
    currentState = forgotState;
    buttonLabel = 'Send Reset Link';
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0118]/90 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden"
          >
            {/* Header Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jnanagni-primary via-jnanagni-accent to-jnanagni-pink"></div>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  {modalView === 'login' ? 'IDENTIFY' : modalView === 'register' ? 'NEW CADET' : 'RECOVER'}
                </h2>
                
                {/* Status Message */}
                {currentState.message && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`mt-4 p-2 text-xs font-mono border rounded ${currentState.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {currentState.message}
                  </motion.div>
                )}
              </div>

              <form action={currentAction} className="space-y-4">
                {modalView === 'register' && (
                  <div className="group">
                    <label className="text-xs font-bold text-gray-500 uppercase">Codename</label>
                    <input name="name" type="text" required className="auth-input" placeholder="John Doe" />
                  </div>
                )}

                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase">Comms ID (Email)</label>
                  <input name="email" type="email" required className="auth-input" placeholder="you@gkv.ac.in" />
                </div>

                {modalView !== 'forgot' && (
                  <div className="group">
                    <label className="text-xs font-bold text-gray-500 uppercase">Access Key</label>
                    <input name="password" type="password" required className="auth-input" placeholder="••••••" />
                  </div>
                )}

                <SubmitButton label={buttonLabel} />
              </form>

              {/* Footer Links */}
              <div className="mt-6 flex justify-between text-xs text-gray-400">
                {modalView === 'login' ? (
                  <>
                    <button onClick={() => setModalView('forgot')} className="hover:text-jnanagni-accent">Forgot Key?</button>
                    <button onClick={() => setModalView('register')} className="hover:text-jnanagni-primary">Create ID</button>
                  </>
                ) : (
                  <button onClick={() => setModalView('login')} className="w-full text-center hover:text-white">Back to Login</button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}