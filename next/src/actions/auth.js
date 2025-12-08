'use server'

import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://node_app:8001';

// Helper to set cookie
async function setAuthCookie(token) {
  // 6 days expiry
  const expires = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000);
  
  cookies().set('accessToken', token, {
    httpOnly: true, // Secure: Client JS cannot read this
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
    sameSite: 'strict'
  });
}

// --- 1. SESSION CHECK (Hydration) ---
export async function getSessionAction() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return { user: null };

  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = response.data.data.user;
    if (userData) return { user: userData };
    return { user: null };
  } catch (error) {
    return { user: null };
  }
}

// --- 2. LOGOUT ACTION ---
export async function logoutAction() {
  cookies().delete('accessToken');
  return { success: true };
}

// --- 3. LOGIN ACTION ---
export async function loginUserAction(prevState, formData) {
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, payload);
    
    // Extract token and user data from backend response
    const { token, user } = response.data.data; // Adjust based on your actual API response structure

    await setAuthCookie(token);

    return { 
      type: 'success', 
      message: 'Welcome back, Commander.',
      user: user || { email: payload.email, role: 'STUDENT' } // Fallback if backend doesn't send user obj
    };

  } catch (error) {
    return { 
      type: 'error', 
      message: error.response?.data?.message || 'Invalid Credentials.' 
    };
  }
}

// --- 4. REGISTER ACTION ---
export async function registerUserAction(prevState, formData) {
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, payload);
    const { token, user } = response.data.data;

    await setAuthCookie(token);

    return { 
      type: 'success', 
      message: 'Registration Complete. Access Granted.',
      user: user
    };
  } catch (error) {
    return { 
      type: 'error', 
      message: error.response?.data?.message || 'Registration Failed.' 
    };
  }
}

// --- 5. FORGOT PASSWORD ACTION ---
export async function forgotPasswordAction(prevState, formData) {
  const email = formData.get('email');
  try {
    await axios.post(`${BACKEND_URL}/api/v1/auth/forgot-password`, { email });
    return { type: 'success', message: 'Reset link sent to comms channel.' };
  } catch (error) {
    return { type: 'error', message: 'Email not found in database.' };
  }
}