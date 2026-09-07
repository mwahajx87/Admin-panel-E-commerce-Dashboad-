import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Ban,
  ShieldAlert,
  Plus
} from 'lucide-react';
import Pagination from './Pagination';

export default function UserList({
  users,
  currentUser,
  onEditUser,
  onDeleteUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isAdmin = currentUser?.role === 'Admin';

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            User Accounts & Roles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered accounts, grant administrator privileges, and enforce account statuses
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
              View-Only Mode
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="users-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Role:</span>
            <select
              id="users-role-filter"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <select
              id="users-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Account Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No users match your filter criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try searching with another name or email keyword.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* Avatar & Name */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-3.5 text-xs text-slate-600 font-medium">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-3.5">
                      {user.role === 'Admin' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          Customer
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-3.5 text-xs text-slate-500">
                      {user.joinedDate}
                    </td>

                    {/* Account Status Badge */}
                    <td className="px-6 py-3.5">
                      {user.status === 'Active' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Actions: Edit Role & Delete */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          id={`edit-user-${user.id}-btn`}
                          onClick={() => onEditUser(user)}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-md transition-colors ${
                            isAdmin
                              ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed opacity-40'
                          }`}
                          title={isAdmin ? 'Edit user role and status' : 'Admin access required to edit roles'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          id={`delete-user-${user.id}-btn`}
                          onClick={() => onDeleteUser(user)}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-md transition-colors ${
                            isAdmin
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed opacity-40'
                          }`}
                          title={isAdmin ? 'Delete user account' : 'Admin access required to delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
