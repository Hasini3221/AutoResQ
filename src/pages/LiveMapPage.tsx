import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { IncidentLeafletMap } from '../components/map/IncidentLeafletMap';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { IncidentReport, IncidentSeverity } from '../types';
import { Link } from 'react-router-dom';
import { Layers, MapPin, Filter, ArrowUpRight, ShieldAlert } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const { incidents, resources } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showResources, setShowResources] = useState<boolean>(true);

  const filteredIncidents = incidents.filter(i => {
    if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
    return true;
  });

  const mapCenter: [number, number] = selectedIncident
    ? [selectedIncident.location.latitude, selectedIncident.location.longitude]
    : [17.4435, 78.3772];

  return (
    <div className="space-y-4">
      {/* Top Map Controls Header */}
      <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Tactical Operations Map
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              LIVE RADAR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial tracking of verified and reported emergencies with nearby trauma care corridors.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Severities</option>
              <option value="critical" className="bg-slate-900">Critical Only</option>
              <option value="high" className="bg-slate-900">High Only</option>
              <option value="medium" className="bg-slate-900">Medium Only</option>
              <option value="low" className="bg-slate-900">Low Only</option>
            </select>
          </div>

          <label className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showResources}
              onChange={e => setShowResources(e.target.checked)}
              className="rounded bg-slate-800 text-blue-600 focus:ring-0"
            />
            <span>Show Hospitals & Fire Stations</span>
          </label>
        </div>
      </div>

      {/* Main Map + Sync List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Map View (3 cols) */}
        <div className="lg:col-span-3">
          <IncidentLeafletMap
            height="620px"
            center={mapCenter}
            zoom={selectedIncident ? 15 : 13}
            incidents={filteredIncidents}
            resources={resources}
            showResources={showResources}
          />
        </div>

        {/* Synchronized Incident Sidebar (1 col) */}
        <div className="rounded-xl bg-[#121A2B] border border-slate-800 flex flex-col h-[620px]">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Plotted Incidents ({filteredIncidents.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Click to focus</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredIncidents.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-2.5 rounded-lg cursor-pointer transition text-xs space-y-1 ${
                    isSelected
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-bold text-sky-400 text-[11px]">{inc.id}</span>
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </div>
                  <h4 className="font-semibold text-white line-clamp-1">
                    {inc.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[130px]">📍 {inc.location.address}</span>
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="text-sky-400 hover:text-sky-300 ml-1 shrink-0"
                    >
                      ↗ Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-900/40 text-center">
            GPS verification active on {incidents.filter(i => i.location.isGpsVerified).length} reports
          </div>
        </div>

      </div>
    </div>
  );
};
