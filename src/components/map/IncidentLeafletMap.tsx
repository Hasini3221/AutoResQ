import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { IncidentReport, EmergencyResource, IncidentSeverity } from '../../types';
import { Link } from 'react-router-dom';
import { AlertCircle, Navigation, Hospital, Flame, Shield, ArrowUpRight } from 'lucide-react';

// Custom colored SVG pin markers
function createIncidentMarkerIcon(severity: IncidentSeverity) {
  let color = '#38BDF8'; // medium
  let pulse = '';
  if (severity === 'critical') {
    color = '#F43F5E';
    pulse = '<span class="absolute -inset-1 rounded-full animate-ping opacity-75 bg-rose-500"></span>';
  } else if (severity === 'high') {
    color = '#F59E0B';
  } else if (severity === 'low') {
    color = '#10B981';
  }

  const html = `
    <div class="relative flex items-center justify-center w-7 h-7">
      ${pulse}
      <div class="relative w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold" style="background-color: ${color}">
        !
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-incident-pin',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

function createResourceMarkerIcon(type: string) {
  let color = '#EF4444'; // Hospital
  let iconText = '+';
  if (type === 'fire_station') {
    color = '#F97316';
    iconText = 'F';
  } else if (type === 'disaster_relief') {
    color = '#6366F1';
    iconText = 'D';
  }

  const html = `
    <div class="w-6 h-6 rounded-md border border-slate-300 shadow-md flex items-center justify-center text-white text-xs font-bold" style="background-color: ${color}">
      ${iconText}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-resource-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

// Sub-component to pan map smoothly when center changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Sub-component for interactive location picking
function LocationPickerHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

interface IncidentLeafletMapProps {
  center?: [number, number];
  zoom?: number;
  incidents?: IncidentReport[];
  resources?: EmergencyResource[];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  showResources?: boolean;
}

export const IncidentLeafletMap: React.FC<IncidentLeafletMapProps> = ({
  center = [17.4435, 78.3772],
  zoom = 13,
  incidents = [],
  resources = [],
  selectedLocation = null,
  onLocationSelect,
  height = '420px',
  showResources = true
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full bg-[#121A2B] rounded-xl flex items-center justify-center border border-slate-800 text-slate-400 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span>Initializing Command Map Tiles...</span>
        </div>
      </div>
    );
  }

  const effectiveCenter: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : center;

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden relative border border-slate-800 shadow-xl">
      <MapContainer
        center={effectiveCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full dark-tiles"
      >
        <ChangeView center={effectiveCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onLocationSelect && <LocationPickerHandler onLocationSelect={onLocationSelect} />}

        {/* Selected Location marker in picker mode */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={L.divIcon({
              html: `
                <div class="relative flex items-center justify-center w-8 h-8">
                  <span class="absolute -inset-1 rounded-full animate-ping opacity-75 bg-blue-500"></span>
                  <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                    📍
                  </div>
                </div>
              `,
              className: 'pinned-location',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
          >
            <Popup>
              <div className="text-xs p-1">
                <strong className="text-blue-400 font-semibold">Incident Pin Selected</strong>
                <p className="text-slate-300 mt-1 font-mono">
                  {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident markers */}
        {incidents.map(inc => {
          if (!inc.location || typeof inc.location.latitude !== 'number') return null;
          return (
            <Marker
              key={inc.id}
              position={[inc.location.latitude, inc.location.longitude]}
              icon={createIncidentMarkerIcon(inc.severity)}
            >
              <Popup>
                <div className="p-2 min-w-[210px] text-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold text-sky-400">{inc.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-300">
                      {inc.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs leading-snug text-white mb-1">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-2 truncate">
                    📍 {inc.location.address}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Sev: <strong className="text-rose-400">{inc.severity}</strong>
                    </span>
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300"
                    >
                      View Report <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Resource markers (hospitals, fire stations) */}
        {showResources && resources.map(res => {
          return (
            <Marker
              key={res.id}
              position={[res.latitude, res.longitude]}
              icon={createResourceMarkerIcon(res.type)}
            >
              <Popup>
                <div className="p-2 min-w-[200px] text-slate-100">
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                    {res.type.replace('_', ' ')}
                  </span>
                  <h4 className="font-semibold text-xs text-white mt-1 mb-0.5">
                    {res.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-1.5">
                    {res.address}
                  </p>
                  <div className="text-[11px] font-mono text-slate-300">
                    📞 <a href={`tel:${res.phone}`} className="hover:underline">{res.phone}</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-[#121A2B]/90 backdrop-blur-md border border-slate-700/70 p-2.5 rounded-lg text-[11px] text-slate-300 shadow-xl space-y-1">
        <div className="font-bold text-slate-200 text-[10px] tracking-wider uppercase mb-1 border-b border-slate-700 pb-1">
          Command Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Critical Incident</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>High Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          <span>Medium / Low</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700">
          <span className="w-2.5 h-2.5 rounded bg-red-600 text-[8px] text-white flex items-center justify-center font-bold">+</span>
          <span>Trauma / Hospital</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-orange-500 text-[8px] text-white flex items-center justify-center font-bold">F</span>
          <span>Fire Station</span>
        </div>
      </div>
    </div>
  );
};
