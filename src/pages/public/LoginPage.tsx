import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ShieldAlert, UserCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, quickLogin, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'user') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await quickLogin(role);
    } catch (err: any) {
      setErrorMsg('Failed to login with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#101522] border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-neutral-950 font-black mx-auto shadow-lg shadow-amber-500/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
            Account Access
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in to access your member dashboard or gym owner CMS.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-neutral-800 space-y-2">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-center">
            Instant Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-400/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Owner Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              disabled={loading}
              className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Fitness Member
            </button>
          </div>
          <p className="text-[10px] text-neutral-500 text-center">
            Click above to instantly evaluate owner CMS or member portal
          </p>
        </div>

        {/* Normal login form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fitzone.com or member@fitzone.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-neutral-800">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
