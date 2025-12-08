"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { adminLoginAction } from '../../actions/admin';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-blue-600 py-2.5 rounded-lg hover:bg-blue-500 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {pending ? 'Authenticating...' : 'Access Dashboard'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(adminLoginAction, { success: false, message: '' });

  // Note: We rely on the parent page to handle the redirect upon success
  // via useEffect or simply by the server re-rendering the page based on the cookie.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form action={formAction} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-gray-400 text-sm mt-2">Please verify your credentials</p>
        </div>
        
        {state?.message && (
          <div className={`p-3 text-center text-sm rounded-lg font-medium border ${
            state.success 
              ? 'bg-green-500/10 border-green-500/50 text-green-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {state.message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold">Email</label>
            <input name="email" type="email" required className="w-full mt-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold">Password</label>
            <input name="password" type="password" required className="w-full mt-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
        </div>
        
        <SubmitButton />
      </form>
    </div>
  );
}