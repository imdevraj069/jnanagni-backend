"use client";

import { useEffect } from 'react';
import { getSessionAction } from '../actions/auth';
import { useAuthStore } from '../store/authStore';

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      const session = await getSessionAction();
      if (session?.user) {
        setUser(session.user);
      }
    };
    initAuth();
  }, [setUser]);

  return null; // Renders nothing
}