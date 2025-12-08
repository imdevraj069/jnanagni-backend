"use client";

import { useState, useEffect } from 'react';
import { getAllUsersAction, updateUserRoleAction } from '@/actions/admin';
import { Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import StatsCards from './StatsCards';
import TableSkeleton from './TableSkeleton';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // Track which user is updating

  useEffect(() => {
    async function fetchData() {
      const result = await getAllUsersAction();
      if (result.success) {
        setUsers(result.users);
        setFilteredUsers(result.users);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Handle Search
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) || 
      user.email.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId); // Show loading spinner for this specific row
    
    // Optimistic Update
    const previousUsers = [...users];
    const updatedList = users.map(u => u._id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedList); // Update main list
    // (Filtering useEffect will automatically update filteredList)

    const result = await updateUserRoleAction(userId, newRole);

    if (!result.success) {
      alert("Failed to update");
      setUsers(previousUsers); // Revert
    }
    setUpdatingId(null);
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700 ring-purple-600/20',
      coordinator: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
      volunteer: 'bg-rose-100 text-rose-700 ring-rose-600/20',
      student: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
      faculty: 'bg-amber-100 text-amber-700 ring-amber-600/20',
    };
    const base = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";
    return `${base} ${styles[role] || 'bg-gray-50 text-gray-600 ring-gray-500/10'}`;
  };

  if (loading) return <TableSkeleton />;

  return (
    <div>
      {/* 1. Stats Section */}
      <StatsCards users={users} />

      {/* 2. Toolbar Section */}
      <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* 3. Table Section */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-b-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Profile</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/80 transition-colors group">
                    
                    {/* User Profile Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getRoleBadge(user.role)}>
                        {user.role}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {updatingId === user._id && (
                            <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-blue-600" />
                          )}
                          <select 
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <option value="student">Student</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300 mb-2" />
                      <p>No users found matching "{searchQuery}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> results
          </span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-sm border rounded bg-white text-gray-400 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1 text-sm border rounded bg-white text-gray-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}