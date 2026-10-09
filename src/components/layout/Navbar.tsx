import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Globe, 
  Menu, 
  X, 
  ChevronDown, 
  PhoneCall, 
  Check, 
  Radio, 
  Building2, 
  LayoutDashboard, 
  HelpCircle,
  Home,
  User,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_LANGUAGES, Language } from '../../i18n/translations';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/report-emergency', label: t.navReport, icon: Radio, highlight: true },
    { to: '/hospitals', label: t.navHospitals, icon: Building2 },
    { to: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { to: '/help', label: t.navHelp, icon: HelpCircle }
  ];

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20 group-hover:bg-rose-700 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                Auto<span className="text-rose-600">ResQ</span>
              </span>
              <span className="text-[11px] text-slate-700 font-medium tracking-normal mt-1 hidden sm:inline">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Only 5 main items) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const active = isActive(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
                    active
                      ? 'bg-slate-100 text-rose-600 font-bold'
                      : link.highlight
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-rose-600' : link.highlight ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: 7-Language Dropdown & Quick SOS Call */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 7-Languages Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition shadow-2xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
                  role="listbox"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Select Language / భాష / भाषा
                  </div>
                  {SUPPORTED_LANGUAGES.map(lang => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-rose-50 text-rose-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-600">{lang.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Emergency Helplines Call Badge */}
            <a
              href="tel:112"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 transition"
              title="National Emergency Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>112 / 108</span>
            </a>

            {/* User Account / Profile Dropdown */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-2xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  aria-expanded={userDropdownOpen}
                  aria-label="User account menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {(user.full_name || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block max-w-[100px] truncate">
                    {user.full_name || user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline-block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.full_name || user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-mono">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700">
                          {user.role}
                        </span>
                        {user.age && (
                          <span className="text-[10px] text-slate-500">
                            Age: {user.age}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Account Profile & Reports</span>
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Prominent Red Report Emergency Button */}
            <Link
              to="/report-emergency"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{t.reportEmergencyBtn}</span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 shadow-lg">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-2 pt-1 font-mono">
            Navigation Menu
          </div>
          {navLinks.map(link => {
            const active = isActive(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  active
                    ? 'bg-rose-50 text-rose-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-rose-600' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    {(user.full_name || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{user.full_name || user.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold"
                    title="Profile"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>National Emergency Hotline: 112 / 108</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
