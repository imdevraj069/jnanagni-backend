import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://node_app:8001';

export const getApiClient = async () => {
  // 1. Get the cookie from the incoming request (Server Side)
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  // 2. Create the Axios instance
  const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 3. Attach the token if it exists
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return api;
};