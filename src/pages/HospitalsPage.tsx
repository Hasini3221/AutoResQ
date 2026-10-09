import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  ExternalLink, 
  Crosshair, 
  Search, 
  Clock, 
  ShieldCheck, 
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyResource } from '../types';
import { IncidentLeafletMap } from '../components/map/IncidentLeafletMap';

export const HospitalsPage: React.FC = () => {
  const { resources } = useIncidents();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Filter only hospitals and trauma centers
  const baseHospitals = resources.filter(r => r.type === 'hospital' || r.type === 'trauma_center');

  // Calculate distance if user location is available
  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  const hospitalsWithDistance = baseHospitals.map(h => {
    if (userLocation) {
      const dist = getDistanceKm(userLocation.lat, userLocation.lng, h.latitude, h.longitude);
      return { ...h, distanceKm: dist };
    }
    return h;
  });

  if (userLocation) {
    hospitalsWithDistance.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  const filteredHospitals = hospitalsWithDistance.filter(h => {
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationStatus(t.gpsLocating);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationStatus('GPS location acquired. Hospitals sorted by closest distance.');
        setLocating(false);
      },
      err => {
        console.warn('Geolocation error:', err.message);
        setLocationStatus('Could not access GPS. Displaying hospitals from civic directory.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.hospitalsTitle}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t.hospitalsSub}
        </p>

        {/* Clear "Find Nearby Hospitals" Location Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleRequestLocation}
            disabled={locating}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? t.gpsLocating : t.findHospitalsBtn}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 max-w-md mx-auto">
            {locationStatus}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t.hospitalSearchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
      </div>

      {/* Hospitals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map(h => (
          <div
            key={h.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  {h.type === 'trauma_center' ? 'Level-1 Trauma Center' : '24/7 Emergency Hospital'}
                </span>

                {h.distanceKm !== undefined ? (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {h.distanceKm} km away
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Civic Directory
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {h.name}
                </h3>
                <p className="text-xs text-slate-600 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{h.address}</span>
                </p>
              </div>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {h.capabilities.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: Direct Call & Route Directions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs gap-2">
              <a
                href={`tel:${h.phone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center flex items-center justify-center gap-1.5 transition shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {h.phone}</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold flex items-center gap-1.5 transition shadow-2xs"
              >
                <span>{t.directionsBtn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Map View */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Emergency Care Geospatial Map
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {filteredHospitals.length} Centers Plotted
          </span>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <IncidentLeafletMap
            height="340px"
            center={userLocation ? [userLocation.lat, userLocation.lng] : [17.4435, 78.3772]}
            zoom={13}
            resources={baseHospitals}
            selectedLocation={userLocation}
          />
        </div>
      </div>

      {/* Informative Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Directory verified from regional emergency health registries. Hospital proximity does not establish real-time bed or oxygen availability.
        </span>
      </div>

    </div>
  );
};
