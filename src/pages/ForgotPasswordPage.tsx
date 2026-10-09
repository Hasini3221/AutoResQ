import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white">Password Recovery</h1>
        <p className="text-xs text-slate-400">
          Reset password credentials for your command operator profile.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-xl space-y-4">
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <h4 className="font-bold text-sm text-white">Reset Instructions Transmitted</h4>
            <p>
              In production mode, password recovery links are routed to <strong className="text-white">{email}</strong>. In demo mode, use the quick personas on the login page.
            </p>
            <Link
              to="/login"
              className="inline-block mt-3 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@autoresq.internal"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition"
            >
              Send Password Reset Instructions
            </button>
          </form>
        )}

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800">
          <Link to="/login" className="text-sky-400 hover:underline flex items-center justify-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
