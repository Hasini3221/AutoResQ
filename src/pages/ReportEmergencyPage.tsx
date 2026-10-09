import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Car, 
  HeartPulse, 
  Flame, 
  AlertTriangle, 
  MapPin, 
  Crosshair, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  AlertOctagon, 
  PhoneCall, 
  Clock, 
  Building2,
  Users,
  FileText,
  Radio
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyCategory, IncidentSeverity } from '../types';
import { IncidentLeafletMap } from '../components/map/IncidentLeafletMap';
import { VoiceInputButton } from '../components/common/VoiceInputButton';
import { useAuth } from '../context/AuthContext';

export const ReportEmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryType = searchParams.get('type') as EmergencyCategory | null;

  const { createIncident } = useIncidents();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  // Step 1: Emergency Type (4 core options)
  const [category, setCategory] = useState<EmergencyCategory>(
    queryType && ['accident', 'medical', 'fire', 'other'].includes(queryType) ? queryType : 'accident'
  );

  // Step 2: Incident Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [peopleAffected, setPeopleAffected] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Step 3: Location
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 17.4435,
    lng: 78.3772
  });
  const [isGpsVerified, setIsGpsVerified] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  // Step validation
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!category) {
        setErrorMessage(t.errorRequiredField);
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!description.trim()) {
        setErrorMessage(t.errorRequiredField + ' — ' + t.fieldDesc);
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!address.trim() && !isGpsVerified) {
        setErrorMessage(t.errorRequiredField + ' — ' + t.fieldLocationAddress);
        return false;
      }
      return true;
    }
    return true;
  };

  // Browser Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote(t.gpsManualFallback);
      return;
    }

    setLocating(true);
    setLocationNote(t.gpsLocating);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });
        setIsGpsVerified(true);
        const readable = `GPS Coordinates (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
        setAddress(prev => prev.trim() ? prev : readable);
        setLocationNote(t.gpsAcquired);
        setLocating(false);
      },
      err => {
        console.warn('Geolocation access error:', err.message);
        setIsGpsVerified(false);
        setLocationNote(t.gpsManualFallback);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Emergency Report
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formattedTitle = title.trim() || `${getCategoryTitle(category)} Emergency Report`;
      const casualtiesCount = peopleAffected ? parseInt(peopleAffected, 10) || 0 : 0;
      
      const payload = {
        title: formattedTitle,
        category,
        severity: (category === 'fire' || casualtiesCount > 2 ? 'high' : 'medium') as IncidentSeverity,
        description: description.trim(),
        casualtiesEstimate: casualtiesCount,
        location: {
          address: address.trim() || `Coordinates (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          isGpsVerified
        },
        imageUrl: imagePreview || undefined
      };

      const result = await createIncident(payload);
      if (!result || !result.id) {
        throw new Error('Server returned invalid incident response');
      }
      setSubmissionSuccess(result);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(t.errorSubmissionFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  function getCategoryTitle(cat: EmergencyCategory) {
    switch (cat) {
      case 'accident': return t.catAccident;
      case 'medical': return t.catMedical;
      case 'fire': return t.catFire;
      default: return t.catOther;
    }
  }

  // 1. CONFIRMATION SCREEN (Shown after successful submission)
  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 font-mono">
              Status: Pending Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.reportSubmittedTitle}
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              {t.reportSubmittedDesc}
            </p>
          </div>

          {/* Incident ID Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500 font-semibold">{t.incidentIdLabel}:</span>
              <span className="font-mono text-lg font-black text-rose-600">
                {submissionSuccess.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
              <span className="text-slate-500">{t.tableType}:</span>
              <span className="font-bold text-slate-900">{getCategoryTitle(submissionSuccess.category)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{t.tableLocation}:</span>
              <span className="font-medium text-slate-900 truncate max-w-[200px]">{submissionSuccess.location.address}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/hospitals"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{t.findHospitalsBtn}</span>
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm border border-slate-300 transition flex items-center justify-center gap-2"
            >
              <span>{t.goToDashboard}</span>
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setCurrentStep(1);
                setTitle('');
                setDescription('');
                setPeopleAffected('');
                setImagePreview(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium underline"
            >
              {t.fileAnotherReport}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN 4-STEP WIZARD FORM
  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      
      {/* Header & Step Indicator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                {t.reportEmergencyBtn}
              </h1>
              <span className="text-xs text-slate-500">Takes less than 1 minute</span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-mono">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="space-y-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentStep >= s ? 'bg-rose-600' : 'bg-slate-200'
                }`}
              />
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {s === 1 && '1. Type'}
                {s === 2 && '2. Details'}
                {s === 3 && '3. Location'}
                {s === 4 && '4. Submit'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* ================= STEP 1: SELECT EMERGENCY TYPE ================= */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.reportStep1Title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t.reportStep1Sub}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'accident', title: t.catAccident, icon: Car, desc: 'Vehicle collision, pedestrian, road hazard' },
                { id: 'medical', title: t.catMedical, icon: HeartPulse, desc: 'Sudden collapse, severe injury, breathing trouble' },
                { id: 'fire', title: t.catFire, icon: Flame, desc: 'Building fire, smoke, electrical fire' },
                { id: 'other', title: t.catOther, icon: AlertTriangle, desc: 'Flooding, building damage, other dangers' }
              ].map(opt => {
                const Icon = opt.icon;
                const selected = category === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCategory(opt.id as EmergencyCategory)}
                    className={`p-5 rounded-2xl border-2 text-left transition flex items-start gap-4 ${
                      selected
                        ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`p-3 rounded-xl border ${selected ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base text-slate-900">{opt.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: ENTER INCIDENT DETAILS ================= */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.reportStep2Title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t.reportStep2Sub}</p>
            </div>

            <div className="space-y-4">
              {/* Incident Headline with Voice Input */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    {t.fieldTitle}
                  </label>
                  <VoiceInputButton
                    fieldLabel="Headline"
                    onTranscript={(newText) => {
                      setTitle(newText);
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={t.fieldTitlePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-2xs"
                />
              </div>

              {/* Required Short Description with Voice Input (supports continuous speech & appending) */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    {t.fieldDesc}
                  </label>
                  <VoiceInputButton
                    fieldLabel="Description"
                    appendMode={true}
                    onTranscript={(newText) => {
                      setDescription(prev => {
                        const trimmed = prev.trim();
                        return trimmed ? `${trimmed} ${newText}` : newText;
                      });
                    }}
                  />
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t.fieldDescPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-2xs"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  You can type or speak in your selected language. Speaking appends to your description without overwriting.
                </span>
              </div>

              {/* Number of people affected (optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t.fieldPeopleAffected}
                </label>
                <input
                  type="number"
                  min="0"
                  value={peopleAffected}
                  onChange={e => setPeopleAffected(e.target.value)}
                  placeholder="e.g. 1, 2 (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {t.fieldPeopleAffectedHelp}
                </span>
              </div>

              {/* Upload image (optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t.fieldUploadImage}
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="flex items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Scene Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {t.fieldUploadImageHelp}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: IDENTIFY LOCATION ================= */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.reportStep3Title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t.reportStep3Sub}</p>
            </div>

            {/* Prominent One-Tap GPS Button */}
            <div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <Crosshair className={`w-5 h-5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? t.gpsLocating : t.useMyLocationBtn}</span>
              </button>
            </div>

            {locationNote && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                isGpsVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
              }`}>
                {isGpsVerified ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <MapPin className="w-4 h-4 text-slate-500 shrink-0" />}
                <span>{locationNote}</span>
              </div>
            )}

            {/* Address Field (Manual entry enabled) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t.fieldLocationAddress}
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={t.fieldLocationPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            {/* Latitude and Longitude Display */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600 font-mono">
              <span>Latitude: {coordinates.lat.toFixed(5)}</span>
              <span>Longitude: {coordinates.lng.toFixed(5)}</span>
            </div>

            {/* Clean Map Preview with Movable Pin */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">
                Tap anywhere on the map to place the exact location pin:
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                <IncidentLeafletMap
                  height="260px"
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={14}
                  selectedLocation={coordinates}
                  onLocationSelect={(lat, lng) => {
                    setCoordinates({ lat, lng });
                    setAddress(prev => prev.trim() ? prev : `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                    setIsGpsVerified(false);
                    setLocationNote('Location updated from map pin.');
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW AND SUBMIT ================= */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.reportStep4Title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t.reportStep4Sub}</p>
            </div>

            {/* Review Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.tableType}:</span>
                <span className="font-bold text-rose-600 capitalize">
                  {getCategoryTitle(category)}
                </span>
              </div>

              {title && (
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-0.5">{t.fieldTitle}:</span>
                  <span className="font-bold text-slate-900">{title}</span>
                </div>
              )}

              <div className="border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-0.5">{t.fieldDesc}:</span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line">{description}</p>
              </div>

              {peopleAffected && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">{t.fieldPeopleAffected}:</span>
                  <span className="font-bold text-slate-900">{peopleAffected}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.tableLocation}:</span>
                <span className="font-medium text-slate-900 text-right truncate max-w-[240px]">
                  {address || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`}
                </span>
              </div>

              {/* Verified Reporter Info */}
              {user && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Reporter:</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{user.full_name || user.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{user.email}</span>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Attached Photo:</span>
                  <img
                    src={imagePreview}
                    alt="Scene Attachment"
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Prominent One Button: Submit Emergency Report */}
            <div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-lg shadow-rose-600/30 transition transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-6 h-6" />
                    <span>{t.submitReportBtn}</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 leading-tight">
              By submitting, your report will be queued for review. In critical situations, also call 112 directly.
            </div>
          </div>
        )}

        {/* Navigation Buttons (Back & Continue) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 && (
            <button
              type="button"
              onClick={() => {
                if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition ml-auto"
            >
              <span>{t.nextStepBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
