import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  ArrowUpRight, 
  Sliders, 
  Volume2, 
  VolumeX,
  ShieldAlert
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useIncidents();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const filtered = notifications.filter(n => {
    if (filterSeverity !== 'all' && n.severity !== filterSeverity) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#121A2B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Command Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry stream of newly submitted emergencies, triage status transitions, and reviewer notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markNotificationsAsRead()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition"
            >
              <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              soundEnabled
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
            title="Toggle audible chime"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Chime: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'critical', label: 'Critical Life-Safety' },
          { id: 'warning', label: 'Warnings / Triage' },
          { id: 'info', label: 'Informational' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterSeverity(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterSeverity === tab.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-[#121A2B] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-xl bg-[#121A2B] border border-slate-800 overflow-hidden shadow-xl divide-y divide-slate-800/60">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notification events in this filter stream.
          </div>
        ) : (
          filtered.map(notif => {
            let Icon = Info;
            let iconColor = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
            if (notif.severity === 'critical') {
              Icon = AlertOctagon;
              iconColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            } else if (notif.severity === 'warning') {
              Icon = AlertTriangle;
              iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            }

            return (
              <div
                key={notif.id}
                className={`p-4 transition flex items-start gap-3.5 ${
                  notif.read ? 'bg-transparent' : 'bg-slate-800/30'
                }`}
              >
                <div className={`p-2 rounded-lg border shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-white truncate">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    {notif.incidentId && (
                      <Link
                        to={`/incidents/${notif.incidentId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300"
                      >
                        <span>Open Incident {notif.incidentId}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationsAsRead(notif.id)}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
