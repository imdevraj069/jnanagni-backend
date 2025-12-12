'use server'

import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://node_app:8001';

// Helper to set cookie
async function setAuthCookie(token) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days
  const cookieStore = await cookies();
  
  cookieStore.set('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
    sameSite: 'strict'
  });
}

// --- REGISTER ACTION (Updated) ---
export async function registerUserAction(prevState, formData) {
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    contactNo: formData.get('contactNo'),
    whatsappNo: formData.get('whatsappNo'),
    
    // Conditional Fields
    college: formData.get('college'), 
    branch: formData.get('branch'),
    campus: formData.get('campus'),
    role: formData.get('role'), // Calculated on client
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, payload);
    
    // Note: We do NOT set the cookie here anymore.
    // The user must verify email first.
    
    return { 
      type: 'success', 
      message: response.data.message || 'Registration successful. Check your email.',
      data: response.data.data // Contains jnanagniId potentially
    };
  } catch (error) {
    return { 
      type: 'error', 
      message: error.response?.data?.message || 'Registration Failed.' 
    };
  }
}

// --- VERIFY EMAIL ACTION (New) ---
export async function verifyUserAction(jnanagniId, token) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/verify-email`, {
      jnanagniId,
      token
    });

    const { token: authToken, user } = response.data.data;

    // Login the user immediately after verification
    await setAuthCookie(authToken);

    return { success: true, user, message: 'Account Verified Successfully!' };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Verification Failed or Expired.' 
    };
  }
}

// --- RESEND VERIFICATION ACTION (New) ---
export async function resendVerificationAction(email) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/resend-verification`, { email });
    return { type: 'success', message: response.data.message };
  } catch (error) {
    return { type: 'error', message: error.response?.data?.message || 'Failed to resend link.' };
  }
}

// --- 1. SESSION CHECK (Hydration) ---
export async function getSessionAction() {
  // FIX: await cookies()
  const cookieStore = await cookies();
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

  // JGN26-9F03
}

// --- 2. LOGOUT ACTION ---
export async function logoutAction() {
  // FIX: await cookies()
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
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
    const { token, user } = response.data.data; 

    await setAuthCookie(token);

    return { 
      type: 'success', 
      message: 'Welcome back, Commander.',
      user: user || { email: payload.email, role: 'STUDENT' }
    };

  } catch (error) {
    return { 
      type: 'error', 
      message: error.response?.data?.message || 'Invalid Credentials.' 
    };
  }
}

// --- 5. FORGOT PASSWORD ---
export async function forgotPasswordAction(prevState, formData) {
  const email = formData.get('email');
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/forgot-password`, { email });
    
    return { 
      type: 'success', 
      message: response.data.message || 'OTP sent to email.',
      email: email 
    };
  } catch (error) {
    return { 
      type: 'error', 
      message: error.response?.data?.message || 'Email not found.' 
    };
  }
}

// --- 6. RESET PASSWORD ---
export async function resetPasswordAction(prevState, formData) {
  const payload = {
    email: formData.get('email'),
    otp: formData.get('otp'),
    password: formData.get('password')
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/reset-password`, payload);
    
    return { 
      type: 'success', 
      message: 'Password Reset Successful. Please Login.' 
    };
  } catch (error) {
    return { 
      type: 'error', 
      message: error.response?.data?.message || 'Invalid Code or Expired.' 
    };
  }
}