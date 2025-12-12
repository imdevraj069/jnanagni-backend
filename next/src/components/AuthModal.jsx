"use client";

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUserAction, registerUserAction, forgotPasswordAction, resetPasswordAction, resendVerificationAction } from '@/actions/auth'; 
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

  const [loginState, loginAction] = useFormState(loginUserAction, { type: '', message: '' });
  const [regState, regAction] = useFormState(registerUserAction, { type: '', message: '' });
  const [forgotState, forgotAction] = useFormState(forgotPasswordAction, { type: '', message: '' });
  const [resetState, resetAction] = useFormState(resetPasswordAction, { type: '', message: '' });

  // --- LOCAL STATE ---
  const [regEmail, setRegEmail] = useState('');
  const [isGkv, setIsGkv] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [showVerifyMessage, setShowVerifyMessage] = useState(false); // New state for post-registration

  // Calculate Role
  const getRole = () => {
    if (!isGkv) return 'STUDENT';
    if (selectedCampus === 'FET') return 'FETIAN';
    if (selectedCampus === 'University' || selectedCampus === 'KGC') return 'GKVIAN';
    return 'GKVIAN';
  };

  // Debounce Email Check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (regEmail.endsWith('@gkv.ac.in')) {
        setIsGkv(true);
      } else {
        setIsGkv(false);
        // Don't clear campus immediately to avoid UI jumpiness, but logic resets role
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [regEmail]);

  // Handle Success States
  useEffect(() => {
    if (loginState.type === 'success') {
       setUser(loginState.user);
       setTimeout(closeModal, 1000);
    }
    
    // REGISTRATION SUCCESS -> Show "Check Email"
    if (regState.type === 'success') {
       setShowVerifyMessage(true);
    }

    if (forgotState.type === 'success') {
       setResetEmail(forgotState.email); 
       setModalView('verify_otp');
       forgotState.type = ''; 
    }
    if (resetState.type === 'success') {
       setTimeout(() => setModalView('login'), 2000);
    }
  }, [loginState, regState, forgotState, resetState, setUser, closeModal, setModalView, setResetEmail]);

  // Reset local state when modal closes or view changes
  useEffect(() => {
    if(!isAuthModalOpen) {
        setShowVerifyMessage(false);
        setRegEmail('');
        setIsGkv(false);
    }
  }, [isAuthModalOpen, modalView]);


  // Determine view logic
  let currentAction, currentState, buttonLabel, title;
  
  if (showVerifyMessage) {
     title = "CHECK INBOX";
  } else {
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
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-[#0a0118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Gradient Top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jnanagni-primary via-jnanagni-accent to-jnanagni-pink"></div>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white z-50">✕</button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold text-white mb-2">{title}</h2>
                
                {/* Error/Info Messages */}
                {!showVerifyMessage && currentState.message && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`mt-4 p-2 text-xs font-mono border rounded ${currentState.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {currentState.message}
                  </motion.div>
                )}
              </div>

              {/* === VERIFICATION PENDING VIEW === */}
              {showVerifyMessage ? (
                <div className="text-center space-y-6">
                    <div className="text-6xl">📩</div>
                    <p className="text-gray-300">
                        We have sent a verification link to <span className="text-jnanagni-primary font-bold">{regEmail}</span>.
                    </p>
                    <p className="text-sm text-gray-400">
                        Please check your inbox (and spam folder) to activate your account and get your Jnanagni ID.
                    </p>
                    <button onClick={closeModal} className="text-sm text-white underline underline-offset-4">Close</button>
                </div>
              ) : (
                /* === FORMS === */
                <form action={currentAction} className="space-y-4">
                    
                    {/* === REGISTER FIELDS === */}
                    {modalView === 'register' && (
                    <div className="space-y-3">
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input name="name" type="text" required className="auth-input" placeholder="Cadet Name" />
                        </div>

                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email (GKV Email if Insider)</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                className="auth-input" 
                                placeholder="you@gkv.ac.in" 
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="group">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                                <input name="contactNo" type="tel" required className="auth-input" placeholder="Contact No" />
                            </div>
                            <div className="group">
                                <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
                                <input name="whatsappNo" type="tel" required className="auth-input" placeholder="WhatsApp No" />
                            </div>
                        </div>

                        {/* Dynamic Fields */}
                        <AnimatePresence mode='wait'>
                            {isGkv ? (
                                <motion.div 
                                    key="gkv"
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3"
                                >
                                    <div className="group">
                                        <label className="text-xs font-bold text-jnanagni-primary uppercase">GKV Campus</label>
                                        <select 
                                            name="campus" 
                                            required 
                                            className="auth-input cursor-pointer"
                                            value={selectedCampus}
                                            onChange={(e) => setSelectedCampus(e.target.value)}
                                        >
                                            <option value="" disabled>Select Campus</option>
                                            <option value="FET">FET (Engineering)</option>
                                            <option value="University">Main University</option>
                                            <option value="KGC">Kanya Gurukul (KGC)</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="text-xs font-bold text-jnanagni-primary uppercase">Branch</label>
                                        <input name="branch" type="text" required className="auth-input" placeholder="e.g. CSE, Physics" />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="outsider"
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="group">
                                        <label className="text-xs font-bold text-gray-500 uppercase">College Name</label>
                                        <input name="college" type="text" required className="auth-input" placeholder="Your Institute Name" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hidden Role */}
                        <input type="hidden" name="role" value={getRole()} />

                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                            <input name="password" type="password" required className="auth-input" placeholder="••••••" />
                        </div>
                    </div>
                    )}

                    {/* === LOGIN & OTHERS === */}
                    {modalView !== 'register' && (
                    <>
                        {modalView !== 'verify_otp' && (
                            <div className="group">
                                <label className="text-xs font-bold text-gray-500 uppercase">Comms ID (Email)</label>
                                <input name="email" type="email" required className="auth-input" placeholder="you@example.com" />
                            </div>
                        )}
                        {modalView === 'login' && (
                            <div className="group">
                                <label className="text-xs font-bold text-gray-500 uppercase">Access Key</label>
                                <input name="password" type="password" required className="auth-input" placeholder="••••••" />
                            </div>
                        )}
                        {modalView === 'verify_otp' && (
                            <>
                                <input type="hidden" name="email" value={resetEmail} />
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Code</label>
                                    <input name="otp" type="text" required className="auth-input text-center tracking-[0.5em] text-xl" maxLength={6} />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-500 uppercase">New Key</label>
                                    <input name="password" type="password" required className="auth-input" placeholder="New Password" />
                                </div>
                            </>
                        )}
                    </>
                    )}

                    <SubmitButton label={buttonLabel} />
                </form>
              )}

              {/* FOOTER */}
              {!showVerifyMessage && (
                <div className="mt-6 flex justify-between text-xs text-gray-400">
                    {modalView === 'login' ? (
                    <>
                        <button type="button" onClick={() => setModalView('forgot')} className="hover:text-jnanagni-accent">Forgot Key?</button>
                        <button type="button" onClick={() => setModalView('register')} className="hover:text-jnanagni-primary">Create ID</button>
                    </>
                    ) : (
                    <button type="button" onClick={() => setModalView('login')} className="w-full text-center hover:text-white">Back to Login</button>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}