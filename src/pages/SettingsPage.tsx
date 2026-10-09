import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  RotateCcw, 
  Sparkles, 
  Server, 
  ShieldCheck, 
  Sliders, 
  Globe, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { systemStatus, resetDemoData, incidents } = useIncidents();
  const { role } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setResetMessage(null);
    try {
      await resetDemoData();
      setResetMessage('Demo incidents ledger has been reset to baseline factory state.');
    } catch (e) {
      setResetMessage('Error resetting demo state.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#121A2B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Platform & Integration Diagnostics
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              SYS CONFIG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System health indicators, Gemini API integration telemetry, and demonstration environment controls.
          </p>
        </div>
      </div>

      {/* Health & Engine Status */}
      <div className="p-6 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-400" />
          Backend & Intelligence Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Gemini AI Status */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Gemini Triage Model
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Configured via server-side GoogleGenAI SDK with secure zero-leak proxy route at <code className="text-sky-300 font-mono">/api/incidents/analyze</code>.
            </p>
            <div className="pt-1 text-[10px] font-mono text-slate-400">
              Fallback Engine: Rule-based heuristic emergency classifier
            </div>
          </div>

          {/* Map & Geolocation */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                Map & Geocoding Layer
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Leaflet / OSM
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              OpenStreetMap tile server with dark-mode filter styling, custom SVG markers, and geodesic haversine distance computation.
            </p>
            <div className="pt-1 text-[10px] font-mono text-slate-400">
              Permissions: Geolocation API enabled with iframe delegation
            </div>
          </div>

        </div>
      </div>

      {/* Demo State Controls */}
      <div className="p-6 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-400" />
          Demonstration Environment Management
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          During hackathon judging, you can test creating multiple incident reports, altering statuses, and updating reviewer notes. You can restore the baseline seed dataset at any time using the control below.
        </p>

        {resetMessage && (
          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
            {resetMessage}
          </div>
        )}

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Reset Ledger to Factory Baseline</div>
            <div className="text-[11px] text-slate-400">
              Currently storing {incidents.length} incidents in in-memory session.
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow disabled:opacity-50"
          >
            {resetting ? 'Resetting...' : 'Reset Demo Records'}
          </button>
        </div>
      </div>

      {/* Safety Compliance & Disclosure */}
      <div className="p-6 rounded-2xl bg-[#182338]/80 border border-rose-500/30 space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Hackathon Safety Policy Compliance</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          AutoResQ does not initiate automated statutory 911/112 emergency calls or dispatch physical ambulances without manual human intervention. All generated reports in this demonstration build are stored with transparent verification badges.
        </p>
      </div>

    </div>
  );
};
