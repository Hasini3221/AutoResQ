import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Radio, 
  Building2, 
  Car, 
  HeartPulse, 
  Flame, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  Clock,
  Navigation
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  const emergencyCategories = [
    { id: 'accident', title: t.catAccident, icon: Car, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'medical', title: t.catMedical, icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'fire', title: t.catFire, icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'other', title: t.catOther, icon: AlertTriangle, color: 'text-purple-600 bg-purple-50 border-purple-200' }
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* 1. HERO SECTION: Clean white background, dark navy text, 2 large clear buttons */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Auto<span className="text-rose-600">ResQ</span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-slate-600">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Clear Heading */}
        <div className="space-y-3 pt-2">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {t.heroHeading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t.heroSubheading}
          </p>
        </div>

        {/* TWO LARGE CLEAR BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
          
          {/* Button 1: Report an Emergency */}
          <Link
            to="/report-emergency"
            className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group border border-rose-700"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              {t.reportEmergencyBtn}
            </span>
            <span className="text-xs text-rose-100 font-medium mt-1">
              Takes less than 1 minute • 4 simple steps
            </span>
          </Link>

          {/* Button 2: Find Nearby Hospitals */}
          <Link
            to="/hospitals"
            className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-blue-500 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              {t.findHospitalsBtn}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              24/7 Emergency Wards & Directions
            </span>
          </Link>

        </div>

        {/* Quick Emergency Helplines Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>Direct Emergency Call Numbers:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono font-bold text-xs">
            <a
              href="tel:112"
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition shadow-xs"
            >
              National SOS: 112
            </a>
            <a
              href="tel:108"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition shadow-2xs"
            >
              Medical: 108
            </a>
            <a
              href="tel:101"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition shadow-2xs"
            >
              Fire: 101
            </a>
            <a
              href="tel:100"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition shadow-2xs"
            >
              Police: 100
            </a>
          </div>
        </div>

      </section>

      {/* 2. HOW AUTORESQ WORKS: 3 Simple Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.howItWorksTitle}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.howItWorksSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-black text-base font-mono">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {t.step1Title}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-black text-base font-mono">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {t.step2Title}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-black text-base font-mono">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {t.step3Title}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>

        </div>
      </section>

      {/* 3. QUICK EMERGENCY CATEGORIES SELECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Report by Emergency Type
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Tap any category below to begin reporting immediately.
            </p>
          </div>
          <Link
            to="/report-emergency"
            className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>Start Report</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {emergencyCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/report-emergency?type=${cat.id}`}
                className={`p-5 rounded-2xl border bg-white hover:bg-slate-50 transition shadow-2xs hover:shadow-md flex flex-col items-center text-center space-y-3 group`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm sm:text-base text-slate-900">
                  {cat.title}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 pt-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 font-semibold text-slate-600">
          <Link to="/" className="hover:text-rose-600">{t.navHome}</Link>
          <span>•</span>
          <Link to="/report-emergency" className="hover:text-rose-600">{t.navReport}</Link>
          <span>•</span>
          <Link to="/hospitals" className="hover:text-rose-600">{t.navHospitals}</Link>
          <span>•</span>
          <Link to="/dashboard" className="hover:text-rose-600">{t.navDashboard}</Link>
          <span>•</span>
          <Link to="/help" className="hover:text-rose-600">{t.navHelp}</Link>
        </div>
        <p className="text-slate-400">
          AutoResQ — Intelligent Emergency Response Automation. Designed for fast reporting and smarter emergency support.
        </p>
      </footer>

    </div>
  );
};
