import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Shield,
  User,
  CheckCircle,
  AlertTriangle,
  Package,
  ShoppingCart
} from 'lucide-react';

export default function Header({
  currentUser,
  onLogout,
  setMobileOpen,
  activeTab,
  globalSearch,
  setGlobalSearch
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New Order #ORD-PK-9101',
      desc: 'Fatima Zahra placed an order for Rs. 17,745',
      time: '12m ago',
      icon: ShoppingCart,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      desc: 'Royal Deluxe Pedestal Fan has 7 units left in Lahore warehouse',
      time: '45m ago',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 3,
      title: 'Order Delivered',
      desc: 'Order #ORD-PK-9104 delivered to Usman Ghani in Faisalabad',
      time: '2h ago',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'orders':
        return 'Orders Management';
      case 'products':
        return 'Product Catalog';
      case 'users':
        return 'Users & Roles';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white border-b border-slate-200">
      {/* Left side: Hamburger button + Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          id="header-mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center / Search bar with Geometric Balance pill shape */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-1.5 w-full border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              id="header-global-search"
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search dashboard..."
              className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-600 placeholder-slate-400"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Role badge, notifications, user avatar */}
      <div className="flex items-center gap-4">
        {/* Role Pill */}
        <div
          id="header-role-badge"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            currentUser?.role === 'Admin'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'Admin' ? 'bg-emerald-500' : 'bg-indigo-500'} animate-pulse`}></span>
          <span>{currentUser?.role === 'Admin' ? 'Admin Access' : 'User Access'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="header-notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-150 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-2.5">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${n.color} shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            id="header-user-menu-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentUser?.role === 'Admin' ? 'Administrator' : 'Standard User'}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-150 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                <span
                  className={`inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${
                    currentUser?.role === 'Admin'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  Role: {currentUser?.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
