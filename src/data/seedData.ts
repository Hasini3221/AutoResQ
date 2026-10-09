import type { IncidentReport, EmergencyResource, UserProfile, NotificationItem } from '../types/index.ts';

export const INITIAL_RESOURCES: EmergencyResource[] = [
  {
    id: 'res-hosp-01',
    name: 'City Apex Trauma & Multi-Specialty Hospital',
    type: 'trauma_center',
    address: '42 Central Health Corridor, Metro District',
    phone: '+1 (555) 911-0400',
    latitude: 17.4435,
    longitude: 78.3772,
    is24x7: true,
    verificationStatus: 'verified_directory',
    capabilities: ['Level 1 Trauma', '24/7 ICU', 'Blood Bank', 'Burn Unit']
  },
  {
    id: 'res-hosp-02',
    name: 'St. Jude Emergency & Surgical Center',
    type: 'hospital',
    address: '108 Westpark Boulevard, North Ward',
    phone: '+1 (555) 911-0422',
    latitude: 17.4520,
    longitude: 78.3610,
    is24x7: true,
    verificationStatus: 'verified_directory',
    capabilities: ['Emergency Care', 'Cardiac ICU', 'Pediatric Emergency']
  },
  {
    id: 'res-fire-01',
    name: 'Metropolitan Fire & HazMat Rescue Station 04',
    type: 'fire_station',
    address: '15 Industrial Ring Road, South Sector',
    phone: '+1 (555) 911-0101',
    latitude: 17.4310,
    longitude: 78.3890,
    is24x7: true,
    verificationStatus: 'verified_directory',
    capabilities: ['Chemical HazMat', 'Hydraulic Extrication', 'Thermal Drones']
  },
  {
    id: 'res-fire-02',
    name: 'Civic Central Fire Station Headquarters',
    type: 'fire_station',
    address: '88 Station Square, Downtown East',
    phone: '+1 (555) 911-0102',
    latitude: 17.4612,
    longitude: 78.3725,
    is24x7: true,
    verificationStatus: 'verified_directory',
    capabilities: ['High-Rise Ladder (54m)', 'Heavy Rescue Crane', 'Water Tenders']
  },
  {
    id: 'res-disaster-01',
    name: 'State Disaster Response & Flood Relief Depot',
    type: 'disaster_relief',
    address: 'Pier 9 Logistics Center, Riverside Park',
    phone: '+1 (555) 911-0808',
    latitude: 17.4205,
    longitude: 78.3580,
    is24x7: true,
    verificationStatus: 'verified_directory',
    capabilities: ['Inflatable Boats', 'Dewatering Pumps', 'Emergency Rations']
  },
  {
    id: 'res-hosp-03',
    name: 'Apollo Jubilee Emergency Department',
    type: 'hospital',
    address: '7 Road No. 36, Jubilee Hills',
    phone: '+1 (555) 911-0455',
    latitude: 17.4290,
    longitude: 78.4110,
    is24x7: true,
    verificationStatus: 'verified_directory',
    capabilities: ['Comprehensive Stroke Center', '24/7 CT Scan', 'Ambulance Base']
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'ARQ-2026-1042',
    title: 'Multi-Vehicle Collision with Oil Spill on Outer Expressway',
    category: 'accident',
    severity: 'critical',
    status: 'action_recorded',
    description: 'A heavy freight truck collided with two passenger sedans near Exit 14. One sedan is pinned beneath the barrier with fluid leaking onto the roadway. Two occupants appear trapped inside.',
    reporterName: 'Vikram Joshi (Commuter)',
    reporterContact: '+1 (555) 234-9811',
    location: {
      address: 'Outer Expressway, Kilometer Marker 44, Northbound',
      latitude: 17.4475,
      longitude: 78.3750,
      isGpsVerified: true,
      city: 'Hyderabad Metro',
      landmarks: 'Near Exit 14 Toll Plaza'
    },
    hazardsIdentified: ['Flammable fluid leak', 'Pinned occupants', 'High-speed traffic corridor'],
    casualtiesEstimate: 3,
    aiAssessment: {
      suggestedCategory: 'accident',
      categoryConfidence: 0.96,
      suggestedSeverity: 'critical',
      severityRationale: 'Multiple trapped passengers combined with liquid fuel leakage on an active expressway poses immediate life and explosion hazards.',
      summary: 'Critical multi-vehicle crash with suspected entrapment and hazardous fluid leak on a high-speed artery.',
      keyDetails: [
        'Freight truck and 2 passenger vehicles involved',
        'Suspected entrapment of 2 passengers',
        'Active flammable fluid leakage reported',
        'GPS-confirmed location near Exit 14'
      ],
      assumptionsOrUncertainties: [
        'Exact medical stability of trapped passengers unconfirmed until first responders arrive',
        'Fluid identified by reporter visually as oil/fuel; HazMat confirmation pending'
      ],
      recommendedImmediateActions: [
        'Advise callers and bystanders to maintain 50m safe perimeter away from leaking fluids',
        'Do not smoke or use flares nearby',
        'Coordinate with Highway Traffic Police for lane closure before Exit 14',
        'Alert Level 1 Trauma Center with extrication surgical readiness'
      ],
      suggestedResourceTypes: ['trauma_center', 'fire_station'],
      isAiGenerated: true,
      analyzedAt: '2026-10-09T05:30:00Z',
      provider: 'gemini-3.8-flash'
    },
    statusHistory: [
      {
        status: 'awaiting_review',
        changedBy: 'System Auto-Ingest',
        userRole: 'citizen',
        timestamp: '2026-10-09T05:28:15Z',
        note: 'Incident report submitted via citizen mobile web interface.'
      },
      {
        status: 'under_review',
        changedBy: 'Officer Rajiv Verma',
        userRole: 'reviewer',
        timestamp: '2026-10-09T05:29:40Z',
        note: 'Triage officer verified GPS coordinates and cross-referenced with highway patrol traffic cameras.'
      },
      {
        status: 'action_recorded',
        changedBy: 'Commander Sarah Chen',
        userRole: 'admin',
        timestamp: '2026-10-09T05:35:10Z',
        note: 'Notified Highway Patrol Unit 4 and Apex Trauma ER triage. Route closure request submitted.'
      }
    ],
    reviewerNotes: 'Highway Patrol unit en route. Level 1 trauma team on standby.',
    createdAt: '2026-10-09T05:28:15Z',
    updatedAt: '2026-10-09T05:35:10Z',
    isDemoRecord: true
  },
  {
    id: 'ARQ-2026-1041',
    title: 'Dense Smoke and Fire from Electrical Substation Basement',
    category: 'fire',
    severity: 'high',
    status: 'under_review',
    description: 'Thick black acrid smoke rising from the basement transformer room of a commercial retail complex. Alarms are sounding; building security is attempting partial floor evacuation.',
    reporterName: 'Ananya Sharma (Store Manager)',
    reporterContact: '+1 (555) 774-1290',
    location: {
      address: 'Phoenix Mall East Wing, Sector 3',
      latitude: 17.4380,
      longitude: 78.3690,
      isGpsVerified: true,
      city: 'Hyderabad Metro',
      landmarks: 'Basement Service Bay 2'
    },
    hazardsIdentified: ['High voltage transformers', 'Dense toxic smoke', 'Commercial occupancy'],
    casualtiesEstimate: 0,
    aiAssessment: {
      suggestedCategory: 'fire',
      categoryConfidence: 0.94,
      suggestedSeverity: 'high',
      severityRationale: 'Electrical transformer fires generate intense toxic smoke and potential flashovers in enclosed underground structures with public occupants above.',
      summary: 'Basement electrical transformer fire generating dense smoke in commercial center during business hours.',
      keyDetails: [
        'Basement transformer room origin',
        'Black acrid smoke visible',
        'Partial civilian evacuation underway',
        'No direct burn casualties confirmed yet'
      ],
      assumptionsOrUncertainties: [
        'Main breaker isolation status is unconfirmed',
        'Occupancy count on upper basement level is unknown'
      ],
      recommendedImmediateActions: [
        'Evacuate all personnel upward and away from smoke exhaust vents',
        'Do not use water extinguishers on energized electrical equipment',
        'Notify regional power utility for remote grid disconnection'
      ],
      suggestedResourceTypes: ['fire_station', 'hospital'],
      isAiGenerated: true,
      analyzedAt: '2026-10-09T05:10:00Z',
      provider: 'gemini-3.8-flash'
    },
    statusHistory: [
      {
        status: 'awaiting_review',
        changedBy: 'System Auto-Ingest',
        userRole: 'citizen',
        timestamp: '2026-10-09T05:08:00Z',
        note: 'Report filed with attached photos of basement vent smoke.'
      },
      {
        status: 'under_review',
        changedBy: 'Officer Rajiv Verma',
        userRole: 'reviewer',
        timestamp: '2026-10-09T05:12:30Z',
        note: 'Assigned to Municipal Fire Command Station 04. Dispatched HazMat foam tender.'
      }
    ],
    reviewerNotes: 'Station 04 foam tender alerted. Utility grid operator contacted for substation shutdown.',
    createdAt: '2026-10-09T05:08:00Z',
    updatedAt: '2026-10-09T05:12:30Z',
    isDemoRecord: true
  },
  {
    id: 'ARQ-2026-1040',
    title: 'Severe Collapse of Scaffolding at High-Rise Construction Site',
    category: 'collapse',
    severity: 'critical',
    status: 'awaiting_review',
    description: 'Six stories of external metal scaffolding collapsed during sudden gusty winds. Construction workers were on intermediate platforms. Bystanders report debris blocking access alley.',
    reporterName: 'Ramesh Sundaram (Site Supervisor)',
    reporterContact: '+1 (555) 441-8902',
    location: {
      address: 'Tower 9 Construction Zone, Gachibowli High Street',
      latitude: 17.4420,
      longitude: 78.3540,
      isGpsVerified: true,
      city: 'Hyderabad Metro',
      landmarks: 'Behind Metro Station Pillar 128'
    },
    hazardsIdentified: ['Unstable hanging debris', 'Blocked alley access', 'Possible trapped laborers'],
    casualtiesEstimate: 4,
    aiAssessment: {
      suggestedCategory: 'collapse',
      categoryConfidence: 0.98,
      suggestedSeverity: 'critical',
      severityRationale: 'Multi-story structural collapse with reported active workforce on platforms implies high risk of crushed victims and secondary collapse.',
      summary: 'High-rise scaffolding structural collapse with multiple suspected casualties and unstable debris.',
      keyDetails: [
        '6 stories of metal staging collapsed',
        'Workers reported on intermediate levels prior to failure',
        'Debris blocking emergency vehicle access road'
      ],
      assumptionsOrUncertainties: [
        'Precise number of trapped workers is estimated by supervisor; search cameras required',
        'Stability of building anchor points is compromised'
      ],
      recommendedImmediateActions: [
        'Cordon off 70m drop zone immediately against secondary collapse',
        'Request heavy rescue crane and hydraulic cutting equipment',
        'Establish triage clearing station outside collapse cone'
      ],
      suggestedResourceTypes: ['trauma_center', 'fire_station', 'disaster_relief'],
      isAiGenerated: true,
      analyzedAt: '2026-10-09T04:45:00Z',
      provider: 'gemini-3.8-flash'
    },
    statusHistory: [
      {
        status: 'awaiting_review',
        changedBy: 'System Auto-Ingest',
        userRole: 'citizen',
        timestamp: '2026-10-09T04:44:10Z',
        note: 'Report received with emergency severity trigger.'
      }
    ],
    reviewerNotes: 'Pending triage officer assignment.',
    createdAt: '2026-10-09T04:44:10Z',
    updatedAt: '2026-10-09T04:44:10Z',
    isDemoRecord: true
  },
  {
    id: 'ARQ-2026-1039',
    title: 'Flash Flood and Rising Water Inundation in Rail Underpass',
    category: 'flood',
    severity: 'medium',
    status: 'resolved',
    description: 'Torrential downpour caused sudden 4-foot waterlogging in the low-lying railway underpass. One auto-rickshaw stalled. Driver and two passengers safely climbed onto the vehicle roof.',
    reporterName: 'Pooja Kulkarni (Resident)',
    location: {
      address: 'Old Station Railway Underpass, West Ring',
      latitude: 17.4250,
      longitude: 78.3810,
      isGpsVerified: false,
      city: 'Hyderabad Metro',
      landmarks: 'Under Central Rail Track bridge'
    },
    hazardsIdentified: ['Submerged open manholes', 'Electrical wiring near water'],
    casualtiesEstimate: 0,
    aiAssessment: {
      suggestedCategory: 'flood',
      categoryConfidence: 0.92,
      suggestedSeverity: 'medium',
      severityRationale: 'Localized flood with stranded civilians in non-turbulent water. Low immediate structural collapse danger, but hypothermia and open drain hazards exist.',
      summary: 'Stalled vehicle in 4-foot underpass flood water; occupants sheltered on vehicle roof.',
      keyDetails: [
        '4 feet stagnant flood depth',
        '3 occupants safely perched on vehicle roof',
        'Manual address entry - coordinates approximate'
      ],
      assumptionsOrUncertainties: [
        'Water level rising speed depends on regional storm drainage capacity'
      ],
      recommendedImmediateActions: [
        'Advise stranded persons not to wade in deep water due to hidden manhole covers',
        'Deploy inflatable rescue skiff or high-clearance rescue truck',
        'Barricade both entrances of underpass to incoming traffic'
      ],
      suggestedResourceTypes: ['disaster_relief', 'police_post'],
      isAiGenerated: true,
      analyzedAt: '2026-10-09T03:15:00Z',
      provider: 'gemini-3.8-flash'
    },
    statusHistory: [
      {
        status: 'awaiting_review',
        changedBy: 'System Auto-Ingest',
        userRole: 'citizen',
        timestamp: '2026-10-09T03:10:00Z',
        note: 'Filed by citizen observer.'
      },
      {
        status: 'under_review',
        changedBy: 'Officer Rajiv Verma',
        userRole: 'reviewer',
        timestamp: '2026-10-09T03:16:00Z',
        note: 'Relayed to municipal disaster dewatering team.'
      },
      {
        status: 'action_recorded',
        changedBy: 'Officer Rajiv Verma',
        userRole: 'reviewer',
        timestamp: '2026-10-09T03:35:00Z',
        note: 'Municipal emergency squad arrived with inflatable rescue boat.'
      },
      {
        status: 'resolved',
        changedBy: 'Commander Sarah Chen',
        userRole: 'admin',
        timestamp: '2026-10-09T04:20:00Z',
        note: 'All occupants safely evacuated. Underpass barricaded and pumps running.'
      }
    ],
    reviewerNotes: 'Evacuation complete without injuries. Pumps operational.',
    createdAt: '2026-10-09T03:10:00Z',
    updatedAt: '2026-10-09T04:20:00Z',
    isDemoRecord: true
  },
  {
    id: 'ARQ-2026-1038',
    title: 'Acute Cardiac Distress & Loss of Consciousness in Public Park',
    category: 'medical',
    severity: 'high',
    status: 'under_review',
    description: 'An elderly gentleman collapsed on the jogging track. Non-responsive, breathing is irregular and shallow. Bystanders have initiated basic chest compressions. Public AED requested.',
    reporterName: 'Dr. Mohan Reddy (Jogger)',
    reporterContact: '+1 (555) 980-3341',
    location: {
      address: 'KBR National Park, Gate 3 Walkway',
      latitude: 17.4225,
      longitude: 78.4180,
      isGpsVerified: true,
      city: 'Hyderabad Metro',
      landmarks: 'Near Gazebo 4'
    },
    hazardsIdentified: ['Imminent cardiac arrest', 'Access path restricted to pedestrian width'],
    casualtiesEstimate: 1,
    aiAssessment: {
      suggestedCategory: 'medical',
      categoryConfidence: 0.99,
      suggestedSeverity: 'high',
      severityRationale: 'Sudden unresponsive state with agonal respiration indicates possible out-of-hospital cardiac arrest requiring emergency defibrillation and ALS ambulance within minutes.',
      summary: 'Suspected acute cardiac arrest in public park; CPR underway by citizen physician.',
      keyDetails: [
        'Unresponsive elderly male',
        'Shallow/irregular breathing',
        'Bystander CPR initiated',
        'Park gate 3 pedestrian path'
      ],
      assumptionsOrUncertainties: [
        'Exact duration of collapse prior to CPR start'
      ],
      recommendedImmediateActions: [
        'Instruct caller to maintain uninterrupted chest compressions at 100-120 bpm',
        'Locate nearest Automated External Defibrillator (AED)',
        'Send park security to Gate 3 to guide incoming paramedics through pedestrian path'
      ],
      suggestedResourceTypes: ['hospital', 'trauma_center'],
      isAiGenerated: true,
      analyzedAt: '2026-10-09T02:40:00Z',
      provider: 'gemini-3.8-flash'
    },
    statusHistory: [
      {
        status: 'awaiting_review',
        changedBy: 'System Auto-Ingest',
        userRole: 'citizen',
        timestamp: '2026-10-09T02:38:00Z',
        note: 'Emergency medical report submitted.'
      },
      {
        status: 'under_review',
        changedBy: 'Officer Rajiv Verma',
        userRole: 'reviewer',
        timestamp: '2026-10-09T02:41:00Z',
        note: 'Cross-checked nearest available cardiac ICU at Apollo Jubilee.'
      }
    ],
    reviewerNotes: 'Apollo Jubilee ER alerted. Park security dispatched to Gate 3.',
    createdAt: '2026-10-09T02:38:00Z',
    updatedAt: '2026-10-09T02:41:00Z',
    isDemoRecord: true
  },
  {
    id: 'ARQ-2026-1037',
    title: 'Two-Wheeler Skid on Wet Tramway Track',
    category: 'accident',
    severity: 'low',
    status: 'resolved',
    description: 'Motorcyclist slipped on wet metal track during morning drizzle. Minor abrasions on knee and forearm. Rider is conscious, oriented, and sitting safely on curb.',
    reporterName: 'Sanjay Nair (Self)',
    location: {
      address: 'Heritage Tramway Crossing, University Road',
      latitude: 17.4110,
      longitude: 78.4350,
      isGpsVerified: true,
      city: 'Hyderabad Metro'
    },
    hazardsIdentified: ['Slippery road surface'],
    casualtiesEstimate: 1,
    aiAssessment: {
      suggestedCategory: 'accident',
      categoryConfidence: 0.95,
      suggestedSeverity: 'low',
      severityRationale: 'Low-speed single vehicle incident with minor superficial abrasions, no loss of consciousness, and no vehicle entrapment.',
      summary: 'Minor motorcycle skid; patient conscious with superficial abrasions on sidewalk.',
      keyDetails: [
        'Single two-wheeler slip',
        'Minor superficial abrasions only',
        'Vehicle moved off roadway'
      ],
      assumptionsOrUncertainties: [],
      recommendedImmediateActions: [
        'Clean abrasion with sterile saline or clean water',
        'Apply clean dressing',
        'Visit nearby clinic for tetanus prophylaxis if booster expired'
      ],
      suggestedResourceTypes: ['hospital'],
      isAiGenerated: true,
      analyzedAt: '2026-10-08T22:15:00Z',
      provider: 'gemini-3.8-flash'
    },
    statusHistory: [
      {
        status: 'awaiting_review',
        changedBy: 'System Auto-Ingest',
        userRole: 'citizen',
        timestamp: '2026-10-08T22:12:00Z',
        note: 'Report filed.'
      },
      {
        status: 'resolved',
        changedBy: 'Officer Rajiv Verma',
        userRole: 'reviewer',
        timestamp: '2026-10-08T22:30:00Z',
        note: 'Patient escorted by friends to local primary healthcare clinic. No active response needed.'
      }
    ],
    reviewerNotes: 'Self-resolved at clinic.',
    createdAt: '2026-10-08T22:12:00Z',
    updatedAt: '2026-10-08T22:30:00Z',
    isDemoRecord: true
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-admin-01',
    name: 'Commander Sarah Chen',
    email: 'sarah.chen@autoresq.internal',
    role: 'admin',
    agency: 'Metropolitan Emergency Command Center',
    phone: '+1 (555) 019-2831'
  },
  {
    id: 'user-reviewer-01',
    name: 'Officer Rajiv Verma',
    email: 'rajiv.verma@autoresq.internal',
    role: 'reviewer',
    agency: 'Regional Incident Triage Bureau',
    phone: '+1 (555) 019-8822'
  },
  {
    id: 'user-citizen-01',
    name: 'Alex Mercer',
    email: 'alex.mercer@gmail.com',
    role: 'citizen',
    phone: '+1 (555) 392-1084'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    incidentId: 'ARQ-2026-1042',
    title: 'CRITICAL: Multi-Vehicle Collision Escalation',
    message: 'Report ARQ-2026-1042 has been placed into Action Recorded status. Highway closure requested.',
    severity: 'critical',
    timestamp: '2026-10-09T05:35:10Z',
    read: false
  },
  {
    id: 'notif-02',
    incidentId: 'ARQ-2026-1040',
    title: 'High-Rise Scaffolding Collapse Awaiting Review',
    message: 'New report ARQ-2026-1040 logged with estimated 4 casualties in Gachibowli High Street.',
    severity: 'critical',
    timestamp: '2026-10-09T04:44:10Z',
    read: false
  },
  {
    id: 'notif-03',
    incidentId: 'ARQ-2026-1041',
    title: 'Commercial Basement Fire Under Review',
    message: 'Officer Rajiv Verma assigned to Phoenix Mall transformer fire.',
    severity: 'warning',
    timestamp: '2026-10-09T05:12:30Z',
    read: true
  },
  {
    id: 'notif-04',
    incidentId: 'ARQ-2026-1039',
    title: 'Underpass Flooding Resolved',
    message: 'Stranded passengers safely rescued from West Ring railway underpass.',
    severity: 'info',
    timestamp: '2026-10-09T04:20:00Z',
    read: true
  }
];
