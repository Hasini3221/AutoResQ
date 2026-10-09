import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  PhoneCall, 
  Sparkles,
  Database,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export const AuthScreen: React.FC = () => {
  const { 
    loginWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    loginAsDemo, 
    isSupabaseConnected 
  } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form Fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [age, setAge] = useState<string>('');

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Full Name is compulsory.');
          setLoading(false);
          return;
        }
        const parsedAge = parseInt(age, 10);
        if (!age || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
          setError('Age is compulsory and must be between 1 and 120.');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('A valid email address is required.');
          setLoading(false);
          return;
        }
        if (!password || password.length < 6) {
          setError('Password must contain at least 6 characters.');
          setLoading(false);
          return;
        }

        const res = await signUpWithEmail(fullName, parsedAge, email, password);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        } else {
          setInfoMessage(res.message || 'Account created successfully!');
          if (res.message?.includes('check your email')) {
            // Keep on page to see message
          }
        }
      } else {
        // Login mode
        if (!email.trim()) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }
        if (!password) {
          setError('Please enter your password.');
          setLoading(false);
          return;
        }

        const res = await loginWithEmail(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-rose-500/30">
      
      {/* Top Bar: Emergency Call & Language selector */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Auto<span className="text-rose-500">ResQ</span>
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 pl-2 border-l border-slate-700">
            Intelligent Emergency Response
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
              aria-label="Select website language"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Quick SOS Dial */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 text-xs font-bold transition"
            title="Emergency Hotline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono">112 / 911</span>
          </a>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-slate-50 to-white px-6 sm:px-8 pt-8 pb-4 text-center border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/25 mb-4 transform hover:scale-105 transition-transform">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome to Auto<span className="text-rose-600">ResQ</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 max-w-xs mx-auto">
              Sign in to access emergency reporting and support.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Google Authentication Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition active:scale-[0.99] disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or Continue with Email
              </span>
            </div>

            {/* Tabs: Sign In / Create Account */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setInfoMessage(null); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); setInfoMessage(null); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error & Info Alerts */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{infoMessage}</span>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Compulsory Fields for New Registration */}
              {mode === 'signup' && (
                <>
                  {/* Full Name (Compulsory) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Age (Compulsory) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Age <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 28"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password with Show/Hide toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  {mode === 'login' && (
                    <span className="text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer">
                      Demo pass: <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-mono">password123</code>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/25 transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block animate-pulse">Processing...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to AutoResQ' : 'Create AutoResQ Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* One-Click Quick Demo Sign-In Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>Or explore with instant demo accounts</span>
                <span className="text-emerald-700 font-medium">1-Click</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => loginAsDemo('citizen')}
                  className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold text-left transition flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="group-hover:text-rose-600">Citizen Reporter</span>
                    <span className="text-[10px] text-slate-500 font-normal">Alex Mercer (29)</span>
                  </div>
                  <Radio className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                </button>

                <button
                  type="button"
                  onClick={() => loginAsDemo('reviewer')}
                  className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold text-left transition flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="group-hover:text-blue-600">Triage Officer</span>
                    <span className="text-[10px] text-slate-500 font-normal">Rajiv Verma (38)</span>
                  </div>
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </button>
              </div>
            </div>

            {/* Supabase backend status pill */}
            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>
                  {isSupabaseConnected ? 'Connected to Supabase PostgreSQL' : 'PostgreSQL Schema Ready (Demo Fallback Active)'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800">
        AutoResQ • Fast Reporting. Smarter Emergency Support. • All personal data is encrypted & protected with RLS.
      </footer>
    </div>
  );
};
