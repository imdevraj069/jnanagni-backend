"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { verifyUserAction } from "@/actions/auth";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function VerifyPage() {
  const params = useParams();
  const jnanagniId = params?.jnanagniId;
  const token = params?.token;
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your credentials...");

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifyUserAction(jnanagniId, token);

        if (result.success) {
          setStatus("success");
          setMessage("Identity Verified. Access Granted.");
          setUser(result.user);
          // Redirect to dashboard/home after delay
          setTimeout(() => router.push("/dashboard"), 3000);
        } else {
          setStatus("error");
          setMessage(result.message);
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    verify();
  }, [jnanagniId, token, router, setUser]);

  return (
    <div className="min-h-screen bg-[#05010d] flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm shadow-2xl">
        {/* LOGO */}
        <div className="mb-8 text-3xl font-bold tracking-wider bg-gradient-to-r from-jnanagni-primary to-jnanagni-pink bg-clip-text text-transparent">
          JNANAGNI
        </div>

        {/* STATUS ICON */}
        <div className="mb-6 flex justify-center">
          {status === "verifying" && (
            <div className="w-16 h-16 border-4 border-jnanagni-primary border-t-transparent rounded-full animate-spin"></div>
          )}
          {status === "success" && (
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-3xl border border-green-500/50">
              ✓
            </div>
          )}
          {status === "error" && (
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-3xl border border-red-500/50">
              ✕
            </div>
          )}
        </div>

        {/* MESSAGE */}
        <h2 className="text-xl font-bold mb-2 uppercase tracking-wide">
          {status === "verifying"
            ? "Processing"
            : status === "success"
            ? "Verified"
            : "Verification Failed"}
        </h2>

        <p className="text-gray-400 mb-8 font-mono text-sm">{message}</p>

        {/* ACTIONS */}
        {status === "success" && (
          <p className="text-xs text-gray-500 animate-pulse">
            Redirecting to system...
          </p>
        )}

        {status === "error" && (
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            Return to Home
          </Link>
        )}
      </div>
    </div>
  );
}
