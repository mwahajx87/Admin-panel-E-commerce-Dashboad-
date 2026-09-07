import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Store, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('wahajwahaj200@gmail.com');
  const [password, setPassword] = useState('Admin@Pak2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        email: email || 'wahajwahaj200@gmail.com',
        name: 'Wahaj Ahmed',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-900/40 mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            CommerceCore Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pakistan E-Commerce Management Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/95 border border-slate-700/80 rounded-xl p-6 sm:p-7 shadow-xl">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@store.pk"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="rounded-lg p-2.5 bg-slate-900/70 border border-slate-700/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 text-[11px]">
                Secured session with full Admin privileges and 256-bit encryption.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-5">
          E-Commerce Admin • Pakistan Region
        </p>
      </div>
    </div>
  );
}
