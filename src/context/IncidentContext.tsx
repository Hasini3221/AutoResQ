import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  IncidentReport, 
  EmergencyResource, 
  NotificationItem, 
  AIAssessment, 
  IncidentStatus, 
  EmergencyCategory, 
  IncidentSeverity 
} from '../types';
import { INITIAL_INCIDENTS, INITIAL_RESOURCES, INITIAL_NOTIFICATIONS } from '../data/seedData';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface MetricsSummary {
  total: number;
  awaitingReview: number;
  underReview: number;
  actionRecorded: number;
  resolved: number;
  highSeverity: number;
  critical: number;
  resolutionRate: number;
}

interface IncidentContextType {
  incidents: IncidentReport[];
  resources: EmergencyResource[];
  notifications: NotificationItem[];
  metrics: MetricsSummary;
  categoryBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
  dailyTrend: { date: string; count: number }[];
  systemStatus: {
    operational: boolean;
    geminiConfigured: boolean;
    serviceName: string;
  };
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getIncidentById: (id: string) => Promise<IncidentReport | null>;
  createIncident: (report: Partial<IncidentReport>) => Promise<IncidentReport>;
  updateIncidentStatus: (id: string, status: IncidentStatus, note: string) => Promise<IncidentReport>;
  analyzeWithAI: (data: { category?: string; title: string; description: string; casualtiesEstimate?: number; location?: any }) => Promise<AIAssessment>;
  markNotificationsAsRead: (id?: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [resources, setResources] = useState<EmergencyResource[]>(INITIAL_RESOURCES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<MetricsSummary>({
    total: INITIAL_INCIDENTS.length,
    awaitingReview: INITIAL_INCIDENTS.filter(i => i.status === 'awaiting_review').length,
    underReview: INITIAL_INCIDENTS.filter(i => i.status === 'under_review').length,
    actionRecorded: INITIAL_INCIDENTS.filter(i => i.status === 'action_recorded').length,
    resolved: INITIAL_INCIDENTS.filter(i => i.status === 'resolved').length,
    highSeverity: INITIAL_INCIDENTS.filter(i => i.severity === 'high' || i.severity === 'critical').length,
    critical: INITIAL_INCIDENTS.filter(i => i.severity === 'critical').length,
    resolutionRate: 33
  });

  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});
  const [severityBreakdown, setSeverityBreakdown] = useState<Record<string, number>>({});
  const [dailyTrend, setDailyTrend] = useState<{ date: string; count: number }[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    operational: true,
    geminiConfigured: true,
    serviceName: 'AutoResQ Command Engine'
  });

  const calculateLocalMetrics = useCallback((list: IncidentReport[]) => {
    const total = list.length;
    const awaitingReview = list.filter(i => i.status === 'awaiting_review').length;
    const underReview = list.filter(i => i.status === 'under_review').length;
    const actionRecorded = list.filter(i => i.status === 'action_recorded').length;
    const resolved = list.filter(i => i.status === 'resolved').length;
    const highSeverity = list.filter(i => i.severity === 'high' || i.severity === 'critical').length;
    const critical = list.filter(i => i.severity === 'critical').length;

    setMetrics({
      total,
      awaitingReview,
      underReview,
      actionRecorded,
      resolved,
      highSeverity,
      critical,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
    });

    const catCounts: Record<string, number> = {
      accident: 0,
      fire: 0,
      medical: 0,
      collapse: 0,
      flood: 0,
      other: 0
    };
    const sevCounts: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    list.forEach(i => {
      if (catCounts[i.category] !== undefined) catCounts[i.category]++;
      else catCounts.other++;

      if (sevCounts[i.severity] !== undefined) sevCounts[i.severity]++;
    });
    setCategoryBreakdown(catCounts);
    setSeverityBreakdown(sevCounts);

    const dateCounts: Record<string, number> = {};
    list.forEach(i => {
      const d = i.createdAt ? i.createdAt.slice(0, 10) : '2026-10-09';
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    });
    setDailyTrend(Object.keys(dateCounts).sort().map(d => ({ date: d, count: dateCounts[d] })));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check system health
      fetch('/api/health')
        .then(r => r.json())
        .then(h => {
          setSystemStatus({
            operational: h.status === 'operational',
            geminiConfigured: !!h.geminiConfigured,
            serviceName: h.service || 'AutoResQ Command Engine'
          });
        })
        .catch(() => {});

      // Fetch incidents
      const res = await fetch('/api/incidents?limit=100');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setIncidents(json.data);
          calculateLocalMetrics(json.data);
        }
      }

      // Fetch resources
      const resResources = await fetch('/api/resources/nearby');
      if (resResources.ok) {
        const rJson = await resResources.json();
        if (rJson.data) setResources(rJson.data);
      }

      // Fetch notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const nJson = await notifRes.json();
        if (nJson.data) setNotifications(nJson.data);
      }

      setError(null);
    } catch (err: any) {
      console.warn('Backend API refresh error, using local state:', err);
      calculateLocalMetrics(incidents);
    } finally {
      setIsLoading(false);
    }
  }, [calculateLocalMetrics, incidents]);

  useEffect(() => {
    refreshData();
  }, []);

  const getIncidentById = async (id: string): Promise<IncidentReport | null> => {
    try {
      const res = await fetch(`/api/incidents/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Falling back to local cache for incident:', id);
    }
    const local = incidents.find(i => i.id === id);
    return local || null;
  };

  const createIncident = async (reportData: Partial<IncidentReport>): Promise<IncidentReport> => {
    const payload = {
      ...reportData,
      userId: user?.id,
      reporterName: reportData.reporterName || user?.full_name || user?.name || 'Citizen Reporter',
      reporterEmail: user?.email,
      reporterContact: reportData.reporterContact || user?.phone
    };

    // If Supabase is active, also persist to PostgreSQL incidents table
    if (isSupabaseConfigured && supabase) {
      try {
        const id = `ARQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const nowIso = new Date().toISOString();
        const record = {
          id,
          user_id: user?.id || null,
          title: payload.title || 'Emergency Report',
          category: payload.category || 'accident',
          severity: payload.severity || 'medium',
          status: 'awaiting_review',
          description: payload.description || '',
          reporter_name: payload.reporterName,
          reporter_contact: payload.reporterContact,
          reporter_email: payload.reporterEmail,
          location: payload.location,
          image_url: payload.imageUrl,
          hazards_identified: payload.hazardsIdentified || [],
          casualties_estimate: payload.casualtiesEstimate || 0,
          ai_assessment: payload.aiAssessment,
          status_history: [
            {
              status: 'awaiting_review',
              changedBy: payload.reporterName,
              userRole: user?.role || 'citizen',
              timestamp: nowIso,
              note: 'Report submitted and waiting triage review.'
            }
          ],
          created_at: nowIso,
          updated_at: nowIso,
          is_demo_record: false
        };

        const { data: dbData, error: dbErr } = await supabase
          .from('incidents')
          .insert(record)
          .select()
          .single();

        if (dbErr) {
          console.warn('[AutoResQ] Supabase incidents table insert error:', dbErr.message);
        } else if (dbData) {
          const reportObj: IncidentReport = {
            id: dbData.id,
            userId: dbData.user_id,
            title: dbData.title,
            category: dbData.category,
            severity: dbData.severity,
            status: dbData.status,
            description: dbData.description,
            reporterName: dbData.reporter_name,
            reporterContact: dbData.reporter_contact,
            reporterEmail: dbData.reporter_email,
            location: dbData.location,
            imageUrl: dbData.image_url,
            hazardsIdentified: dbData.hazards_identified,
            casualtiesEstimate: dbData.casualties_estimate,
            aiAssessment: dbData.ai_assessment,
            statusHistory: dbData.status_history || [],
            createdAt: dbData.created_at,
            updatedAt: dbData.updated_at,
            isDemoRecord: false
          };
          setIncidents(prev => [reportObj, ...prev]);
          calculateLocalMetrics([reportObj, ...incidents]);
          return reportObj;
        }
      } catch (sbErr) {
        console.warn('[AutoResQ] Supabase incident persist exception:', sbErr);
      }
    }

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        const created = json.data as IncidentReport;
        setIncidents(prev => [created, ...prev]);
        calculateLocalMetrics([created, ...incidents]);
        return created;
      }
    } catch (e) {
      console.warn('Server offline, creating locally in session state:', e);
    }

    // Local fallback
    const id = `ARQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const fallbackReport: IncidentReport = {
      id,
      userId: user?.id,
      title: reportData.title || 'Untitled Incident',
      category: reportData.category || 'accident',
      severity: reportData.severity || 'medium',
      status: 'awaiting_review',
      description: reportData.description || '',
      reporterName: payload.reporterName,
      reporterEmail: payload.reporterEmail,
      location: reportData.location || {
        address: 'Current Location',
        latitude: 17.4435,
        longitude: 78.3772,
        isGpsVerified: false
      },
      imageUrl: reportData.imageUrl,
      hazardsIdentified: reportData.hazardsIdentified || [],
      casualtiesEstimate: reportData.casualtiesEstimate || 0,
      aiAssessment: reportData.aiAssessment,
      statusHistory: [
        {
          status: 'awaiting_review',
          changedBy: payload.reporterName,
          userRole: user?.role || 'citizen',
          timestamp: nowIso,
          note: 'Incident report submitted and awaiting review.'
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
      isDemoRecord: false
    };

    setIncidents(prev => [fallbackReport, ...prev]);
    calculateLocalMetrics([fallbackReport, ...incidents]);
    return fallbackReport;
  };

  const updateIncidentStatus = async (
    id: string,
    status: IncidentStatus,
    note: string
  ): Promise<IncidentReport> => {
    try {
      const res = await fetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note,
          changedBy: user?.name || 'Authorized Reviewer',
          userRole: user?.role || 'reviewer'
        })
      });
      if (res.ok) {
        const json = await res.json();
        const updated = json.data as IncidentReport;
        setIncidents(prev => prev.map(i => i.id === id ? updated : i));
        calculateLocalMetrics(incidents.map(i => i.id === id ? updated : i));
        return updated;
      }
    } catch (e) {
      console.warn('Server status update failed, applying locally:', e);
    }

    // Local fallback update
    const nowIso = new Date().toISOString();
    let updatedReport: IncidentReport | null = null;
    setIncidents(prev => prev.map(i => {
      if (i.id === id) {
        const updated: IncidentReport = {
          ...i,
          status,
          reviewerNotes: note,
          updatedAt: nowIso,
          statusHistory: [
            ...i.statusHistory,
            {
              status,
              changedBy: user?.name || 'Authorized Reviewer',
              userRole: user?.role || 'reviewer',
              timestamp: nowIso,
              note
            }
          ]
        };
        updatedReport = updated;
        return updated;
      }
      return i;
    }));

    if (updatedReport) {
      calculateLocalMetrics(incidents);
      return updatedReport;
    }
    throw new Error('Incident not found');
  };

  const analyzeWithAI = async (data: {
    category?: string;
    title: string;
    description: string;
    casualtiesEstimate?: number;
    location?: any;
  }): Promise<AIAssessment> => {
    try {
      const res = await fetch('/api/incidents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      console.warn('Backend AI analyze error, using client-side fallback:', e);
    }

    // Fallback assessment if network unavailable
    return {
      suggestedCategory: (data.category as EmergencyCategory) || 'accident',
      categoryConfidence: 0.85,
      suggestedSeverity: (data.casualtiesEstimate && data.casualtiesEstimate > 2) ? 'critical' : 'high',
      severityRationale: 'Rule-based emergency heuristics applied based on report keywords and casualty count.',
      summary: `Emergency incident: ${data.title.slice(0, 90)}`,
      keyDetails: [
        'Report description analyzed',
        data.casualtiesEstimate ? `Reported casualties: ${data.casualtiesEstimate}` : 'Casualties unconfirmed',
        'Direct human review recommended'
      ],
      assumptionsOrUncertainties: ['Field conditions require onsite paramedic verification'],
      recommendedImmediateActions: [
        'Maintain safe distance from scene',
        'Keep approach roads clear for incoming responders'
      ],
      suggestedResourceTypes: ['hospital', 'trauma_center'],
      isAiGenerated: true,
      analyzedAt: new Date().toISOString(),
      provider: 'rule_based_fallback'
    };
  };

  const markNotificationsAsRead = async (id?: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {}

    setNotifications(prev =>
      prev.map(n => (!id || n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
    } catch (e) {}
    setIncidents(JSON.parse(JSON.stringify(INITIAL_INCIDENTS)));
    setResources(JSON.parse(JSON.stringify(INITIAL_RESOURCES)));
    setNotifications(JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)));
    calculateLocalMetrics(INITIAL_INCIDENTS);
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        resources,
        notifications,
        metrics,
        categoryBreakdown,
        severityBreakdown,
        dailyTrend,
        systemStatus,
        isLoading,
        error,
        refreshData,
        getIncidentById,
        createIncident,
        updateIncidentStatus,
        analyzeWithAI,
        markNotificationsAsRead,
        resetDemoData
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};
