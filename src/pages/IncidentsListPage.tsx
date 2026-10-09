import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  Radio
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { EmergencyCategory, IncidentSeverity, IncidentStatus } from '../types';

export const IncidentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const { incidents } = useIncidents();
  const { user, role } = useAuth();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [sortBy, setSortBy] = useState<'newest' | 'severity'>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Severity rank helper
  const severityRank: Record<IncidentSeverity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Filter & Sort
  const filtered = incidents.filter(inc => {
    if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const match = 
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.location.address.toLowerCase().includes(q) ||
        (inc.reporterName && inc.reporterName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'severity') {
      return (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV Export
  const exportToCSV = () => {
    const headers = ['ReportID', 'Category', 'Severity', 'Status', 'Title', 'Address', 'Latitude', 'Longitude', 'CreatedTime', 'Reporter'];
    const rows = sorted.map(i => [
      i.id,
      i.category,
      i.severity,
      i.status,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.location.address.replace(/"/g, '""')}"`,
      i.location.latitude,
      i.location.longitude,
      i.createdAt,
      `"${(i.reporterName || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AutoResQ_Incident_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121A2B] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Incident Ledger & Archive
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical and active logs with AI assessments, verified coordinates, and status lifecycle histories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CSV</span>
          </button>

          {/* New Report */}
          <Link
            to="/report-emergency"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>New Report</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by ID (e.g. ARQ-2026-1042), title, address, or reporter..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="accident">Road Accidents</option>
              <option value="fire">Fire Emergencies</option>
              <option value="medical">Medical Emergencies</option>
              <option value="collapse">Structural Collapses</option>
              <option value="flood">Floods</option>
              <option value="other">Other</option>
            </select>

            {/* Severity */}
            <select
              value={selectedSeverity}
              onChange={e => { setSelectedSeverity(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="awaiting_review">Awaiting Review</option>
              <option value="under_review">Under Review</option>
              <option value="action_recorded">Action Recorded</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="severity">Sort: Highest Severity</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span>Found <strong className="text-white">{sorted.length}</strong> matching records</span>
          {(selectedCategory !== 'all' || selectedSeverity !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setSelectedStatus('all');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-xs text-rose-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Cards / Table */}
      <div className="rounded-xl bg-[#121A2B] border border-slate-800 overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {paginated.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No incident reports matched your query.
            </div>
          ) : (
            paginated.map(inc => (
              <div
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="p-4 hover:bg-slate-800/40 cursor-pointer transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{inc.id}</span>
                    <div className="flex items-center gap-1 text-xs text-slate-300 font-medium capitalize">
                      <CategoryIcon category={inc.category} className="w-3.5 h-3.5" />
                      <span>{inc.category}</span>
                    </div>
                    <SeverityBadge severity={inc.severity} size="sm" />
                    <StatusBadge status={inc.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-semibold text-white truncate">
                    {inc.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {inc.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {inc.location.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(inc.createdAt).toLocaleString()}
                    </span>
                    {inc.reporterName && (
                      <span>Reporter: {inc.reporterName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-sky-400 hover:text-sky-300">
                    Open File <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/40">
            <div>
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
