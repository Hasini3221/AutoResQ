import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white">Operator Sign In</h1>
        <p className="text-xs text-slate-400">
          Access the AutoResQ Command Center or select a quick demonstration persona.
        </p>
      </div>

      {/* QUICK DEMO PERSONAS FOR JUDGES */}
      <div className="p-4 rounded-2xl bg-[#121A2B] border border-blue-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            Hackathon Demo Quick Login
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
            One-Click
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('reviewer')}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-left transition flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-blue-400">
                Officer Rajiv Verma (Reviewer)
              </div>
              <div className="text-[11px] text-slate-400">Incident Triage & Status Approvals</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-left transition flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-purple-400">
                Commander Sarah Chen (Admin)
              </div>
              <div className="text-[11px] text-slate-400">Full System Control & Audit Data</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('citizen')}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-left transition flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-emerald-400">
                Alex Mercer (Citizen)
              </div>
              <div className="text-[11px] text-slate-400">Standard Reporting & Tracking View</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Manual Sign In Form */}
      <div className="p-6 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
          Custom Credential Login
        </h2>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@autoresq.internal"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-sky-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Command Center'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800">
          Don't have an operator account?{' '}
          <Link to="/signup" className="text-sky-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>

    </div>
  );
};
