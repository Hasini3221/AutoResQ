export type EmergencyCategory = 
  | 'accident'
  | 'fire'
  | 'medical'
  | 'collapse'
  | 'flood'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 
  | 'awaiting_review'
  | 'under_review'
  | 'action_recorded'
  | 'resolved';

export type UserRole = 'citizen' | 'reviewer' | 'admin';

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  isGpsVerified: boolean;
  city?: string;
  landmarks?: string;
}

export interface AIAssessment {
  suggestedCategory: EmergencyCategory;
  categoryConfidence: number; // 0-1
  suggestedSeverity: IncidentSeverity;
  severityRationale: string;
  summary: string;
  keyDetails: string[];
  assumptionsOrUncertainties: string[];
  recommendedImmediateActions: string[];
  suggestedResourceTypes: string[];
  isAiGenerated: boolean;
  analyzedAt: string;
  provider: 'gemini-3.8-flash' | 'rule_based_fallback';
}

export interface StatusHistoryEntry {
  status: IncidentStatus;
  changedBy: string;
  userRole: UserRole;
  timestamp: string;
  note: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: 'hospital' | 'trauma_center' | 'fire_station' | 'disaster_relief' | 'police_post';
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  is24x7: boolean;
  verificationStatus: 'verified_directory' | 'demo_record';
  capabilities: string[];
}

export interface IncidentReport {
  id: string; // e.g. ARQ-2026-1042
  userId?: string; // Associated authenticated user
  title: string;
  category: EmergencyCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  reporterName?: string;
  reporterContact?: string;
  reporterEmail?: string;
  location: LocationData;
  imageUrl?: string;
  hazardsIdentified?: string[];
  casualtiesEstimate?: number;
  aiAssessment?: AIAssessment;
  nearbyResources?: EmergencyResource[];
  statusHistory: StatusHistoryEntry[];
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
  isDemoRecord: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  age?: number;
  role: UserRole;
  agency?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  provider?: 'email' | 'google' | 'demo';
}

export interface NotificationItem {
  id: string;
  incidentId?: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
}
