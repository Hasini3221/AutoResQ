import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (e) {
      setError('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white">Create Operator Account</h1>
        <p className="text-xs text-slate-400">
          Register to submit reports or request emergency response authorizations.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-xl space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Maya Patel"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="maya.patel@health.org"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1">
              Initial Role Assignment
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="citizen">Citizen / Reporter</option>
              <option value="reviewer">Authorized Incident Reviewer (Triage Officer)</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1">
              Password *
            </label>
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
            {isLoading ? 'Registering...' : 'Register Operator Profile'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-sky-400 hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
