"use client";

import { adminLogoutAction } from '@/actions/admin';
import UserTable from './UserTable';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogoutAction();
    router.refresh(); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin<span className="text-blue-600">Console</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-right">
              <p className="font-medium text-gray-900">Administrator</p>
              <p className="text-xs text-gray-500">super@admin.com</p>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Monitor user access and manage role permissions.</p>
        </div>

        <UserTable />
      </main>
    </div>
  );
}