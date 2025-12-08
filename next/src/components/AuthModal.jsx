"use client";

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUserAction, registerUserAction, forgotPasswordAction, resetPasswordAction } from '@/actions/auth'; 
import { useAuthStore } from '@/store/authStore';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} disabled={pending}
      className="w-full py-3 mt-4 bg-gradient-to-r from-jnanagni-primary to-jnanagni-pink rounded-lg text-white font-bold uppercase tracking-widest disabled:opacity-50 shadow-lg relative overflow-hidden group"
    >
      <span className="relative z-10">{pending ? 'Processing...' : label}</span>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    </motion.button>
  );
}

export default function AuthModal() {
  const { isAuthModalOpen, closeModal, modalView, setModalView, setUser, resetEmail, setResetEmail } = useAuthStore();

  // Server Actions
  const [loginState, loginAction] = useFormState(loginUserAction, { type: '', message: '' });
  const [regState, regAction] = useFormState(registerUserAction, { type: '', message: '' });
  const [forgotState, forgotAction] = useFormState(forgotPasswordAction, { type: '', message: '' });
  const [resetState, resetAction] = useFormState(resetPasswordAction, { type: '', message: '' });

  // --- EFFECT: Handle Success Transitions ---
  useEffect(() => {
    // Login Success
    if (loginState.type === 'success') {
       setUser(loginState.user);
       setTimeout(closeModal, 1500);
    }
    // Register Success
    if (regState.type === 'success') {
       setUser(regState.user);
       setTimeout(closeModal, 1500);
    }
    // Forgot Password Step 1 Success -> Move to Step 2
    if (forgotState.type === 'success') {
       setResetEmail(forgotState.email); // Store email for next step
       setModalView('verify_otp');
       // Clear the success state roughly so it doesn't loop (optional in this structure but good practice)
       forgotState.type = ''; 
    }
    // Reset Password Step 2 Success -> Back to Login
    if (resetState.type === 'success') {
       setTimeout(() => setModalView('login'), 2000);
    }
  }, [loginState, regState, forgotState, resetState, setUser, closeModal, setModalView, setResetEmail]);

  // Determine current form Logic
  let currentAction, currentState, buttonLabel, title;
  
  switch (modalView) {
    case 'register':
      currentAction = regAction; currentState = regState; buttonLabel = 'Initialize'; title = 'NEW CADET';
      break;
    case 'forgot':
      currentAction = forgotAction; currentState = forgotState; buttonLabel = 'Send Code'; title = 'RECOVER';
      break;
    case 'verify_otp':
      currentAction = resetAction; currentState = resetState; buttonLabel = 'Reset Password'; title = 'VERIFY';
      break;
    default: // login
      currentAction = loginAction; currentState = loginState; buttonLabel = 'Identify'; title = 'IDENTIFY';
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0118]/90 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden"
          >
            {/* Header Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jnanagni-primary via-jnanagni-accent to-jnanagni-pink"></div>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold text-white mb-2">{title}</h2>
                {currentState.message && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`mt-4 p-2 text-xs font-mono border rounded ${currentState.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {currentState.message}
                  </motion.div>
                )}
              </div>

              <form action={currentAction} className="space-y-4">
                
                {/* REGISTER FIELDS */}
                {modalView === 'register' && (
                  <div className="group">
                    <label className="text-xs font-bold text-gray-500 uppercase">Codename</label>
                    <input name="name" type="text" required className="auth-input" placeholder="John Doe" />
                  </div>
                )}

                {/* EMAIL FIELD (Visible for Login, Register, Forgot) */}
                {modalView !== 'verify_otp' && (
                  <div className="group">
                    <label className="text-xs font-bold text-gray-500 uppercase">Comms ID</label>
                    <input name="email" type="email" required className="auth-input" placeholder="you@gkv.ac.in" />
                  </div>
                )}

                {/* PASSWORD FIELD (Login, Register) */}
                {(modalView === 'login' || modalView === 'register') && (
                   <div className="group">
                     <label className="text-xs font-bold text-gray-500 uppercase">Access Key</label>
                     <input name="password" type="password" required className="auth-input" placeholder="••••••" />
                   </div>
                )}

                {/* RESET FLOW - STEP 2 FIELDS */}
                {modalView === 'verify_otp' && (
                  <>
                    <input type="hidden" name="email" value={resetEmail} />
                    <div className="group">
                      <label className="text-xs font-bold text-gray-500 uppercase">Verification Code</label>
                      <input name="otp" type="text" required className="auth-input text-center tracking-[0.5em] font-mono text-xl" placeholder="000000" maxLength={6} />
                    </div>
                    <div className="group">
                      <label className="text-xs font-bold text-gray-500 uppercase">New Access Key</label>
                      <input name="password" type="password" required className="auth-input" placeholder="New Password" />
                    </div>
                  </>
                )}

                <SubmitButton label={buttonLabel} />
              </form>

              {/* FOOTER LINKS */}
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