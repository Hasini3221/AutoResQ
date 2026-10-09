import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { EmergencyResource } from '../types';
import { 
  Building2, 
  Hospital, 
  Flame, 
  Shield, 
  PhoneCall, 
  Navigation, 
  Search, 
  ExternalLink,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { resources } = useIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredResources = resources.filter(res => {
    if (filterType !== 'all' && res.type !== filterType) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        res.name.toLowerCase().includes(q) ||
        res.address.toLowerCase().includes(q) ||
        res.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#121A2B] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Emergency Facilities & Health Corridors
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              VERIFIED DIRECTORY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trauma centers, multi-specialty emergency rooms, fire & hazmat headquarters, and regional disaster relief staging bases.
          </p>
        </div>

        {/* National Hotlines Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <a
            href="tel:108"
            className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 transition flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Ambulance: 108</span>
          </a>
          <a
            href="tel:101"
            className="px-3 py-1.5 rounded-lg bg-orange-600/20 text-orange-300 border border-orange-500/30 hover:bg-orange-600/30 transition flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Fire: 101</span>
          </a>
          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition flex items-center gap-1.5 font-bold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS: 112</span>
          </a>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search facility name, address, or trauma specialty..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Facilities' },
            { id: 'trauma_center', label: 'Trauma Centers' },
            { id: 'hospital', label: 'Hospitals' },
            { id: 'fire_station', label: 'Fire Stations' },
            { id: 'disaster_relief', label: 'Disaster Relief' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => {
          const isHospital = res.type === 'hospital' || res.type === 'trauma_center';
          const isFire = res.type === 'fire_station';

          return (
            <div
              key={res.id}
              className="p-5 rounded-xl bg-[#121A2B] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      res.type === 'trauma_center'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isHospital
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : isFire
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {res.type.replace('_', ' ')}
                  </span>

                  {res.is24x7 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Clock className="w-3 h-3" /> 24/7 Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {res.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{res.address}</span>
                  </p>
                </div>

                {/* Capabilities pills */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Capabilities & Readiness:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {res.capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs">
                <a
                  href={`tel:${res.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-mono font-bold transition border border-emerald-500/30"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{res.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${res.latitude},${res.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <span>Route Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Resource proximity calculated with geodesic coordinates. Does not guarantee real-time ICU bed vacancy.</span>
        </span>
        <span className="font-mono text-slate-500 text-[11px]">Provider: Civic OpenStreetMap Directory</span>
      </div>

    </div>
  );
};
