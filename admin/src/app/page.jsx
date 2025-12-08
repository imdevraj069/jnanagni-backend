import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import Dashboard from '@/components/admin/Dashboard';

export default async function AdminPage() {
  // 1. SSR Check: Is the user authenticated?
  // We check the cookie server-side.
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken');
  const isAuthenticated = !!token;

  // 2. Conditional Rendering
  // If not authenticated, we return the Client Component for Login.
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // 3. If authenticated, we return the Dashboard shell.
  // The Dashboard will then mount and client-side fetch the data (showing skeleton).
  return <Dashboard />;
}