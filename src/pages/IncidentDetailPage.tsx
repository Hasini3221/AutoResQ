import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Building2, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  History, 
  FileEdit,
  Eye,
  Car,
  HeartPulse,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { IncidentReport, IncidentStatus, EmergencyResource } from '../types';
import { IncidentLeafletMap } from '../components/map/IncidentLeafletMap';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIncidentById, updateIncidentStatus, resources } = useIncidents();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('under_review');
  const [reviewerNote, setReviewerNote] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      setLoading(true);
      getIncidentById(id).then(data => {
        if (isMounted) {
          setIncident(data);
          if (data) {
            setNewStatus(data.status);
          }
          setLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [id, getIncidentById]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-sm text-slate-500 font-mono">Loading incident record {id}...</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Incident Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested report ID was not found in the operations ledger.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident) return;
    setUpdatingStatus(true);
    setStatusFeedback(null);

    try {
      const updated = await updateIncidentStatus(
        incident.id,
        newStatus,
        reviewerNote || `Status changed to ${newStatus.replace('_', ' ')}`
      );
      setIncident(updated);
      setReviewerNote('');
      setStatusFeedback(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
    } catch (err: any) {
      setStatusFeedback('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const nearbyList: EmergencyResource[] = incident.nearbyResources || resources.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      
      {/* Top Back Nav */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-xs font-mono text-slate-400">
          Created: {new Date(incident.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Main Incident Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {incident.id}
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 capitalize">
              {incident.category}
            </span>
          </div>

          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              incident.status === 'resolved'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : incident.status === 'under_review'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {incident.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
          {incident.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>{incident.location.address}</span>
          </span>
          <span>•</span>
          <span className="font-mono text-slate-500">
            Lat: {incident.location.latitude.toFixed(5)}, Lng: {incident.location.longitude.toFixed(5)}
          </span>
          {incident.location.isGpsVerified && (
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              GPS Verified
            </span>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {incident.description}
        </div>

        {incident.imageUrl && (
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Photo Attachment:</span>
            <img
              src={incident.imageUrl}
              alt="Incident Scene"
              className="rounded-2xl max-h-72 object-cover border border-slate-200 shadow-xs"
            />
          </div>
        )}
      </div>

      {/* Location Map Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Geographic Pinpoint
        </h3>
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <IncidentLeafletMap
            height="260px"
            center={[incident.location.latitude, incident.location.longitude]}
            zoom={14}
            incidents={[incident]}
            resources={nearbyList}
          />
        </div>
      </div>

      {/* Reviewer Status Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Triage Reviewer Controls
          </h3>
        </div>

        {statusFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {statusFeedback}
          </div>
        )}

        <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Update Status:
            </label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as IncidentStatus)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="awaiting_review">Pending Review</option>
              <option value="under_review">Under Review (Triage Assigned)</option>
              <option value="action_recorded">Action Recorded (First Responders Contacted)</option>
              <option value="resolved">Resolved (Closed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Reviewer Note:
            </label>
            <textarea
              rows={2}
              value={reviewerNote}
              onChange={e => setReviewerNote(e.target.value)}
              placeholder="e.g. Verified with emergency unit; ambulance dispatched."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={updatingStatus}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            {updatingStatus ? 'Updating...' : 'Save Status Update'}
          </button>
        </form>

        {/* Audit Trail */}
        {incident.statusHistory && incident.statusHistory.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase block font-mono">
              Audit History:
            </span>
            <div className="space-y-2 text-xs">
              {incident.statusHistory.map((h, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 uppercase">{h.status.replace('_', ' ')}</span>
                    <span className="text-slate-500 ml-2">by {h.changedBy}</span>
                    {h.note && <p className="text-slate-600 mt-0.5">{h.note}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nearby Hospitals Recommendation */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              Nearby Hospitals for this Incident
            </h3>
          </div>
          <Link to="/hospitals" className="text-xs font-bold text-blue-600 hover:underline">
            View Hospital Directory →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {nearbyList.slice(0, 2).map(h => (
            <div key={h.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">{h.name}</div>
              <p className="text-slate-500">{h.address}</p>
              <div className="flex items-center justify-between pt-1">
                <a href={`tel:${h.phone}`} className="text-emerald-700 font-bold hover:underline">
                  📞 {h.phone}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Route</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
