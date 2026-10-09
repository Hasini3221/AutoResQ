import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Mail, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  Database,
  Radio,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, logout, isSupabaseConnected, isDemoAuth } = useAuth();
  const { incidents } = useIncidents();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState<string>(user?.full_name || user?.name || '');
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [agency, setAgency] = useState<string>(user?.agency || '');

  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User's own reported incidents
  const myReports = incidents.filter(i => (i.userId && i.userId === user?.id) || i.reporterEmail === user?.email);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const parsedAge = parseInt(age, 10);
    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Full Name is compulsory.' });
      return;
    }
    if (!age || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setStatusMessage({ type: 'error', text: 'Valid age (1-120) is compulsory.' });
      return;
    }

    setSaving(true);
    try {
      const res = await updateUserProfile({
        full_name: fullName.trim(),
        age: parsedAge,
        phone: phone.trim() || undefined,
        agency: agency.trim() || undefined
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Profile updated successfully and synced with database!' });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to save profile changes.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error updating profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User Account & Profile
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your personal profile and view your submitted emergency reports.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-sm font-bold border border-slate-200 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Account Overview Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-rose-600/20">
              {fullName.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">{fullName || 'User'}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                {user?.role === 'admin' ? 'Commander / Admin' : user?.role === 'reviewer' ? 'Triage Reviewer' : 'Citizen Reporter'}
              </span>
              {user?.age && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Age: {user.age}
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-left text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  {isSupabaseConnected ? 'Supabase PostgreSQL' : 'Local / Demo Store'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Reports:</span>
                <span className="font-bold text-slate-900">{myReports.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Profile Edit Form */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                Edit Personal Information
              </h3>
              <span className="text-xs text-slate-400 font-medium">* Compulsory fields</span>
            </div>

            {statusMessage && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-bold">{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
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
                      required
                      placeholder="Your full legal name"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Age */}
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
                      required
                      placeholder="e.g. 29"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email (Readonly authentication email) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Verified Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email is linked to your secure authentication provider.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Emergency Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                {/* Agency / Role Info */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Organization / Agency (Optional)
                  </label>
                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    placeholder="e.g. Red Cross / Metro Volunteer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition active:scale-[0.99] flex items-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* User's Reports Quick Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600" />
                <span>My Submitted Reports ({myReports.length})</span>
              </h3>
              <Link to="/report-emergency" className="text-xs text-rose-600 font-bold hover:underline">
                + Report New Incident
              </Link>
            </div>

            {myReports.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">
                You have not submitted any emergency reports yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {myReports.slice(0, 5).map(rep => (
                  <div key={rep.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{rep.id}</span>
                        <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {rep.category}
                        </span>
                      </div>
                      <span className="text-slate-500 truncate max-w-xs mt-0.5">{rep.title}</span>
                    </div>

                    <Link
                      to={`/incidents/${rep.id}`}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1 transition shrink-0"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
