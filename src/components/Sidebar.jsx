import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Store,
  X,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  counts,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      badge: counts.orders,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      badge: counts.products,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      badge: counts.users,
    },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed h-screen top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:static ${
          mobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
          {!isCollapsed && (
            <div className="truncate flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-base font-black tracking-tight text-slate-900">
                  SHOP.CO
                </span>
                <span className="block text-[9px] font-semibold tracking-[0.18em] text-slate-500">
                  ADMIN
                </span>
              </div>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Role Status Ribbon (when expanded) */}
        {/* {!isCollapsed && (
          <div className="px-3.5 py-2.5 mx-3 my-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {currentUser?.role === "Admin" ? (
                  <Shield className="w-4 h-4 text-indigo-400" />
                ) : (
                  <User className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-semibold text-slate-200">
                  {currentUser?.role === "admin"
                    ? "Admin Mode"
                    : "View-Only Mode"}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentUser?.role === "Admin"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                {currentUser?.role || "Admin"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {currentUser?.role === "Admin"
                ? "Full create, edit, delete access"
                : "Action buttons disabled across views"}
            </p>
          </div>
        )} */}

        {/* Navigation List */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-slate-600 hover:bg-[#f2f0f0] hover:text-slate-900"
                } ${isCollapsed ? "justify-center" : "justify-between"}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Current User & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div
            className={`flex items-center gap-3 p-2.5 bg-[#f2f0f0] rounded-xl ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.name?.slice(0, 2).toUpperCase() || "AD"
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentUser?.role === "Admin"
                    ? "Senior Admin"
                    : "Standard User"}
                </div>
              </div>
            )}
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Log out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
