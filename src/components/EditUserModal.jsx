import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield, Mail, Calendar, User } from 'lucide-react';

export default function EditUserModal({ isOpen, onClose, user, onSaveUser }) {
  const [role, setRole] = useState('Customer');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (user) {
      setRole(user.role || 'Customer');
      setStatus(user.status || 'Active');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUser({
      ...user,
      role,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Manage User Account</h3>
              <p className="text-xs text-slate-500">Edit access permissions and account standing</p>
            </div>
          </div>
          <button
            id="close-user-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Profile Overview */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Joined: {user.joinedDate}</p>
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="edit-user-role">
              Assign Role (RBAC)
            </label>
            <select
              id="edit-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Admin">Admin (Full Administrative Privileges)</option>
              <option value="Customer">Customer (Standard User - Read Only)</option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="edit-user-status">
              Account Status
            </label>
            <select
              id="edit-user-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Active">Active (Permitted)</option>
              <option value="Suspended">Suspended (Blocked)</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              id="cancel-user-modal-btn"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-user-modal-btn"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
