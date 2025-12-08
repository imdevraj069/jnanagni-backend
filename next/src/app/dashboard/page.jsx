"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { getSessionAction } from '../../actions/auth';
import QRCode from "react-qr-code";
import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Hydrate user on load
  useEffect(() => {
    const init = async () => {
      if (!user) {
        const session = await getSessionAction();
        if (session.user) {
          setUser(session.user);
        } else {
          router.push('/'); // Redirect if not logged in
        }
      }
      setLoading(false);
    };
    init();
  }, [user, setUser, router]);

  if (loading) return <div className="min-h-screen bg-jnanagni-dark text-white flex items-center justify-center">Loading Data...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-jnanagni-dark text-white selection:bg-jnanagni-accent">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-20">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">COMMAND CENTER</h1>
            <p className="text-gray-400">Welcome back, <span className="text-jnanagni-accent">{user.name}</span></p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
             <div className="text-sm text-gray-500 uppercase tracking-widest">Jnanagni ID</div>
             <div className="text-3xl font-mono font-bold text-white tracking-wider">{user.jnanagniId || 'PENDING'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: QR CODE CARD --- */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_30px_rgba(124,58,237,0.1)]">
              <h3 className="text-xl font-bold mb-6 uppercase tracking-widest">Digital Pass</h3>
              
              <div className="bg-white p-4 rounded-xl mb-6">
                {/* THE QR CODE */}
                {/* It simply embeds the ID. The scanner reads this ID. */}
                <div style={{ height: "auto", maxWidth: "100%", width: "100%" }}>
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={user.jnanagniId || "ERROR"}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-bold uppercase ${user.paymentStatus === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {user.paymentStatus || 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-400">Role</span>
                  <span className="font-bold uppercase text-jnanagni-primary">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: EVENTS & PAYMENT --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Payment Section (If pending) */}
            {user.paymentStatus !== 'verified' && (
              <div className="bg-gradient-to-r from-red-900/20 to-red-600/10 border border-red-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-red-400 font-bold text-lg mb-1">Registration Incomplete</h4>
                  <p className="text-sm text-gray-400">Payment verification is pending. Please visit the desk or pay online.</p>
                </div>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase text-sm transition">
                  Pay Now
                </button>
              </div>
            )}

            {/* Registered Events */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                Mission Log <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{user.events?.length || 0}</span>
              </h3>

              {(!user.events || user.events.length === 0) ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No missions registered yet.</p>
                  <a href="/#events" className="text-jnanagni-accent hover:underline mt-2 inline-block">Browse Events</a>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/5">
                      <div>
                        <h5 className="font-bold text-white">{event.eventName}</h5>
                        <p className="text-xs text-gray-500">{new Date(event.registeredAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-green-400 text-xs uppercase border border-green-500/30 px-2 py-1 rounded">Registered</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}