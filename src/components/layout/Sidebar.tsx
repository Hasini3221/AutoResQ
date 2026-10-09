import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Radio, 
  FileText, 
  Map, 
  Building2, 
  BarChart3, 
  Bell, 
  Settings, 
  UserCheck, 
  ShieldAlert,
  Sliders,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIncidents } from '../../context/IncidentContext';

export const Sidebar: React.FC = () => {
  const { user, role } = useAuth();
  const { metrics, notifications } = useIncidents();
  const unreadCount = notifications.filter(n => !n.read).length;

  const baseItems = [
    { to: '/dashboard', label: 'Operations Overview', icon: LayoutDashboard },
    { to: '/report-emergency', label: 'Report Incident', icon: Radio, highlight: true },
    { to: '/incidents', label: 'All Incidents', icon: FileText, badge: metrics.total },
    { to: '/map', label: 'Command Live Map', icon: Map },
    { to: '/resources', label: 'Emergency Facilities', icon: Building2 },
    { to: '/analytics', label: 'Operations Analytics', icon: BarChart3 },
    { to: '/notifications', label: 'Notifications Feed', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  const reviewerItems = [
    { to: '/incidents?status=awaiting_review', label: 'Triage Queue', icon: UserCheck, badge: metrics.awaitingReview }
  ];

  const adminItems = [
    { to: '/settings', label: 'Platform & Secrets Config', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0F1626] border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Operator Profile Bar */}
      <div className="p-4 border-b border-slate-800 bg-[#121A2B]/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                role === 'admin' ? 'bg-purple-400' : role === 'reviewer' ? 'bg-blue-400' : 'bg-emerald-400'
              }`} />
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 truncate">
                {role === 'admin' ? 'System Administrator' : role === 'reviewer' ? 'Authorized Reviewer' : 'Citizen Reporter'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Triage Counter */}
        {role !== 'citizen' && (
          <div className="mt-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Queue Awaiting:</span>
            <span className="font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">
              {metrics.awaitingReview} Pending
            </span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Core Navigation */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            Command Center
          </div>
          {baseItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : item.highlight
                      ? 'text-rose-400 hover:bg-rose-500/10 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-rose-500' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full font-bold ${
                    item.to.includes('notifications')
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Role-Specific: Reviewer Only Section */}
        {role !== 'citizen' && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 font-mono flex items-center justify-between">
              <span>Reviewer Operations</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 font-mono">AUTH</span>
            </div>
            {reviewerItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Administrator Section */}
        {role === 'admin' && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2 font-mono flex items-center justify-between">
              <span>Admin Console</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/10 text-purple-400 font-mono">ROOT</span>
            </div>
            {adminItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      {/* Disclaimer reminder in sidebar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-400 leading-tight">
        <span className="text-amber-400 font-bold block mb-0.5">Assistance Prototype</span>
        Not connected to real 911 dispatch trunks. Contact official numbers during real emergencies.
      </div>
    </aside>
  );
};
