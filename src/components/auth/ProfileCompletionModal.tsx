import React, { useState } from 'react';
import { User, Calendar, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileCompletionModal: React.FC = () => {
  const { user, completeProfile } = useAuth();
  
  const [fullName, setFullName] = useState<string>(user?.full_name || user?.name || '');
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError('Full Name is compulsory for emergency response records.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (!age || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setError('Age is compulsory and must be between 1 and 120.');
      return;
    }

    setLoading(true);
    try {
      const res = await completeProfile(trimmedName, parsedAge);
      if (!res.success) {
        setError(res.error || 'Failed to save profile details.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black">Complete Your Profile</h2>
          <p className="text-xs text-rose-100 mt-1">
            To coordinate emergency help accurately, please provide your compulsory details.
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Age is required by emergency medical triage teams during hospital routing.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Saving Profile...' : 'Save & Continue to AutoResQ'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
