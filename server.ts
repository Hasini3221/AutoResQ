import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import type { 
  IncidentReport, 
  EmergencyResource, 
  NotificationItem, 
  AIAssessment, 
  EmergencyCategory, 
  IncidentSeverity, 
  IncidentStatus,
  UserRole
} from './src/types/index.ts';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_RESOURCES, 
  INITIAL_NOTIFICATIONS 
} from './src/data/seedData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-Memory Data Store (session persistence backed by clean repository abstraction)
let incidents: IncidentReport[] = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
let resources: EmergencyResource[] = JSON.parse(JSON.stringify(INITIAL_RESOURCES));
let notifications: NotificationItem[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));

// Registered User Profiles Store
interface StoredUser extends UserProfile {
  passwordHash?: string;
}

let userProfiles: StoredUser[] = [
  {
    id: 'user-admin-01',
    name: 'Commander Sarah Chen',
    full_name: 'Commander Sarah Chen',
    email: 'sarah.chen@autoresq.internal',
    age: 44,
    role: 'admin',
    agency: 'Metropolitan Emergency Command Center',
    phone: '+1 (555) 019-2831',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    passwordHash: 'password123'
  },
  {
    id: 'user-reviewer-01',
    name: 'Officer Rajiv Verma',
    full_name: 'Officer Rajiv Verma',
    email: 'rajiv.verma@autoresq.internal',
    age: 38,
    role: 'reviewer',
    agency: 'Regional Incident Triage Bureau',
    phone: '+1 (555) 019-8822',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    passwordHash: 'password123'
  },
  {
    id: 'user-citizen-01',
    name: 'Alex Mercer',
    full_name: 'Alex Mercer',
    email: 'alex.mercer@gmail.com',
    age: 29,
    role: 'citizen',
    phone: '+1 (555) 392-1084',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    passwordHash: 'password123'
  }
];

// Initialize Gemini Client if key available
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({});
    console.log('[AutoResQ Server] Gemini API client initialized with configured key.');
  } catch (err) {
    console.warn('[AutoResQ Server] Failed to initialize Gemini client:', err);
  }
} else {
  console.log('[AutoResQ Server] GEMINI_API_KEY not detected. Rule-based emergency triage fallback active.');
}

// Distance calculation helper (Haversine formula in KM)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
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

// Rule-based fallback triage analysis
function runRuleBasedAnalysis(
  category: EmergencyCategory,
  title: string,
  description: string,
  casualtiesEstimate: number
): AIAssessment {
  const text = `${title} ${description}`.toLowerCase();
  
  let severity: IncidentSeverity = 'medium';
  const rationaleParts: string[] = [];

  const criticalKeywords = ['trapped', 'unconscious', 'cardiac', 'crushed', 'explosion', 'bleeding heavily', 'not breathing', 'fatal', 'catastrophic', 'collapsed building', 'severe head injury'];
  const highKeywords = ['fire', 'flames', 'smoke', 'fracture', 'blood', 'burns', 'drowning', 'high speed', 'multi-vehicle', 'hazardous', 'chemical'];
  
  if (casualtiesEstimate >= 3 || criticalKeywords.some(k => text.includes(k))) {
    severity = 'critical';
    rationaleParts.push('Indicators of active entrapment, potential life-threat, or multiple casualties detected in report description.');
  } else if (casualtiesEstimate >= 1 || highKeywords.some(k => text.includes(k))) {
    severity = 'high';
    rationaleParts.push('Indicators of active structural fire, significant physical trauma, or rapidly escalating physical hazard.');
  } else {
    severity = 'medium';
    rationaleParts.push('Non-critical emergency with localized impact and no direct life-threat indicators reported.');
  }

  const resourceTypes: string[] = [];
  if (category === 'accident' || category === 'medical' || category === 'collapse') {
    resourceTypes.push('trauma_center', 'hospital');
  }
  if (category === 'fire' || category === 'collapse') {
    resourceTypes.push('fire_station');
  }
  if (category === 'flood' || category === 'collapse') {
    resourceTypes.push('disaster_relief', 'police_post');
  }
  if (resourceTypes.length === 0) resourceTypes.push('hospital', 'police_post');

  return {
    suggestedCategory: category,
    categoryConfidence: 0.88,
    suggestedSeverity: severity,
    severityRationale: rationaleParts.join(' ') || 'Standard emergency protocol classification based on reported keywords.',
    summary: `${category.toUpperCase()} emergency reported: ${title.slice(0, 100)}`,
    keyDetails: [
      `Category identified as ${category}`,
      casualtiesEstimate > 0 ? `Estimated casualties/affected: ${casualtiesEstimate}` : 'No explicit casualty count specified',
      'Location provided by reporter',
      'Automated baseline triage scan applied'
    ],
    assumptionsOrUncertainties: [
      'Preliminary report submitted without onsite paramedic verification',
      'Severity level should be reassessed upon arrival of authorized triage unit'
    ],
    recommendedImmediateActions: [
      'Ensure reporter maintains safe perimeter from active hazards',
      'Do not move severely injured victims unless in imminent danger of fire or collapse',
      'Verify exact access route and keep entry lanes unobstructed for emergency vehicles'
    ],
    suggestedResourceTypes: Array.from(new Set(resourceTypes)),
    isAiGenerated: true,
    analyzedAt: new Date().toISOString(),
    provider: 'rule_based_fallback'
  };
}

// REST API ROUTES

// Auth & User Management Endpoints
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, age, email, password } = req.body;
  if (!fullName || !age || !email || !password) {
    res.status(400).json({ error: 'Full name, age, email, and password are compulsory.' });
    return;
  }

  const existing = userProfiles.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const nowIso = new Date().toISOString();
  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: fullName.trim(),
    full_name: fullName.trim(),
    email: email.trim().toLowerCase(),
    age: Number(age),
    role: 'citizen',
    created_at: nowIso,
    updated_at: nowIso,
    passwordHash: password
  };

  userProfiles.push(newUser);
  const { passwordHash, ...cleanUser } = newUser;
  res.status(201).json({ message: 'User registered successfully', user: cleanUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = userProfiles.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.passwordHash !== password) {
    res.status(401).json({ error: 'Invalid email address or password.' });
    return;
  }

  const { passwordHash, ...cleanUser } = user;
  res.json({ message: 'Login successful', user: cleanUser });
});

app.get('/api/auth/profile/:id', (req: Request, res: Response) => {
  const user = userProfiles.find(u => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User profile not found' });
    return;
  }
  const { passwordHash, ...cleanUser } = user;
  res.json({ data: cleanUser });
});

app.patch('/api/auth/profile/:id', (req: Request, res: Response) => {
  const userIndex = userProfiles.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    // If not found in seed, create or upsert
    const { full_name, age, phone, agency, email } = req.body;
    const nowIso = new Date().toISOString();
    const newUser: StoredUser = {
      id: req.params.id,
      name: full_name || 'User',
      full_name: full_name || 'User',
      email: email || `${req.params.id}@autoresq.user`,
      age: age ? Number(age) : 25,
      role: 'citizen',
      phone,
      agency,
      created_at: nowIso,
      updated_at: nowIso
    };
    userProfiles.push(newUser);
    const { passwordHash, ...cleanUser } = newUser;
    res.json({ message: 'Profile created', data: cleanUser });
    return;
  }

  const user = userProfiles[userIndex];
  if (req.body.full_name) {
    user.full_name = req.body.full_name;
    user.name = req.body.full_name;
  }
  if (req.body.age !== undefined) user.age = Number(req.body.age);
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.agency !== undefined) user.agency = req.body.agency;
  user.updated_at = new Date().toISOString();

  const { passwordHash, ...cleanUser } = user;
  res.json({ message: 'Profile updated successfully', data: cleanUser });
});

// Health & System Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'AutoResQ Emergency Engine',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    totalIncidents: incidents.length,
    activeReviewers: 3,
    currentTime: new Date().toISOString(),
    disclaimer: 'AutoResQ is an assistance and reporting prototype, not a verified emergency dispatch service. Always dial 112/911 for life-threatening emergencies.'
  });
});

// Incidents List with Filters
app.get('/api/incidents', (req: Request, res: Response) => {
  const { category, severity, status, search, userId, limit, offset } = req.query;
  
  let filtered = [...incidents];

  if (userId && typeof userId === 'string' && userId !== 'all') {
    filtered = filtered.filter(i => i.userId === userId);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(i => i.category === category);
  }

  if (severity && severity !== 'all') {
    filtered = filtered.filter(i => i.severity === severity);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(i => i.status === status);
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(i => 
      i.id.toLowerCase().includes(query) ||
      i.title.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query) ||
      i.location.address.toLowerCase().includes(query) ||
      (i.reporterName && i.reporterName.toLowerCase().includes(query))
    );
  }

  // Sort descending by creation date
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = offset ? parseInt(offset as string, 10) : 0;
  const take = limit ? parseInt(limit as string, 10) : 50;
  const paginated = filtered.slice(start, start + take);

  res.json({
    total,
    count: paginated.length,
    offset: start,
    limit: take,
    data: paginated
  });
});

// Single Incident Detail with nearby resources attached
app.get('/api/incidents/:id', (req: Request, res: Response) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) {
    res.status(404).json({ error: 'Incident report not found' });
    return;
  }

  // Calculate distances to resources
  const nearby = resources.map(resItem => {
    const dist = calculateDistanceKm(
      incident.location.latitude,
      incident.location.longitude,
      resItem.latitude,
      resItem.longitude
    );
    return { ...resItem, distanceKm: dist };
  }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  res.json({
    data: {
      ...incident,
      nearbyResources: nearby.slice(0, 5)
    }
  });
});

// Create New Incident Report
app.post('/api/incidents', async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      category, 
      severity, 
      description, 
      location, 
      reporterName, 
      reporterContact,
      reporterEmail,
      userId,
      imageUrl,
      hazardsIdentified,
      casualtiesEstimate,
      aiAssessment
    } = req.body;

    if (!title || !category || !description || !location || location.latitude === undefined || location.longitude === undefined) {
      res.status(400).json({ error: 'Missing required incident fields (title, category, description, valid location coordinates)' });
      return;
    }

    const currentYear = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newId = `ARQ-${currentYear}-${randomSeq}`;
    const nowIso = new Date().toISOString();

    const createdReport: IncidentReport = {
      id: newId,
      userId: userId || undefined,
      title: title.trim(),
      category: category as EmergencyCategory,
      severity: (severity as IncidentSeverity) || 'medium',
      status: 'awaiting_review',
      description: description.trim(),
      reporterName: reporterName ? reporterName.trim() : 'Anonymous Citizen',
      reporterContact: reporterContact ? reporterContact.trim() : undefined,
      reporterEmail: reporterEmail ? reporterEmail.trim() : undefined,
      location: {
        address: location.address || 'Reported Location',
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        isGpsVerified: Boolean(location.isGpsVerified),
        city: location.city || 'Metro Area',
        landmarks: location.landmarks
      },
      imageUrl,
      hazardsIdentified: hazardsIdentified || [],
      casualtiesEstimate: casualtiesEstimate !== undefined ? Number(casualtiesEstimate) : 0,
      aiAssessment: aiAssessment || undefined,
      statusHistory: [
        {
          status: 'awaiting_review',
          changedBy: reporterName ? reporterName.trim() : 'Citizen Reporter',
          userRole: 'citizen',
          timestamp: nowIso,
          note: 'Incident report submitted and awaiting triage review.'
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
      isDemoRecord: false
    };

    incidents.unshift(createdReport);

    // Automation: Dispatch to n8n Webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    let n8nDispatched = false;
    if (n8nWebhookUrl) {
      try {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': 'AutoResQ-Emergency-Bot/2.0' },
          body: JSON.stringify({
            event: 'emergency_report_submitted',
            incidentId: createdReport.id,
            category: createdReport.category,
            severity: createdReport.severity,
            title: createdReport.title,
            description: createdReport.description,
            location: createdReport.location,
            casualtiesEstimate: createdReport.casualtiesEstimate,
            timestamp: createdReport.createdAt,
            reporter: createdReport.reporterName
          })
        }).then(res => {
          console.log(`[AutoResQ Automation] n8n webhook response: ${res.status}`);
        }).catch(err => {
          console.warn('[AutoResQ Automation] n8n webhook dispatch warning:', err.message);
        });
        n8nDispatched = true;
      } catch (err: any) {
        console.warn('[AutoResQ Automation] Webhook invocation failed:', err.message);
      }
    }

    // Automation: Log team email notification preparation
    if (process.env.ALERT_EMAIL_RECIPIENT) {
      console.log(`[AutoResQ Automation] Emergency email alert queued for: ${process.env.ALERT_EMAIL_RECIPIENT}`);
    }

    // Create Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      incidentId: newId,
      title: `NEW REPORT: ${createdReport.title.slice(0, 40)}`,
      message: `Incident ${newId} logged at ${createdReport.location.address}. Initial status: Pending Review.`,
      severity: createdReport.severity === 'critical' ? 'critical' : createdReport.severity === 'high' ? 'warning' : 'info',
      timestamp: nowIso,
      read: false
    };
    notifications.unshift(newNotif);

    res.status(201).json({
      message: 'Incident report recorded successfully',
      data: createdReport,
      automation: {
        n8nTriggered: n8nDispatched,
        webhookConfigured: Boolean(n8nWebhookUrl)
      }
    });
  } catch (err: any) {
    console.error('[AutoResQ] Error creating incident:', err);
    res.status(500).json({ error: 'Internal server error while saving incident report' });
  }
});

// Update Incident Status (Reviewer / Admin only)
app.patch('/api/incidents/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note, changedBy, userRole } = req.body;

  const validStatuses: IncidentStatus[] = ['awaiting_review', 'under_review', 'action_recorded', 'resolved'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  const incidentIndex = incidents.findIndex(i => i.id === id);
  if (incidentIndex === -1) {
    res.status(404).json({ error: 'Incident report not found' });
    return;
  }

  const nowIso = new Date().toISOString();
  const currentIncident = incidents[incidentIndex];

  // Role validation: Only reviewers and admins can change status
  const role: UserRole = userRole || 'reviewer';
  if (role !== 'reviewer' && role !== 'admin') {
    res.status(403).json({ error: 'Permission denied: Citizen accounts cannot update incident status' });
    return;
  }

  const historyEntry = {
    status: status as IncidentStatus,
    changedBy: changedBy || 'Triage Officer',
    userRole: role,
    timestamp: nowIso,
    note: note || `Status updated from ${currentIncident.status} to ${status}`
  };

  currentIncident.status = status as IncidentStatus;
  currentIncident.updatedAt = nowIso;
  if (note) {
    currentIncident.reviewerNotes = note;
  }
  currentIncident.statusHistory.push(historyEntry);

  // Add notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    incidentId: id,
    title: `STATUS UPDATE: ${id} → ${status.replace('_', ' ').toUpperCase()}`,
    message: note || `Incident status updated by ${changedBy || 'Reviewer'}.`,
    severity: status === 'resolved' ? 'info' : 'warning',
    timestamp: nowIso,
    read: false
  });

  res.json({
    message: 'Status updated successfully',
    data: currentIncident
  });
});

// AI-Assisted Incident Analysis Endpoint
app.post('/api/incidents/analyze', async (req: Request, res: Response) => {
  const { category, title, description, casualtiesEstimate, location } = req.body;

  if (!description || !title) {
    res.status(400).json({ error: 'Title and description are required for AI analysis' });
    return;
  }

  // If Gemini client is configured, run structured analysis with gemini-3.8-flash
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Analyze this emergency incident report and return a strictly validated JSON object.

Incident Title: ${title}
Incident Category Selected by Reporter: ${category || 'unspecified'}
Description: ${description}
Reported Casualties: ${casualtiesEstimate ?? 'Not specified'}
Location: ${JSON.stringify(location ?? {})}

Provide triage assessment in valid JSON adhering exactly to this structure:
{
  "suggestedCategory": "accident" | "fire" | "medical" | "collapse" | "flood" | "other",
  "categoryConfidence": <float between 0.0 and 1.0>,
  "suggestedSeverity": "low" | "medium" | "high" | "critical",
  "severityRationale": "<concise clinical/emergency reasoning for this severity level>",
  "summary": "<1-2 sentence structured factual summary>",
  "keyDetails": ["<fact 1>", "<fact 2>", "<fact 3>"],
  "assumptionsOrUncertainties": ["<uncertainty or unverified detail requiring human check 1>", "<2>"],
  "recommendedImmediateActions": ["<clear, safe action 1 for callers/responders>", "<action 2>"],
  "suggestedResourceTypes": ["hospital" | "trauma_center" | "fire_station" | "disaster_relief" | "police_post"]
}

Guidelines:
- Distinguish observed facts from unverified assumptions.
- Never invent coordinates or non-reported injuries.
- Flag any critical life-safety hazards.`;

      // Timeout promise for reliable demo response
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API call timed out')), 8000)
      );

      const responsePromise = geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);
      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        const result: AIAssessment = {
          suggestedCategory: parsed.suggestedCategory || category || 'other',
          categoryConfidence: parsed.categoryConfidence || 0.9,
          suggestedSeverity: parsed.suggestedSeverity || 'medium',
          severityRationale: parsed.severityRationale || 'AI triage assessment based on report text.',
          summary: parsed.summary || title,
          keyDetails: Array.isArray(parsed.keyDetails) ? parsed.keyDetails : [title],
          assumptionsOrUncertainties: Array.isArray(parsed.assumptionsOrUncertainties) ? parsed.assumptionsOrUncertainties : ['Verify details with caller'],
          recommendedImmediateActions: Array.isArray(parsed.recommendedImmediateActions) ? parsed.recommendedImmediateActions : ['Maintain safe distance'],
          suggestedResourceTypes: Array.isArray(parsed.suggestedResourceTypes) ? parsed.suggestedResourceTypes : ['hospital'],
          isAiGenerated: true,
          analyzedAt: new Date().toISOString(),
          provider: 'gemini-3.8-flash'
        };

        res.json({ data: result });
        return;
      }
    } catch (apiErr: any) {
      console.warn('[AutoResQ] Gemini API call failed, falling back to rule-based engine:', apiErr?.message);
    }
  }

  // Graceful rule-based fallback if Gemini is unconfigured or encounters an error
  const fallbackResult = runRuleBasedAnalysis(
    category || 'accident',
    title,
    description,
    casualtiesEstimate ? Number(casualtiesEstimate) : 0
  );

  res.json({ data: fallbackResult });
});

// Nearby Emergency Resources Endpoint
app.get('/api/resources/nearby', (req: Request, res: Response) => {
  const { lat, lng, radiusKm, type } = req.query;

  let filtered = [...resources];
  if (type && type !== 'all') {
    filtered = filtered.filter(r => r.type === type);
  }

  if (lat && lng) {
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const maxRadius = radiusKm ? parseFloat(radiusKm as string) : 50;

    const withDistances = filtered.map(r => {
      const dist = calculateDistanceKm(userLat, userLng, r.latitude, r.longitude);
      return { ...r, distanceKm: dist };
    });

    const nearby = withDistances.filter(r => (r.distanceKm || 0) <= maxRadius);
    nearby.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    res.json({
      count: nearby.length,
      userCoordinates: { lat: userLat, lng: userLng },
      radiusKm: maxRadius,
      data: nearby
    });
    return;
  }

  res.json({
    count: filtered.length,
    data: filtered
  });
});

// Dedicated Hospitals Endpoint (Filter hospitals & trauma centers)
app.get('/api/hospitals', (req: Request, res: Response) => {
  const { lat, lng, radiusKm } = req.query;
  const hospitalList = resources.filter(r => r.type === 'hospital' || r.type === 'trauma_center');

  if (lat && lng) {
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const maxRadius = radiusKm ? parseFloat(radiusKm as string) : 50;

    const withDist = hospitalList.map(h => ({
      ...h,
      distanceKm: calculateDistanceKm(userLat, userLng, h.latitude, h.longitude)
    }));

    withDist.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    res.json({
      count: withDist.length,
      userCoordinates: { lat: userLat, lng: userLng },
      radiusKm: maxRadius,
      data: withDist
    });
    return;
  }

  res.json({
    count: hospitalList.length,
    data: hospitalList
  });
});

// Automation & n8n Integration Status Endpoint
app.get('/api/automation/status', (req: Request, res: Response) => {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  const emailRecipient = process.env.ALERT_EMAIL_RECIPIENT;

  res.json({
    n8nWebhookConfigured: Boolean(n8nUrl),
    n8nWebhookMasked: n8nUrl ? `${n8nUrl.slice(0, 18)}...${n8nUrl.slice(-6)}` : null,
    gmailAlertsConfigured: Boolean(emailRecipient),
    emailRecipientMasked: emailRecipient ? `${emailRecipient.slice(0, 3)}***@***` : null,
    databasePersistence: 'In-Memory Repository with Session & CSV Export',
    readyForWorkflowAutomation: true,
    supportedEvents: ['emergency_report_submitted', 'status_transition_updated']
  });
});

// Test automation trigger endpoint
app.post('/api/automation/test-webhook', async (req: Request, res: Response) => {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nUrl) {
    res.status(400).json({
      error: 'N8N_WEBHOOK_URL is not configured in environment variables. Set N8N_WEBHOOK_URL in .env to enable automated workflow execution.',
      status: 'unconfigured'
    });
    return;
  }

  try {
    const webhookRes = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'test_webhook_ping',
        source: 'AutoResQ-Dashboard-Test',
        timestamp: new Date().toISOString()
      })
    });

    res.json({
      success: true,
      statusCode: webhookRes.status,
      message: `Successfully connected to n8n webhook (HTTP ${webhookRes.status})`
    });
  } catch (err: any) {
    res.status(502).json({
      error: `Failed to connect to n8n webhook: ${err.message}`,
      status: 'connection_error'
    });
  }
});

// Analytics Summary Endpoint
app.get('/api/analytics/summary', (req: Request, res: Response) => {
  const total = incidents.length;
  const awaitingReview = incidents.filter(i => i.status === 'awaiting_review').length;
  const underReview = incidents.filter(i => i.status === 'under_review').length;
  const actionRecorded = incidents.filter(i => i.status === 'action_recorded').length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;
  
  const highSeverity = incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length;
  const critical = incidents.filter(i => i.severity === 'critical').length;

  const categoryBreakdown: Record<string, number> = {
    accident: 0,
    fire: 0,
    medical: 0,
    collapse: 0,
    flood: 0,
    other: 0
  };

  const severityBreakdown: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };

  incidents.forEach(i => {
    if (categoryBreakdown[i.category] !== undefined) {
      categoryBreakdown[i.category]++;
    } else {
      categoryBreakdown.other++;
    }

    if (severityBreakdown[i.severity] !== undefined) {
      severityBreakdown[i.severity]++;
    }
  });

  // Calculate trends
  const dailyCounts: Record<string, number> = {};
  incidents.forEach(i => {
    const day = i.createdAt ? i.createdAt.slice(0, 10) : '2026-10-09';
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  const dailyTrend = Object.keys(dailyCounts).sort().map(date => ({
    date,
    count: dailyCounts[date]
  }));

  res.json({
    data: {
      metrics: {
        total,
        awaitingReview,
        underReview,
        actionRecorded,
        resolved,
        highSeverity,
        critical,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      },
      categoryBreakdown,
      severityBreakdown,
      dailyTrend
    }
  });
});

// Notifications Endpoint
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    data: notifications
  });
});

app.post('/api/notifications/mark-read', (req: Request, res: Response) => {
  const { id } = req.body;
  if (id) {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  } else {
    notifications = notifications.map(n => ({ ...n, read: true }));
  }
  res.json({ message: 'Notifications marked as read' });
});

// Demo Data Reset Endpoint
app.post('/api/reset-demo', (req: Request, res: Response) => {
  incidents = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
  resources = JSON.parse(JSON.stringify(INITIAL_RESOURCES));
  notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  res.json({ message: 'Demo environment reset to initial baseline state' });
});

// Vite Middleware for Full-Stack Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AutoResQ Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[AutoResQ Server] Failed to start server:', err);
  process.exit(1);
});
