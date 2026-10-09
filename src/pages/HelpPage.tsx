import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  PhoneCall, 
  ShieldAlert, 
  Radio, 
  Building2, 
  Workflow, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Zap, 
  Server,
  Database,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  const [automationStatus, setAutomationStatus] = useState<any | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/automation/status')
      .then(res => res.json())
      .then(data => setAutomationStatus(data))
      .catch(() => {});
  }, []);

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/automation/test-webhook', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'n8n webhook URL is not configured yet in environment.'
        });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: 'Could not connect to automation endpoint.' });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Emergency Help & Instructions
        </h1>
        <p className="text-slate-600 text-sm">
          Clear guidance for emergency situations and automation integration instructions.
        </p>
      </div>

      {/* 1. Official National Helplines Directory */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Official National Emergency Numbers (Direct Call)
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          In any life-threatening situation, always contact these verified toll-free emergency helplines immediately:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="tel:112"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition text-center space-y-1 block group"
          >
            <span className="text-xs font-bold text-rose-700 uppercase">National SOS</span>
            <div className="text-2xl font-black text-rose-600 font-mono group-hover:scale-105 transition-transform">112</div>
            <span className="text-[11px] text-slate-500 block">Unified All-In-One</span>
          </a>

          <a
            href="tel:108"
            className="p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition text-center space-y-1 block group"
          >
            <span className="text-xs font-bold text-blue-700 uppercase">Ambulance</span>
            <div className="text-2xl font-black text-blue-600 font-mono group-hover:scale-105 transition-transform">108 / 102</div>
            <span className="text-[11px] text-slate-500 block">Medical Emergency</span>
          </a>

          <a
            href="tel:101"
            className="p-4 rounded-2xl bg-orange-50 border border-orange-200 hover:bg-orange-100 transition text-center space-y-1 block group"
          >
            <span className="text-xs font-bold text-orange-700 uppercase">Fire Control</span>
            <div className="text-2xl font-black text-orange-600 font-mono group-hover:scale-105 transition-transform">101</div>
            <span className="text-[11px] text-slate-500 block">Fire & Rescue</span>
          </a>

          <a
            href="tel:100"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-center space-y-1 block group"
          >
            <span className="text-xs font-bold text-slate-700 uppercase">Police</span>
            <div className="text-2xl font-black text-slate-800 font-mono group-hover:scale-105 transition-transform">100</div>
            <span className="text-[11px] text-slate-500 block">Law Enforcement</span>
          </a>
        </div>
      </div>

      {/* 2. How to Report in Under 1 Minute */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          How to File an Incident in Under 1 Minute
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-rose-600 text-xs font-mono">STEP 1</span>
            <h3 className="font-bold text-slate-900">Tap Emergency Type</h3>
            <p className="text-xs text-slate-600">Select Road Accident, Medical, Fire, or Other with one click.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-rose-600 text-xs font-mono">STEP 2</span>
            <h3 className="font-bold text-slate-900">Share Brief Details</h3>
            <p className="text-xs text-slate-600">Describe what you observe, count of people in danger, and scene photo if safe.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-rose-600 text-xs font-mono">STEP 3</span>
            <h3 className="font-bold text-slate-900">One-Tap GPS Location</h3>
            <p className="text-xs text-slate-600">Press "Use My Current Location" to detect coordinates, or type the nearest landmark.</p>
          </div>
        </div>
      </div>

      {/* 3. Automation Integration (n8n Webhook & Backend API) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Workflow Automation Integration (n8n & Webhooks)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          AutoResQ is built to securely trigger automated external workflows via <strong>n8n webhooks</strong> upon every emergency submission.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-600 font-medium">n8n Webhook Endpoint Integration:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold ${
              automationStatus?.n8nWebhookConfigured
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {automationStatus?.n8nWebhookConfigured ? 'CONNECTED' : 'STANDBY (Configurable via N8N_WEBHOOK_URL)'}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-600 font-medium">Server API Proxy:</span>
            <span className="font-mono text-slate-800">POST /api/incidents</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-600 font-medium">Database Repository:</span>
            <span className="font-mono text-slate-800">In-Memory Audit Ledger with CSV & Session Sync</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Supported Automated Events:</span>
            <span className="font-mono text-slate-800">emergency_report_submitted, status_updated</span>
          </div>
        </div>

        {/* Test Webhook Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestWebhook}
            disabled={testingWebhook}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
          >
            <Zap className={`w-4 h-4 text-amber-400 ${testingWebhook ? 'animate-bounce' : ''}`} />
            <span>{testingWebhook ? 'Testing Webhook...' : 'Test n8n Webhook Ping'}</span>
          </button>

          <span className="text-[11px] text-slate-500">
            Set <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">N8N_WEBHOOK_URL</code> in <code className="font-mono">.env</code> to route alerts to n8n.
          </span>
        </div>

        {testResult && (
          <div className={`p-3 rounded-xl text-xs font-medium ${
            testResult.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {testResult.message}
          </div>
        )}
      </div>

      {/* 4. Supabase Auth & PostgreSQL Database Integration Guide */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Backend Database & Supabase Authentication
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          AutoResQ supports full integration with <strong>Supabase Auth & Supabase PostgreSQL</strong> for persistent user profiles, incident tracking, and Row Level Security (RLS).
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-600 font-medium">Supabase Profiles Table:</span>
            <span className="font-mono text-emerald-700 font-bold">public.profiles (id, full_name, age, email, role, created_at, updated_at)</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-600 font-medium">Incidents Association:</span>
            <span className="font-mono text-slate-800 font-bold">public.incidents (id, user_id references profiles(id))</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-600 font-medium">Authentication Providers:</span>
            <span className="text-slate-800 font-bold">Google OAuth 2.0 & Email/Password with Verification</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">PostgreSQL Migration DDL:</span>
            <span className="font-mono text-slate-700">Available in <code className="bg-slate-200 px-1 py-0.5 rounded">/supabase_schema.sql</code></span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
        <span>
          AutoResQ is an automated reporting prototype. It does not automatically dispatch municipal ambulances unless integrated with verified emergency PSAP dispatch centers.
        </span>
      </div>

    </div>
  );
};
