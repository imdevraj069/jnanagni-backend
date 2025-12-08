'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache'; // Import this
import { getApiClient } from '../utils/api';

// --- LOGIN ---
export async function adminLoginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const api = await getApiClient();
    const res = await api.post('/auth/login', { email, password });
    const { user, token } = res.data.data;

    if (user.role !== 'admin') {
      return { success: false, message: 'Access Denied: Not an Admin' };
    }

    const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();
    
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expires,
      path: '/',
    });

    return { success: true, message: 'Login Successful' };
  } catch (error) {
    return { success: false, message: 'Invalid Credentials or Network Error' };
  }
}

// --- LOGOUT ---
export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('adminToken');
  // Redirect usually happens on client, or you can use redirect() here
}

// --- GET USERS ---
export async function getAllUsersAction() {
  try {
    const api = await getApiClient();
    const res = await api.get('/users/all');
    return { success: true, users: res.data.data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch users' };
  }
}

// --- UPDATE ROLE ---
export async function updateUserRoleAction(userId, newRole) {
  try {
    const api = await getApiClient();
    await api.put(`/users/role/${userId}`, { role: newRole });
    
    // OPTIONAL: If you want to force server reload, use this:
    // revalidatePath('/admin'); 
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Update Failed' };
  }
}