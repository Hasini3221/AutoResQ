import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Radio, 
  Clock, 
  Eye, 
  CheckCircle2, 
  FileText, 
  Search, 
  ArrowUpRight, 
  RefreshCw, 
  Car, 
  HeartPulse, 
  Flame, 
  AlertTriangle,
  RotateCcw,
  Building2,
  Filter
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { IncidentStatus, IncidentReport } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, metrics, isLoading, refreshData, resetDemoData } = useIncidents();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyMyReports, setOnlyMyReports] = useState<boolean>(false);

  // Filtered incidents
  const filtered = incidents.filter(inc => {
    if (onlyMyReports && user) {
      const isMine = (inc.userId && inc.userId === user.id) || inc.reporterEmail === user.email;
      if (!isMine) return false;
    }
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const match = 
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.address.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accident': return <Car className="w-4 h-4 text-amber-600" />;
      case 'medical': return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'fire': return <Flame className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-purple-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'accident': return t.catAccident;
      case 'medical': return t.catMedical;
      case 'fire': return t.catFire;
      default: return t.catOther;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'awaiting_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{t.statusPending}</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Eye className="w-3 h-3 text-blue-600" />
            <span>{t.statusUnderReview}</span>
          </span>
        );
      case 'action_recorded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            <span>{t.statusActionRecorded}</span>
          </span>
        );
      case 'resolved':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t.statusResolved}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.dashboardTitle}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.dashboardSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshData()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-2xs"
            title="Refresh Incident Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
          </button>

          <button
            onClick={() => resetDemoData()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold transition shadow-2xs"
            title="Reset to initial sample records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo State</span>
          </button>

          <Link
            to="/report-emergency"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{t.reportEmergencyBtn}</span>
          </Link>
        </div>
      </div>

      {/* 4 CLEAN KPI CARDS (Only these 4 sections per specification) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Reports */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
            <span>{t.statTotalReports}</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black font-mono">{metrics.total}</div>
          <div className="text-[11px] opacity-70 mt-1">All registered incident records</div>
        </div>

        {/* 2. Pending Reports */}
        <div
          onClick={() => setStatusFilter('awaiting_review')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'awaiting_review'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 text-amber-700">
            <span className={statusFilter === 'awaiting_review' ? 'text-white' : 'text-amber-800'}>
              {t.statPendingReports}
            </span>
            <Clock className={`w-4 h-4 ${statusFilter === 'awaiting_review' ? 'text-white' : 'text-amber-600'}`} />
          </div>
          <div className="text-3xl font-black font-mono">{metrics.awaitingReview}</div>
          <div className={`text-[11px] mt-1 ${statusFilter === 'awaiting_review' ? 'text-amber-100' : 'text-amber-700'}`}>
            Awaiting triage review
          </div>
        </div>

        {/* 3. Reports Under Review */}
        <div
          onClick={() => setStatusFilter('under_review')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'under_review'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 text-blue-700">
            <span className={statusFilter === 'under_review' ? 'text-white' : 'text-blue-800'}>
              {t.statUnderReview}
            </span>
            <Eye className={`w-4 h-4 ${statusFilter === 'under_review' ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <div className="text-3xl font-black font-mono">{metrics.underReview}</div>
          <div className={`text-[11px] mt-1 ${statusFilter === 'under_review' ? 'text-blue-100' : 'text-blue-700'}`}>
            Triage team active
          </div>
        </div>

        {/* 4. Resolved Reports */}
        <div
          onClick={() => setStatusFilter('resolved')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'resolved'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 text-emerald-700">
            <span className={statusFilter === 'resolved' ? 'text-white' : 'text-emerald-800'}>
              {t.statResolvedReports}
            </span>
            <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'resolved' ? 'text-white' : 'text-emerald-600'}`} />
          </div>
          <div className="text-3xl font-black font-mono">{metrics.resolved}</div>
          <div className={`text-[11px] mt-1 ${statusFilter === 'resolved' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Closed incidents
          </div>
        </div>

      </div>

      {/* READABLE INCIDENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden space-y-3">
        
        {/* Search & Filter Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search reports by ID or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {user && (
              <button
                type="button"
                onClick={() => setOnlyMyReports(!onlyMyReports)}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  onlyMyReports
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>My Reports Only</span>
              </button>
            )}

            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition"
              >
                Clear Status Filter
              </button>
            )}
            <span className="text-slate-500 font-mono">
              Showing {filtered.length} of {incidents.length}
            </span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4 font-mono">{t.tableId}</th>
                <th className="py-3 px-4">{t.tableType}</th>
                <th className="py-3 px-4">{t.tableLocation}</th>
                <th className="py-3 px-4">{t.tableDate}</th>
                <th className="py-3 px-4">{t.tableStatus}</th>
                <th className="py-3 px-4 text-right">{t.tableAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No reports match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(inc => (
                  <tr
                    key={inc.id}
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600 whitespace-nowrap">
                      {inc.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        {getCategoryIcon(inc.category)}
                        <span>{getCategoryLabel(inc.category)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                      {inc.location.address}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                      {new Date(inc.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(inc.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                        {t.viewDetailsBtn}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.demoModeNotice}</span>
          <span className="font-mono text-slate-400 text-[11px]">AutoResQ Live Telemetry v2.4</span>
        </div>
      </div>

    </div>
  );
};
