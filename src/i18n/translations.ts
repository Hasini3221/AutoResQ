export type Language = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'bn';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
];

export const SPEECH_LANG_MAP: Record<Language, string> = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN'
};

export interface Translations {
  // Brand & Slogan
  appName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;

  // Actions
  reportEmergencyBtn: string;
  findHospitalsBtn: string;
  submitReportBtn: string;
  useMyLocationBtn: string;
  nextStepBtn: string;
  backBtn: string;
  callNowBtn: string;
  directionsBtn: string;
  viewDetailsBtn: string;

  // Navigation (Only 5 main items)
  navHome: string;
  navReport: string;
  navHospitals: string;
  navDashboard: string;
  navHelp: string;

  // 3-Step Homepage Section
  howItWorksTitle: string;
  howItWorksSub: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Emergency Categories (4 core types)
  catAccident: string;
  catMedical: string;
  catFire: string;
  catOther: string;

  // Reporting Steps
  reportStep1Title: string;
  reportStep1Sub: string;
  reportStep2Title: string;
  reportStep2Sub: string;
  reportStep3Title: string;
  reportStep3Sub: string;
  reportStep4Title: string;
  reportStep4Sub: string;

  // Form Fields
  fieldTitle: string;
  fieldTitlePlaceholder: string;
  fieldDesc: string;
  fieldDescPlaceholder: string;
  fieldPeopleAffected: string;
  fieldPeopleAffectedHelp: string;
  fieldUploadImage: string;
  fieldUploadImageHelp: string;
  fieldLocationAddress: string;
  fieldLocationPlaceholder: string;
  fieldReporterName: string;
  fieldReporterPhone: string;

  // Location status
  gpsAcquired: string;
  gpsManualFallback: string;
  gpsLocating: string;

  // Confirmation & IDs
  reportSubmittedTitle: string;
  reportSubmittedDesc: string;
  incidentIdLabel: string;
  fileAnotherReport: string;
  goToDashboard: string;

  // Dashboard
  dashboardTitle: string;
  dashboardSub: string;
  statTotalReports: string;
  statPendingReports: string;
  statUnderReview: string;
  statResolvedReports: string;
  tableId: string;
  tableType: string;
  tableLocation: string;
  tableDate: string;
  tableStatus: string;
  tableAction: string;

  // Statuses
  statusPending: string;
  statusUnderReview: string;
  statusActionRecorded: string;
  statusResolved: string;

  // Hospitals
  hospitalsTitle: string;
  hospitalsSub: string;
  hospitalSearchPlaceholder: string;
  hospitalDistance: string;
  hospitalOpen247: string;
  hospitalEmergencyWard: string;

  // Safety & Notice
  safetyDisclaimer: string;
  hotlineEmergency: string;
  hotlineAmbulance: string;
  hotlineFire: string;
  hotlinePolice: string;

  // Errors & Loading
  loading: string;
  errorRequiredField: string;
  errorSubmissionFailed: string;
  demoModeNotice: string;

  // Voice Input (Microphone)
  voiceTapToSpeak: string;
  voiceListening: string;
  voiceStop: string;
  voiceNotSupported: string;
  voicePermissionDenied: string;
  voiceTryAgain: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AutoResQ',
    tagline: 'Fast Reporting. Smarter Emergency Support.',
    heroHeading: 'How can we help you?',
    heroSubheading: 'Report an incident in under 60 seconds or immediately locate verified nearby emergency hospitals.',

    reportEmergencyBtn: 'Report an Emergency',
    findHospitalsBtn: 'Find Nearby Hospitals',
    submitReportBtn: 'Submit Emergency Report',
    useMyLocationBtn: 'Use My Current Location',
    nextStepBtn: 'Continue to Next Step',
    backBtn: 'Back',
    callNowBtn: 'Call Emergency',
    directionsBtn: 'Get Directions',
    viewDetailsBtn: 'View Details',

    navHome: 'Home',
    navReport: 'Report Emergency',
    navHospitals: 'Nearby Hospitals',
    navDashboard: 'Dashboard',
    navHelp: 'Help',

    howItWorksTitle: 'How AutoResQ Works in 3 Simple Steps',
    howItWorksSub: 'Designed for fast action during urgent situations.',
    step1Title: '1. Select Emergency Type',
    step1Desc: 'Choose road accident, medical, fire, or other danger and describe what happened.',
    step2Title: '2. Pinpoint Your Location',
    step2Desc: 'Use one-tap GPS detection or type your nearest landmark easily.',
    step3Title: '3. Get Help & Nearest Hospital',
    step3Desc: 'Instantly view nearby medical facilities, contact helplines, and track response.',

    catAccident: 'Road Accident',
    catMedical: 'Medical Emergency',
    catFire: 'Fire',
    catOther: 'Other Emergency',

    reportStep1Title: 'Step 1: Emergency Type',
    reportStep1Sub: 'What kind of emergency are you reporting right now?',
    reportStep2Title: 'Step 2: Incident Details',
    reportStep2Sub: 'Provide a brief summary and optional photo.',
    reportStep3Title: 'Step 3: Location',
    reportStep3Sub: 'Where is the incident happening?',
    reportStep4Title: 'Step 4: Review and Submit',
    reportStep4Sub: 'Please confirm details before sending.',

    fieldTitle: 'Incident Headline / Short Title',
    fieldTitlePlaceholder: 'e.g. Car crash at crossroad, thick smoke from building',
    fieldDesc: 'Short Description *',
    fieldDescPlaceholder: 'Describe what you see: vehicles involved, hazards, landmarks...',
    fieldPeopleAffected: 'Number of People Affected (Optional)',
    fieldPeopleAffectedHelp: 'Leave blank if unknown.',
    fieldUploadImage: 'Upload a Scene Photo (Optional)',
    fieldUploadImageHelp: 'PNG, JPG up to 5MB.',
    fieldLocationAddress: 'Incident Location / Address *',
    fieldLocationPlaceholder: 'Enter address or tap "Use My Current Location"',
    fieldReporterName: 'Your Name (Optional)',
    fieldReporterPhone: 'Your Contact Phone (Optional)',

    gpsAcquired: 'GPS coordinates verified with your device.',
    gpsManualFallback: 'GPS access denied or unavailable. Please type your location manually.',
    gpsLocating: 'Detecting your GPS location...',

    reportSubmittedTitle: 'Emergency Report Submitted Successfully',
    reportSubmittedDesc: 'Your incident has been recorded and assigned for review. For life-threatening emergencies, please also call 112 or 108 directly.',
    incidentIdLabel: 'Incident Report ID',
    fileAnotherReport: 'Report Another Incident',
    goToDashboard: 'View on Live Dashboard',

    dashboardTitle: 'Incident Response Dashboard',
    dashboardSub: 'Review all recorded emergency submissions, triage statuses, and active response records.',
    statTotalReports: 'Total Reports',
    statPendingReports: 'Pending Reports',
    statUnderReview: 'Reports Under Review',
    statResolvedReports: 'Resolved Reports',
    tableId: 'Report ID',
    tableType: 'Emergency Type',
    tableLocation: 'Location',
    tableDate: 'Date & Time',
    tableStatus: 'Status',
    tableAction: 'Action',

    statusPending: 'Pending Review',
    statusUnderReview: 'Under Review',
    statusActionRecorded: 'Action Recorded',
    statusResolved: 'Resolved',

    hospitalsTitle: 'Nearby Emergency Hospitals',
    hospitalsSub: 'Find 24/7 emergency rooms and trauma care centers closest to you.',
    hospitalSearchPlaceholder: 'Search by hospital name or area...',
    hospitalDistance: 'Distance',
    hospitalOpen247: '24/7 Emergency',
    hospitalEmergencyWard: 'Trauma & Emergency Care',

    safetyDisclaimer: 'Notice: AutoResQ is an emergency assistance and reporting prototype. For immediate life-saving emergency services, call 112 or 108 directly.',
    hotlineEmergency: 'National Emergency: 112',
    hotlineAmbulance: 'Ambulance: 108',
    hotlineFire: 'Fire: 101',
    hotlinePolice: 'Police: 100',

    loading: 'Loading information...',
    errorRequiredField: 'Please fill in this required field.',
    errorSubmissionFailed: 'Could not submit report. Please check connection and try again.',
    demoModeNotice: 'Demo Mode: Fictional records are shown for college hackathon evaluation.',

    voiceTapToSpeak: 'Tap to speak',
    voiceListening: 'Listening... Speak now',
    voiceStop: 'Stop recording',
    voiceNotSupported: 'Speech recognition is not supported in this browser. Please type manually.',
    voicePermissionDenied: 'Microphone permission denied. Please allow microphone access or type manually.',
    voiceTryAgain: 'No speech detected. Tap to try again.'
  },

  te: {
    appName: 'AutoResQ',
    tagline: 'వేగవంతమైన నివేదిక. మెరుగైన అత్యవసర సహాయం.',
    heroHeading: 'మేము మీకు ఎలా సహాయపడగలం?',
    heroSubheading: '60 సెకన్లలో అత్యవసర పరిస్థితిని నివేదించండి లేదా సమీపంలోని ఆసుపత్రులను కనుగొనండి.',

    reportEmergencyBtn: 'అత్యవసర నివేదిక ఇవ్వండి',
    findHospitalsBtn: 'సమీప ఆసుపత్రులను కనుగొనండి',
    submitReportBtn: 'నివేదికను సమర్పించండి',
    useMyLocationBtn: 'నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    nextStepBtn: 'తదుపరి దశకు వెళ్లండి',
    backBtn: 'వెనుకకు',
    callNowBtn: 'కాల్ చేయండి',
    directionsBtn: 'రూట్ మ్యాప్',
    viewDetailsBtn: 'వివరాలు చూడండి',

    navHome: 'హోమ్',
    navReport: 'అత్యవసర నివేదిక',
    navHospitals: 'సమీప ఆసుపత్రులు',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navHelp: 'సహాయం',

    howItWorksTitle: 'AutoResQ ఎలా పనిచేస్తుంది (3 సులభ దశలు)',
    howItWorksSub: 'ఆపద సమయంలో త్వరిత సహాయం కోసం రూపొందించబడింది.',
    step1Title: '1. ప్రమాద రకాన్ని ఎంచుకోండి',
    step1Desc: 'రోడ్డు ప్రమాదం, వైద్య అత్యవసరం, లేదా అగ్ని ప్రమాదాన్ని ఎంచుకోండి.',
    step2Title: '2. స్థానాన్ని గుర్తించండి',
    step2Desc: 'ఒక్క క్లిక్‌తో GPS ఉపయోగించండి లేదా మీ చిరునామాను రాయండి.',
    step3Title: '3. ఆసుపత్రి సహాయం పొందండి',
    step3Desc: 'సమీప ఆసుపత్రుల వివరాలు మరియు సహాయ నంబర్లు వెంటనే పొందండి.',

    catAccident: 'రోడ్డు ప్రమాదం',
    catMedical: 'వైద్య అత్యవసరం',
    catFire: 'అగ్ని ప్రమాదం',
    catOther: 'ఇతర అత్యవసరం',

    reportStep1Title: 'దశ 1: అత్యవసర రకం',
    reportStep1Sub: 'మీరు ఏ రకమైన పరిస్థితిని నివేదిస్తున్నారు?',
    reportStep2Title: 'దశ 2: వివరాలు',
    reportStep2Sub: 'పరిస్థితి గురించి క్లుప్తంగా వివరించండి.',
    reportStep3Title: 'దశ 3: స్థానం',
    reportStep3Sub: 'సంఘటన ఎక్కడ జరిగింది?',
    reportStep4Title: 'దశ 4: పరిశీలించి సమర్పించండి',
    reportStep4Sub: 'వివరాలు సరిచూసి నివేదికను పంపండి.',

    fieldTitle: 'సంఘటన శీర్షిక',
    fieldTitlePlaceholder: 'ఉదా: రోడ్డుపై వాహన ప్రమాదం, భవనంలో పొగ',
    fieldDesc: 'వివరణ *',
    fieldDescPlaceholder: 'మీరు చూసిన పరిస్థితిని రాయండి...',
    fieldPeopleAffected: 'బాధితుల సంఖ్య (ఐచ్ఛికం)',
    fieldPeopleAffectedHelp: 'తెలియకపోతే ఖాళీగా ఉంచండి.',
    fieldUploadImage: 'ఫోటో జోడించండి (ఐచ్ఛికం)',
    fieldUploadImageHelp: 'చిత్రం 5MB లోపు ఉండాలి.',
    fieldLocationAddress: 'సంఘటన స్థలం / చిరునామా *',
    fieldLocationPlaceholder: 'చిరునామా నమోదు చేయండి లేదా GPS వాడండి',
    fieldReporterName: 'మీ పేరు (ఐచ్ఛికం)',
    fieldReporterPhone: 'ఫోన్ నంబర్ (ఐచ్ఛికం)',

    gpsAcquired: 'GPS స్థానం విజయవంతంగా గుర్తించబడింది.',
    gpsManualFallback: 'GPS అనుమతి లభించలేదు. దయచేసి చిరునామాను చేతితో నమోదు చేయండి.',
    gpsLocating: 'మీ GPS స్థానాన్ని గుర్తిస్తున్నాము...',

    reportSubmittedTitle: 'అత్యవసర నివేదిక విజయవంతంగా సమర్పించబడింది',
    reportSubmittedDesc: 'మీ నివేదిక నమోదైంది. ప్రాణాపాయ స్థితిలో దయచేసి 112 లేదా 108 కు నేరుగా కాల్ చేయండి.',
    incidentIdLabel: 'నివేదిక ఐడీ',
    fileAnotherReport: 'మరొక నివేదిక ఇవ్వండి',
    goToDashboard: 'డ్యాష్‌బోర్డ్‌లో చూడండి',

    dashboardTitle: 'అత్యవసర ప్రతిస్పందన డ్యాష్‌బోర్డ్',
    dashboardSub: 'నమోదైన అన్ని నివేదికలు మరియు వాటి ప్రస్తుత స్థితి.',
    statTotalReports: 'మొత్తం నివేదికలు',
    statPendingReports: 'పెండింగ్ నివేదికలు',
    statUnderReview: 'సమీక్షలో ఉన్నవి',
    statResolvedReports: 'పరిష్కరించబడినవి',
    tableId: 'నివేదిక ఐడీ',
    tableType: 'ప్రమాద రకం',
    tableLocation: 'స్థానం',
    tableDate: 'తేదీ & సమయం',
    tableStatus: 'స్థితి',
    tableAction: 'చర్య',

    statusPending: 'సమీక్ష పెండింగ్',
    statusUnderReview: 'సమీక్షలో ఉంది',
    statusActionRecorded: 'చర్య నమోదైంది',
    statusResolved: 'పరిష్కరించబడింది',

    hospitalsTitle: 'సమీప అత్యవసర ఆసుపత్రులు',
    hospitalsSub: 'మీకు దగ్గరగా ఉన్న 24/7 అత్యవసర కేంద్రాలు మరియు ఆసుపత్రులు.',
    hospitalSearchPlaceholder: 'ఆసుపత్రి పేరు లేదా ప్రాంతం ద్వారా వెతకండి...',
    hospitalDistance: 'దూరం',
    hospitalOpen247: '24/7 అత్యవసర విభాగం',
    hospitalEmergencyWard: 'ట్రామా & అత్యవసర వైద్యం',

    safetyDisclaimer: 'గమనిక: AutoResQ ఒక సహాయక నివేదిక ప్లాట్‌ఫారమ్. అత్యవసర ప్రాణరక్షణ సేవల కోసం వెంటనే 112 లేదా 108 కు కాల్ చేయండి.',
    hotlineEmergency: 'జాతీయ అత్యవసరం: 112',
    hotlineAmbulance: 'అంబులెన్స్: 108',
    hotlineFire: 'అగ్నిమాపక: 101',
    hotlinePolice: 'పోలీస్: 100',

    loading: 'సమాచారం లోడ్ అవుతోంది...',
    errorRequiredField: 'దయచేసి ఈ వివరాలను పూరించండి.',
    errorSubmissionFailed: 'నివేదిక పంపడం విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    demoModeNotice: 'డెమో మోడ్: కాలేజ్ హ్యాకథాన్ ప్రదర్శన కొరకు నమూనా డేటా చూపబడుతోంది.',

    voiceTapToSpeak: 'మాట్లాడటానికి నొక్కండి',
    voiceListening: 'వింటున్నాము... మాట్లాడండి',
    voiceStop: 'రికార్డింగ్ ఆపండి',
    voiceNotSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',
    voicePermissionDenied: 'మైక్రోఫోన్ అనుమతి లభించలేదు. దయచేసి అనుమతి ఇవ్వండి లేదా టైప్ చేయండి.',
    voiceTryAgain: 'ధ్వని వినపడలేదు. మళ్ళీ ప్రయత్నించడానికి నొక్కండి.'
  },

  hi: {
    appName: 'AutoResQ',
    tagline: 'तेज़ रिपोर्टिंग। बेहतर आपातकालीन सहायता।',
    heroHeading: 'हम आपकी कैसे मदद कर सकते हैं?',
    heroSubheading: '60 सेकंड से भी कम समय में आपातकाल की रिपोर्ट करें या नजदीकी अस्पताल खोजें।',

    reportEmergencyBtn: 'आपातकाल रिपोर्ट करें',
    findHospitalsBtn: 'नजदीकी अस्पताल खोजें',
    submitReportBtn: 'आपातकालीन रिपोर्ट सबमिट करें',
    useMyLocationBtn: 'मेरा वर्तमान स्थान उपयोग करें',
    nextStepBtn: 'अगला कदम',
    backBtn: 'पीछे जाएं',
    callNowBtn: 'कॉल करें',
    directionsBtn: 'दिशा-निर्देश',
    viewDetailsBtn: 'विवरण देखें',

    navHome: 'होम',
    navReport: 'आपात रिपोर्ट',
    navHospitals: 'नजदीकी अस्पताल',
    navDashboard: 'डैशबोर्ड',
    navHelp: 'सहायता',

    howItWorksTitle: 'AutoResQ कैसे काम करता है (3 आसान चरण)',
    howItWorksSub: 'संकट के समय त्वरित कार्रवाई के लिए डिज़ाइन किया गया।',
    step1Title: '1. आपातकाल प्रकार चुनें',
    step1Desc: 'सड़क दुर्घटना, चिकित्सा, आग या अन्य खतरे का चयन करें।',
    step2Title: '2. स्थान निर्दिष्ट करें',
    step2Desc: 'एक टैप में GPS से स्थान पाएं या अपना पता दर्ज करें।',
    step3Title: '3. सहायता और अस्पताल पाएं',
    step3Desc: 'नजदीकी चिकित्सा सुविधाएं और हेल्पलाइन नंबर तुरंत देखें।',

    catAccident: 'सड़क दुर्घटना',
    catMedical: 'चिकित्सा आपातकाल',
    catFire: 'आग',
    catOther: 'अन्य आपातकाल',

    reportStep1Title: 'चरण 1: आपातकाल का प्रकार',
    reportStep1Sub: 'आप किस प्रकार की आपात स्थिति की रिपोर्ट कर रहे हैं?',
    reportStep2Title: 'चरण 2: घटना का विवरण',
    reportStep2Sub: 'संक्षिप्त विवरण और वैकल्पिक फोटो प्रदान करें।',
    reportStep3Title: 'चरण 3: स्थान',
    reportStep3Sub: 'यह घटना कहाँ हो रही है?',
    reportStep4Title: 'चरण 4: समीक्षा और सबमिट',
    reportStep4Sub: 'कृपया भेजने से पहले विवरण की पुष्टि करें।',

    fieldTitle: 'घटना का शीर्षक',
    fieldTitlePlaceholder: 'जैसे: चौराहे पर कार दुर्घटना, इमारत से धुआं',
    fieldDesc: 'संक्षिप्त विवरण *',
    fieldDescPlaceholder: 'आपने जो देखा उसका विवरण दें...',
    fieldPeopleAffected: 'प्रभावित लोगों की संख्या (वैकल्पिक)',
    fieldPeopleAffectedHelp: 'अज्ञात होने पर खाली छोड़ दें।',
    fieldUploadImage: 'घटना की फोटो अपलोड करें (वैकल्पिक)',
    fieldUploadImageHelp: 'फ़ोटो 5MB से कम होनी चाहिए।',
    fieldLocationAddress: 'घटना का स्थान / पता *',
    fieldLocationPlaceholder: 'पता दर्ज करें या "मेरा वर्तमान स्थान" बटन दबाएं',
    fieldReporterName: 'आपका नाम (वैकल्पिक)',
    fieldReporterPhone: 'आपका फोन नंबर (वैकल्पिक)',

    gpsAcquired: 'GPS स्थान सफलतापूर्वक प्राप्त हुआ।',
    gpsManualFallback: 'GPS अनुपलब्ध है। कृपया मैन्युअल रूप से पता दर्ज करें।',
    gpsLocating: 'GPS स्थान खोज रहे हैं...',

    reportSubmittedTitle: 'आपातकालीन रिपोर्ट सफलतापूर्वक दर्ज हुई',
    reportSubmittedDesc: 'आपकी रिपोर्ट दर्ज कर ली गई है। गंभीर आपातकाल में तुरंत 112 या 108 पर कॉल करें।',
    incidentIdLabel: 'रिपोर्ट आईडी',
    fileAnotherReport: 'अन्य रिपोर्ट दर्ज करें',
    goToDashboard: 'डैशबोर्ड पर देखें',

    dashboardTitle: 'आपातकालीन प्रतिक्रिया डैशबोर्ड',
    dashboardSub: 'दर्ज की गई सभी आपातकालीन रिपोर्ट और उनकी वर्तमान स्थिति।',
    statTotalReports: 'कुल रिपोर्ट',
    statPendingReports: 'लंबित रिपोर्ट',
    statUnderReview: 'समीक्षाधीन रिपोर्ट',
    statResolvedReports: 'हल की गई रिपोर्ट',
    tableId: 'रिपोर्ट आईडी',
    tableType: 'आपात प्रकार',
    tableLocation: 'स्थान',
    tableDate: 'दिनांक और समय',
    tableStatus: 'स्थिति',
    tableAction: 'कार्रवाई',

    statusPending: 'समीक्षा लंबित',
    statusUnderReview: 'समीक्षाधीन',
    statusActionRecorded: 'कार्रवाई दर्ज',
    statusResolved: 'हल किया गया',

    hospitalsTitle: 'नजदीकी आपातकालीन अस्पताल',
    hospitalsSub: 'अपने सबसे नजदीकी 24/7 आपातकालीन वार्ड और ट्रॉमा केंद्र खोजें।',
    hospitalSearchPlaceholder: 'अस्पताल के नाम या क्षेत्र से खोजें...',
    hospitalDistance: 'दूरी',
    hospitalOpen247: '24/7 आपातकालीन सेवा',
    hospitalEmergencyWard: 'ट्रॉमा एवं आपातकालीन देखभाल',

    safetyDisclaimer: 'सूचना: AutoResQ एक सहायता और रिपोर्टिंग प्रोटोटाइप है। जीवनरक्षक सहायता के लिए सीधे 112 या 108 पर कॉल करें।',
    hotlineEmergency: 'राष्ट्रीय आपातकाल: 112',
    hotlineAmbulance: 'एम्बुलेंस: 108',
    hotlineFire: 'अग्निशमन: 101',
    hotlinePolice: 'पुलिस: 100',

    loading: 'जानकारी लोड हो रही है...',
    errorRequiredField: 'कृपया यह आवश्यक जानकारी भरें।',
    errorSubmissionFailed: 'रिपोर्ट सबमिट नहीं हो सकी। कृपया पुनः प्रयास करें।',
    demoModeNotice: 'डेमो मोड: हैकाथॉन मूल्यांकन के लिए नमूना डेटा दिखाया जा रहा है।',

    voiceTapToSpeak: 'बोलने के लिए टैप करें',
    voiceListening: 'सुन रहे हैं... अब बोलें',
    voiceStop: 'रिकॉर्डिंग रोकें',
    voiceNotSupported: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया लिखकर बताएं।',
    voicePermissionDenied: 'माइक्रोफ़ोन की अनुमति अस्वीकृत। कृपया माइक्रोफ़ोन चालू करें या टाइप करें।',
    voiceTryAgain: 'आवाज़ नहीं सुनी जा सकी। पुनः प्रयास करने के लिए टैप करें।'
  },

  ta: {
    appName: 'AutoResQ',
    tagline: 'விரைவான புகார். சிறந்த அவசர உதவி.',
    heroHeading: 'நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    heroSubheading: '60 வினாடிகளுக்குள் அவசரநிலையைப் புகாரளிக்கவும் அல்லது அருகிலுள்ள மருத்துவமனைகளைக் கண்டறியவும்.',

    reportEmergencyBtn: 'அவசரநிலையைப் புகாரளிக்கவும்',
    findHospitalsBtn: 'அருகிலுள்ள மருத்துவமனைகள்',
    submitReportBtn: 'அவசரப் புகாரை சமர்ப்பிக்கவும்',
    useMyLocationBtn: 'எனது இருப்பிடத்தைப் பயன்படுத்து',
    nextStepBtn: 'அடுத்த படி',
    backBtn: 'பின்செல்க',
    callNowBtn: 'அழைக்கவும்',
    directionsBtn: 'வழிகாட்டுதல்',
    viewDetailsBtn: 'விவரங்களைக் காண்க',

    navHome: 'முகப்பு',
    navReport: 'அவசரப் புகார்',
    navHospitals: 'மருத்துவமனைகள்',
    navDashboard: 'டாஷ்போர்டு',
    navHelp: 'உதவி',

    howItWorksTitle: 'AutoResQ எவ்வாறு செயல்படுகிறது (3 எளிய படிகள்)',
    howItWorksSub: 'அவசர காலங்களில் விரைவான நடவடிக்கைக்காக வடிவமைக்கப்பட்டது.',
    step1Title: '1. அவசர வகையைத் தேர்வுசெய்க',
    step1Desc: 'சாலை விபத்து, மருத்துவ அவசரம் அல்லது தீ விபத்தைத் தேர்ந்தெடுக்கவும்.',
    step2Title: '2. இருப்பிடத்தைக் குறிப்பிடவும்',
    step2Desc: 'ஒரே தட்டலில் GPS பயன்படுத்தவும் அல்லது முகவரியைத் தட்டச்சு செய்யவும்.',
    step3Title: '3. மருத்துவ உதவியைப் பெறவும்',
    step3Desc: 'அருகிலுள்ள மருத்துவமனைகள் மற்றும் அவசர உதவி எண்களை உடனே காணவும்.',

    catAccident: 'சாலை விபத்து',
    catMedical: 'மருத்துவ அவசரம்',
    catFire: 'தீ விபத்து',
    catOther: 'பிற அவசரநிலை',

    reportStep1Title: 'படி 1: அவசர வகை',
    reportStep1Sub: 'நீங்கள் எந்த வகையான அவசரநிலையைப் புகாரளிக்கிறீர்கள்?',
    reportStep2Title: 'படி 2: சம்பவ விவரங்கள்',
    reportStep2Sub: 'சுருக்கமான விவரம் மற்றும் விருப்ப புகைப்படத்தை வழங்கவும்.',
    reportStep3Title: 'படி 3: இருப்பிடம்',
    reportStep3Sub: 'சம்பவம் எங்கு நடக்கிறது?',
    reportStep4Title: 'படி 4: சரிபார்த்து சமர்ப்பிக்கவும்',
    reportStep4Sub: 'அனுப்பும் முன் விவரங்களை உறுதிப்படுத்தவும்.',

    fieldTitle: 'சம்பவ தலைப்பு',
    fieldTitlePlaceholder: 'எ.கா: சந்திப்பில் வாகன விபத்து, கட்டிடத்தில் புகை',
    fieldDesc: 'சுருக்கமான விளக்கம் *',
    fieldDescPlaceholder: 'நீங்கள் பார்த்ததை விவரிக்கவும்...',
    fieldPeopleAffected: 'பாதிக்கப்பட்டோர் எண்ணிக்கை (விருப்பத்தேர்வு)',
    fieldPeopleAffectedHelp: 'தெரியவில்லை என்றால் காலியாக விடவும்.',
    fieldUploadImage: 'புகைப்படம் பதிவேற்றவும் (விருப்பத்தேர்வு)',
    fieldUploadImageHelp: '5MB வரை உள்ள படம்.',
    fieldLocationAddress: 'சம்பவ இடம் / முகவரி *',
    fieldLocationPlaceholder: 'முகவரியை உள்ளிடவும் அல்லது GPS பயன்படுத்தவும்',
    fieldReporterName: 'உங்கள் பெயர் (விருப்பத்தேர்வு)',
    fieldReporterPhone: 'தொலைபேசி எண் (விருப்பத்தேர்வு)',

    gpsAcquired: 'GPS இருப்பிடம் வெற்றிகரமாக பெறப்பட்டது.',
    gpsManualFallback: 'GPS கிடைக்கவில்லை. முகவரியை நேரடியாக உள்ளிடவும்.',
    gpsLocating: 'இருப்பிடத்தைக் கண்டறிகிறது...',

    reportSubmittedTitle: 'அவசர அறிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது',
    reportSubmittedDesc: 'உங்கள் புகார் பதிவு செய்யப்பட்டது. உயிருக்கு ஆபத்தான நிலையில் உடனே 112 அல்லது 108 ஐ அழைக்கவும்.',
    incidentIdLabel: 'புகார் ஐடி',
    fileAnotherReport: 'மற்றொரு புகாரைப் பதிவுசெய்க',
    goToDashboard: 'டாஷ்போர்டில் காண்க',

    dashboardTitle: 'அவசர நடவடிக்கை டாஷ்போர்டு',
    dashboardSub: 'பதிவுசெய்யப்பட்ட அனைத்து அறிக்கைகள் மற்றும் அவற்றின் நிலை.',
    statTotalReports: 'மொத்த அறிக்கைகள்',
    statPendingReports: 'நிலுவையில் உள்ளவை',
    statUnderReview: 'ஆய்வில் உள்ளவை',
    statResolvedReports: 'தீர்க்கப்பட்டவை',
    tableId: 'அறிக்கை ஐடி',
    tableType: 'அவசர வகை',
    tableLocation: 'இருப்பிடம்',
    tableDate: 'தேதி & நேரம்',
    tableStatus: 'நிலை',
    tableAction: 'செயல்',

    statusPending: 'ஆய்வு நிலுவையில்',
    statusUnderReview: 'ஆய்வில் உள்ளது',
    statusActionRecorded: 'நடவடிக்கை பதிவானது',
    statusResolved: 'தீர்க்கப்பட்டது',

    hospitalsTitle: 'அருகிலுள்ள அவசர மருத்துவமனைகள்',
    hospitalsSub: 'உங்களுக்கு அருகிலுள்ள 24/7 அவசர சிகிச்சை பிரிவுகள்.',
    hospitalSearchPlaceholder: 'மருத்துவமனை பெயர் அல்லது பகுதியால் தேடுக...',
    hospitalDistance: 'தூரம்',
    hospitalOpen247: '24/7 அவசர சிகிச்சை',
    hospitalEmergencyWard: 'அதிதீவிர சிகிச்சை மையம்',

    safetyDisclaimer: 'அறிவிப்பு: AutoResQ என்பது ஒரு மாதிரி உதவி தளம். உடனடி அவசர உதவிக்கு 112 அல்லது 108 ஐ நேரடியாக அழைக்கவும்.',
    hotlineEmergency: 'தேசிய அவசரம்: 112',
    hotlineAmbulance: 'ஆம்புலன்ஸ்: 108',
    hotlineFire: 'தீயணைப்பு: 101',
    hotlinePolice: 'காவல்துறை: 100',

    loading: 'ஏற்றுகிறது...',
    errorRequiredField: 'இந்த தகவலை நிரப்பவும்.',
    errorSubmissionFailed: 'அறிக்கையை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    demoModeNotice: 'டெமோ பயன்முறை: மாதிரி தரவு காண்பிக்கப்படுகிறது.',

    voiceTapToSpeak: 'பேச தட்டவும்',
    voiceListening: 'கேட்கிறது... இப்போது பேசவும்',
    voiceStop: 'பதிவை நிறுத்து',
    voiceNotSupported: 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. தட்டச்சு செய்யவும்.',
    voicePermissionDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. அனுமதி வழங்கவும் அல்லது தட்டச்சு செய்யவும்.',
    voiceTryAgain: 'குரல் கேட்கவில்லை. மீண்டும் முயற்சிக்க தட்டவும்.'
  },

  kn: {
    appName: 'AutoResQ',
    tagline: 'ವೇಗದ ವರದಿ. ಉತ್ತಮ ತುರ್ತು ಬೆಂಬಲ.',
    heroHeading: 'ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    heroSubheading: '60 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ.',

    reportEmergencyBtn: 'ತುರ್ತು ವರದಿ ಮಾಡಿ',
    findHospitalsBtn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    submitReportBtn: 'ವರದಿಯನ್ನು ಸಲ್ಲಿಸಿ',
    useMyLocationBtn: 'ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ',
    nextStepBtn: 'ಮುಂದಿನ ಹಂತ',
    backBtn: 'ಹಿಂದಕ್ಕೆ',
    callNowBtn: 'ಕರೆ ಮಾಡಿ',
    directionsBtn: 'ಮಾರ್ಗಸೂಚಿ',
    viewDetailsBtn: 'ವಿವರಗಳನ್ನು ನೋಡಿ',

    navHome: 'ಮುಖಪುಟ',
    navReport: 'ತುರ್ತು ವರದಿ',
    navHospitals: 'ಆಸ್ಪತ್ರೆಗಳು',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navHelp: 'ಸಹಾಯ',

    howItWorksTitle: 'AutoResQ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ (3 ಸರಳ ಹಂತಗಳು)',
    howItWorksSub: 'ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ತ್ವರಿತ ಸಹಾಯಕ್ಕಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
    step1Title: '1. ತುರ್ತು ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    step1Desc: 'ರಸ್ತೆ ಅಪಘಾತ, ವೈದ್ಯಕೀಯ ತುರ್ತು ಅಥವಾ ಬೆಂಕಿ ಅನಾಹುತವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    step2Title: '2. ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಗುರುತಿಸಿ',
    step2Desc: 'ಒಂದು ಟ್ಯಾಪ್‌ನಲ್ಲಿ GPS ಬಳಸಿ ಅಥವಾ ವಿಳಾಸವನ್ನು ಬರೆಯಿರಿ.',
    step3Title: '3. ಆಸ್ಪತ್ರೆ ಮತ್ತು ನೆರವು ಪಡೆಯಿರಿ',
    step3Desc: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳ ವಿವರಗಳು ಮತ್ತು ತುರ್ತು ಸಂಖ್ಯೆಗಳನ್ನು ತಕ್ಷಣ ನೋಡಿ.',

    catAccident: 'ರಸ್ತೆ ಅಪಘಾತ',
    catMedical: 'ವೈದ್ಯಕೀಯ ತುರ್ತು',
    catFire: 'ಬೆಂಕಿ ಅನಾಹುತ',
    catOther: 'ಇತರ ತುರ್ತು',

    reportStep1Title: 'ಹಂತ 1: ತುರ್ತು ಪ್ರಕಾರ',
    reportStep1Sub: 'ನೀವು ಯಾವ ರೀತಿಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡುತ್ತಿದ್ದೀರಿ?',
    reportStep2Title: 'ಹಂತ 2: ವಿವರಗಳು',
    reportStep2Sub: 'ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ ಮತ್ತು ಐಚ್ಛಿಕ ಫೋಟೋ ನೀಡಿ.',
    reportStep3Title: 'ಹಂತ 3: ಸ್ಥಳ',
    reportStep3Sub: 'ಘಟನೆ ಎಲ್ಲಿ ನಡೆಯುತ್ತಿದೆ?',
    reportStep4Title: 'ಹಂತ 4: ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ',
    reportStep4Sub: 'ಕಳುಹಿಸುವ ಮೊದಲು ವಿವರಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',

    fieldTitle: 'ಘಟನೆಯ ಶೀರ್ಷಿಕೆ',
    fieldTitlePlaceholder: 'ಉದಾ: ರಸ್ತೆ ಅಪಘಾತ, ಕಟ್ಟಡದಿಂದ ಹೊಗೆ',
    fieldDesc: 'ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ *',
    fieldDescPlaceholder: 'ನೀವು ನೋಡಿದ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ...',
    fieldPeopleAffected: 'ಬಾಧಿತ ಜನರ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
    fieldPeopleAffectedHelp: 'ಗೊತ್ತಿಲ್ಲದಿದ್ದರೆ ಖಾಲಿ ಬಿಡಿ.',
    fieldUploadImage: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ)',
    fieldUploadImageHelp: '5MB ಗಿಂತ ಕಡಿಮೆ ಇರುವ ಚಿತ್ರ.',
    fieldLocationAddress: 'ಸ್ಥಳ / ವಿಳಾಸ *',
    fieldLocationPlaceholder: 'ವಿಳಾಸ ನಮೂದಿಸಿ ಅಥವಾ GPS ಬಳಸಿ',
    fieldReporterName: 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)',
    fieldReporterPhone: 'ಫೋನ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',

    gpsAcquired: 'GPS ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪಡೆಯಲಾಗಿದೆ.',
    gpsManualFallback: 'GPS ಅಲಭ್ಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ವಿಳಾಸವನ್ನು ನೇರವಾಗಿ ಬರೆಯಿರಿ.',
    gpsLocating: 'ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',

    reportSubmittedTitle: 'ತುರ್ತು ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
    reportSubmittedDesc: 'ನಿಮ್ಮ ವರದಿ ದಾಖಲಾಗಿದೆ. ತೀವ್ರ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ನೇರವಾಗಿ 112 ಅಥವಾ 108 ಗೆ ಕರೆ ಮಾಡಿ.',
    incidentIdLabel: 'ವರದಿ ಐಡಿ',
    fileAnotherReport: 'ಮತ್ತೊಂದು ವರದಿ ಸಲ್ಲಿಸಿ',
    goToDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನೋಡಿ',

    dashboardTitle: 'ತುರ್ತು ಸ್ಪಂದನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    dashboardSub: 'ದಾಖಲಾದ ಎಲ್ಲಾ ವರದಿಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ.',
    statTotalReports: 'ಒಟ್ಟು ವರದಿಗಳು',
    statPendingReports: 'ಬಾಕಿ ವರದಿಗಳು',
    statUnderReview: 'ಪರಿಶೀಲನೆಯಲ್ಲಿರುವವು',
    statResolvedReports: 'ಪರಿಹರಿಸಲಾದವು',
    tableId: 'ವರದಿ ಐಡಿ',
    tableType: 'ತುರ್ತು ಪ್ರಕಾರ',
    tableLocation: 'ಸ್ಥಳ',
    tableDate: 'ದಿನಾಂಕ & ಸಮಯ',
    tableStatus: 'ಸ್ಥಿತಿ',
    tableAction: 'ಕ್ರಿಯೆ',

    statusPending: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    statusUnderReview: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusActionRecorded: 'ಕ್ರಮ ದಾಖಲಾಗಿದೆ',
    statusResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',

    hospitalsTitle: 'ಹತ್ತಿರದ ತುರ್ತು ಆಸ್ಪತ್ರೆಗಳು',
    hospitalsSub: 'ನಿಮ್ಮ ಹತ್ತಿರವಿರುವ 24/7 ತುರ್ತು ಆರೈಕೆ ಕೇಂದ್ರಗಳು.',
    hospitalSearchPlaceholder: 'ಆಸ್ಪತ್ರೆ ಹೆಸರು ಅಥವಾ ಪ್ರದೇಶದಿಂದ ಹುಡುಕಿ...',
    hospitalDistance: 'ದೂರ',
    hospitalOpen247: '24/7 ತುರ್ತು ಸೇವೆ',
    hospitalEmergencyWard: 'ತುರ್ತು ಚಿಕಿತ್ಸಾ ವಿಭಾಗ',

    safetyDisclaimer: 'ಸೂಚನೆ: AutoResQ ಒಂದು ಪ್ರಾಯೋಗಿಕ ವರದಿ ವೇದಿಕೆಯಾಗಿದೆ. ತಕ್ಷಣದ ಜೀವ ರಕ್ಷಣೆಗೆ 112 ಅಥವಾ 108 ಗೆ ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ.',
    hotlineEmergency: 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು: 112',
    hotlineAmbulance: 'ಆಂಬ್ಯುಲೆನ್ಸ್: 108',
    hotlineFire: 'ಅಗ್ನಿಶಾಮಕ: 101',
    hotlinePolice: 'ಪೊಲೀಸ್: 100',

    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    errorRequiredField: 'ದಯವಿಟ್ಟು ಈ ಮಾಹಿತಿಯನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
    errorSubmissionFailed: 'ವರದಿ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
    demoModeNotice: 'ಡೆಮೊ ಮೋಡ್: ಹ್ಯಾಕಥಾನ್ ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ಮಾದರಿ ಡೇಟಾ.',

    voiceTapToSpeak: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    voiceListening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ',
    voiceStop: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    voiceNotSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.',
    voicePermissionDenied: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.',
    voiceTryAgain: 'ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಪುನಃ ಪ್ರಯತ್ನಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ.'
  },

  ml: {
    appName: 'AutoResQ',
    tagline: 'വേഗത്തിലുള്ള റിപ്പോർട്ടിംഗ്. മികച്ച അടിയന്തര സഹായം.',
    heroHeading: 'ഞങ്ങൾ നിങ്ങൾക്ക് എങ്ങനെ സഹായിക്കാം?',
    heroSubheading: '60 സെക്കൻഡിനുള്ളിൽ അടിയന്തര സാഹചര്യം റിപ്പോർട്ട് ചെയ്യുക അല്ലെങ്കിൽ അടുത്തുള്ള ആശുപത്രികൾ കണ്ടെത്തുക.',

    reportEmergencyBtn: 'അടിയന്തര റിപ്പോർട്ട് നൽകുക',
    findHospitalsBtn: 'അടുത്തുള്ള ആശുപത്രികൾ',
    submitReportBtn: 'റിപ്പോർട്ട് സമർപ്പിക്കുക',
    useMyLocationBtn: 'എന്റെ ലൊക്കേഷൻ ഉപയോഗിക്കുക',
    nextStepBtn: 'അടുത്ത ഘട്ടം',
    backBtn: 'പിന്നോട്ട്',
    callNowBtn: 'വിളിക്കുക',
    directionsBtn: 'വഴി കാട്ടുക',
    viewDetailsBtn: 'വിവരങ്ങൾ കാണുക',

    navHome: 'ഹോം',
    navReport: 'അടിയന്തര റിപ്പോർട്ട്',
    navHospitals: 'ആശുപത്രികൾ',
    navDashboard: 'ഡാഷ്‌ബോർഡ്',
    navHelp: 'സഹായം',

    howItWorksTitle: 'AutoResQ എങ്ങനെ പ്രവർത്തിക്കുന്നു (3 ലളിതമായ ഘട്ടങ്ങൾ)',
    howItWorksSub: 'അടിയന്തര സാഹചര്യങ്ങളിൽ വേഗത്തിലുള്ള നടപടിക്കായി രൂപകൽപ്പന ചെയ്തത്.',
    step1Title: '1. അടിയന്തര വിഭാഗം തിരഞ്ഞെടുക്കുക',
    step1Desc: 'റോഡപകടം, മെഡിക്കൽ അടിയന്തരാവസ്ഥ അല്ലെങ്കിൽ തീപിടുത്തം തിരഞ്ഞെടുക്കുക.',
    step2Title: '2. ലൊക്കേഷൻ വ്യക്തമാക്കുക',
    step2Desc: 'ഒറ്റ ടാപ്പിൽ GPS ഉപയോഗിക്കുക അല്ലെങ്കിൽ വിലാസം ടൈപ്പ് ചെയ്യുക.',
    step3Title: '3. സഹായവും ആശുപത്രി വിവരങ്ങളും നേടുക',
    step3Desc: 'അടുത്തുള്ള ആശുപത്രികളുടെ വിവരങ്ങളും ഹെൽപ്പ്‌ലൈൻ നമ്പറുകളും ഉടൻ കാണുക.',

    catAccident: 'റോഡപകടം',
    catMedical: 'മെഡിക്കൽ എമർജൻസി',
    catFire: 'തീപിടുത്തം',
    catOther: 'മറ്റ് അടിയന്തരാവസ്ഥ',

    reportStep1Title: 'ഘട്ടം 1: അടിയന്തര വിഭാഗം',
    reportStep1Sub: 'ഏത് തരത്തിലുള്ള അടിയന്തരാവസ്ഥയാണ് നിങ്ങൾ റിപ്പോർട്ട് ചെയ്യുന്നത്?',
    reportStep2Title: 'ഘട്ടം 2: വിവരങ്ങൾ',
    reportStep2Sub: 'ചുരുങ്ങിയ വിവരണവും ആവശ്യമെങ്കിൽ ഫോട്ടോയും നൽകുക.',
    reportStep3Title: 'ഘട്ടം 3: ലൊക്കേഷൻ',
    reportStep3Sub: 'സംഭവം എവിടെയാണ് നടക്കുന്നത്?',
    reportStep4Title: 'ഘട്ടം 4: പരിശോധിച്ച് സമർപ്പിക്കുക',
    reportStep4Sub: 'അയക്കുന്നതിന് മുമ്പ് വിവരങ്ങൾ സ്ഥിരീകരിക്കുക.',

    fieldTitle: 'സംഭവ ശീർഷകം',
    fieldTitlePlaceholder: 'ഉദാ: റോഡപകടം, കെട്ടിടത്തിൽ പുക',
    fieldDesc: 'ലഘുവിവരണം *',
    fieldDescPlaceholder: 'കണ്ട സാഹചര്യം വിശദീകരിക്കുക...',
    fieldPeopleAffected: 'ബാധിച്ച ആളുകളുടെ എണ്ണം (ഐച്ഛികം)',
    fieldPeopleAffectedHelp: 'അറിയില്ലെങ്കിൽ ഒഴിഞ്ഞിട്ടിരിക്കുക.',
    fieldUploadImage: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക (ഐച്ഛികം)',
    fieldUploadImageHelp: '5MB വരെയുള്ള ചിത്രം.',
    fieldLocationAddress: 'സ്ഥലം / വിലാസം *',
    fieldLocationPlaceholder: 'വിലാസം നൽകുക അല്ലെങ്കിൽ GPS ഉപയോഗിക്കുക',
    fieldReporterName: 'പേര് (ഐച്ഛികം)',
    fieldReporterPhone: 'ഫോൺ നമ്പർ (ഐച്ഛികം)',

    gpsAcquired: 'GPS ലൊക്കേഷൻ വിജയകരമായി കണ്ടെത്തി.',
    gpsManualFallback: 'GPS ലഭ്യമല്ല. ദയവായി വിലാസം ടൈപ്പ് ചെയ്യുക.',
    gpsLocating: 'ലൊക്കേഷൻ കണ്ടെത്തുന്നു...',

    reportSubmittedTitle: 'അടിയന്തര റിപ്പോർട്ട് വിജയകരമായി സമർപ്പിച്ചു',
    reportSubmittedDesc: 'നിങ്ങളുടെ റിപ്പോർട്ട് രേഖപ്പെടുത്തി. ജീവന് ഭീഷണിയുള്ള സാഹചര്യങ്ങളിൽ ഉടൻ 112 അല്ലെങ്കിൽ 108 ലേക്ക് നേരിട്ട് വിളിക്കുക.',
    incidentIdLabel: 'റിപ്പോർട്ട് ഐഡി',
    fileAnotherReport: 'മറ്റൊരു റിപ്പോർട്ട് നൽകുക',
    goToDashboard: 'ഡാഷ്‌ബോർഡിൽ കാണുക',

    dashboardTitle: 'അടിയന്തര പ്രതികരണ ഡാഷ്‌ബോർഡ്',
    dashboardSub: 'രേഖപ്പെടുത്തിയ എല്ലാ റിപ്പോർട്ടുകളും അവയുടെ നിലവിലെ അവസ്ഥയും.',
    statTotalReports: 'ആകെ റിപ്പോർട്ടുകൾ',
    statPendingReports: 'തീർപ്പുകൽപ്പിക്കാത്തവ',
    statUnderReview: 'പരിശോധനയിലുള്ളവ',
    statResolvedReports: 'പരിഹരിച്ചവ',
    tableId: 'റിപ്പോർട്ട് ഐഡി',
    tableType: 'അടിയന്തര വിഭാഗം',
    tableLocation: 'ലൊക്കേഷൻ',
    tableDate: 'തീയതി & സമയം',
    tableStatus: 'അവസ്ഥ',
    tableAction: 'നടപടി',

    statusPending: 'തീർപ്പുകൽപ്പിക്കാത്തത്',
    statusUnderReview: 'പരിശോധനയിൽ',
    statusActionRecorded: 'നടപടി രേഖപ്പെടുത്തി',
    statusResolved: 'പരിഹരിച്ചു',

    hospitalsTitle: 'അടുത്തുള്ള അടിയന്തര ആശുപത്രികൾ',
    hospitalsSub: 'നിങ്ങൾക്ക് ഏറ്റവും അടുത്തുള്ള 24/7 അത്യാഹിത വിഭാഗങ്ങൾ.',
    hospitalSearchPlaceholder: 'ആശുപത്രിയുടെ പേര് അല്ലെങ്കിൽ പ്രദേശം വഴി തിരയുക...',
    hospitalDistance: 'ദൂരം',
    hospitalOpen247: '24/7 എമർജൻസി കെയർ',
    hospitalEmergencyWard: 'ട്രോമ & അത്യാഹിത വിഭാഗം',

    safetyDisclaimer: 'അറിയിപ്പ്: AutoResQ ഒരു മാതൃകാ റിപ്പോർട്ടിംഗ് പ്ലാറ്റ്‌ഫോമാണ്. അടിയന്തര ജീവൻ രക്ഷാ സഹായത്തിന് നേരിട്ട് 112 അല്ലെങ്കിൽ 108 ലേക്ക് വിളിക്കുക.',
    hotlineEmergency: 'ദേശീയ എമർജൻസി: 112',
    hotlineAmbulance: 'ആംബുലൻസ്: 108',
    hotlineFire: 'ഫയർ ഫോഴ്സ്: 101',
    hotlinePolice: 'പോലീസ്: 100',

    loading: 'വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...',
    errorRequiredField: 'ദയവായി ഈ വിവരങ്ങൾ പൂരിപ്പിക്കുക.',
    errorSubmissionFailed: 'റിപ്പോർട്ട് അയക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.',
    demoModeNotice: 'ഡെമോ മോഡ്: ഹാക്കത്തോൺ വിലയിരുത്തലിനായുള്ള സാമ്പിൾ ഡാറ്റ.',

    voiceTapToSpeak: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    voiceListening: 'കേൾക്കുന്നു... സംസാരിക്കുക',
    voiceStop: 'റെക്കോർഡിംഗ് നിർത്തുക',
    voiceNotSupported: 'ഈ ബ്രൗസറിൽ വോയ്‌സ് ഇൻപുട്ട് ലഭ്യമല്ല. ദയവായി ടൈപ്പ് ചെയ്യുക.',
    voicePermissionDenied: 'മൈക്രോഫോൺ അനുമതി നിരസിച്ചു. ദಯവായി അനുമതി നൽകുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക.',
    voiceTryAgain: 'ശബ്ദം കേൾക്കാനായില്ല. വീണ്ടും ശ്രമിക്കാൻ ടാപ്പ് ചെയ്യുക.'
  },

  bn: {
    appName: 'AutoResQ',
    tagline: 'দ্রুত রিপোর্টিং। বুদ্ধিমান জরুরি সহায়তা।',
    heroHeading: 'আমরা কীভাবে আপনাকে সাহায্য করতে পারি?',
    heroSubheading: '৬০ সেকেন্ডের মধ্যে যেকোনো জরুরি পরিস্থিতি রিপোর্ট করুন বা নিকটস্থ হাসপাতাল খুঁজুন।',

    reportEmergencyBtn: 'জরুরি পরিস্থিতি রিপোর্ট করুন',
    findHospitalsBtn: 'কাছাকাছি হাসপাতাল খুঁজুন',
    submitReportBtn: 'জরুরি রিপোর্ট জমা দিন',
    useMyLocationBtn: 'আমার বর্তমান অবস্থান ব্যবহার করুন',
    nextStepBtn: 'পরবর্তী ধাপ',
    backBtn: 'পেছনে যান',
    callNowBtn: 'কল করুন',
    directionsBtn: 'মানচিত্র ও দিকনির্দেশ',
    viewDetailsBtn: 'বিস্তারিত দেখুন',

    navHome: 'হোম',
    navReport: 'জরুরি রিপোর্ট',
    navHospitals: 'হাসপাতাল',
    navDashboard: 'ড্যাশবোর্ড',
    navHelp: 'সহায়তা',

    howItWorksTitle: 'AutoResQ কীভাবে কাজ করে (৩টি সহজ ধাপে)',
    howItWorksSub: 'জরুরি মুহূর্তে দ্রুত পদক্ষেপের জন্য তৈরি।',
    step1Title: '১. জরুরি ধরন নির্বাচন করুন',
    step1Desc: 'সড়ক দুর্ঘটনা, চিকিৎসা সংকট বা আগুনের ঘটনা বেছে নিন।',
    step2Title: '২. অবস্থান চিহ্নিত করুন',
    step2Desc: 'এক ক্লিকে GPS অবস্থান পান অথবা ঠিকানা লিখুন।',
    step3Title: '৩. সহায়তা ও হাসপাতাল পান',
    step3Desc: 'কাছের হাসপাতাল এবং জরুরি হেল্পলাইন নম্বর তাৎক্ষণিকভাবে দেখুন।',

    catAccident: 'সড়ক দুর্ঘটনা',
    catMedical: 'চিকিৎসা সংকট',
    catFire: 'আগুন',
    catOther: 'অন্যান্য জরুরি',

    reportStep1Title: 'ধাপ ১: জরুরি ধরন',
    reportStep1Sub: 'আপনি কী ধরনের পরিস্থিতি রিপোর্ট করছেন?',
    reportStep2Title: 'ধাপ ২: ঘটনার বিবরণ',
    reportStep2Sub: 'সংক্ষিপ্ত বিবরণ এবং ছবি (ঐচ্ছিক) প্রদান করুন।',
    reportStep3Title: 'ধাপ ৩: অবস্থান',
    reportStep3Sub: 'ঘটনাটি কোথায় ঘটছে?',
    reportStep4Title: 'ধাপ ৪: পর্যালোচনা ও জমা দিন',
    reportStep4Sub: 'পাঠানোর আগে বিবরণ যাচাই করুন।',

    fieldTitle: 'ঘটনার শিরোনাম',
    fieldTitlePlaceholder: 'যেমন: মোড়ে গাড়ি দুর্ঘটনা, ভবনে আগুন ও ধোঁয়া',
    fieldDesc: 'সংক্ষিপ্ত বিবরণ *',
    fieldDescPlaceholder: 'আপনি কী দেখছেন তা লিখুন...',
    fieldPeopleAffected: 'ক্ষতিগ্রস্তের সংখ্যা (ঐচ্ছিক)',
    fieldPeopleAffectedHelp: 'অজানা থাকলে ফাঁকা রাখুন।',
    fieldUploadImage: 'ছবি আপলোড করুন (ঐচ্ছিক)',
    fieldUploadImageHelp: 'সর্বোচ্চ ৫ মেগাবাইট।',
    fieldLocationAddress: 'ঘটনার স্থান / ঠিকানা *',
    fieldLocationPlaceholder: 'ঠিকানা লিখুন অথবা GPS ব্যবহার করুন',
    fieldReporterName: 'আপনার নাম (ঐচ্ছিক)',
    fieldReporterPhone: 'ফোন নম্বর (ঐচ্ছিক)',

    gpsAcquired: 'GPS অবস্থান সফলভাবে চিহ্নিত হয়েছে।',
    gpsManualFallback: 'GPS সংযোগ পাওয়া যায়নি। অনুগ্রহ করে ঠিকানাটি টাইপ করুন।',
    gpsLocating: 'আপনার অবস্থান সনাক্ত করা হচ্ছে...',

    reportSubmittedTitle: 'জরুরি রিপোর্ট সফলভাবে জমা হয়েছে',
    reportSubmittedDesc: 'আপনার রিপোর্ট নথিভুক্ত করা হয়েছে। জরুরি জীবন রক্ষার্থে অবিলম্বে ১১২ বা ১০৮ নম্বরে কল করুন।',
    incidentIdLabel: 'রিপোর্ট আইডি',
    fileAnotherReport: 'আরেকটি রিপোর্ট করুন',
    goToDashboard: 'ড্যাশবোর্ডে দেখুন',

    dashboardTitle: 'জরুরি প্রতিক্রিয়া ড্যাশবোর্ড',
    dashboardSub: 'নথিভুক্ত সকল জরুরি রিপোর্ট ও তাদের বর্তমান অবস্থা।',
    statTotalReports: 'মোট রিপোর্ট',
    statPendingReports: 'অপেক্ষমাণ রিপোর্ট',
    statUnderReview: 'পর্যালোচনাধীন',
    statResolvedReports: 'মীমাংসিত রিপোর্ট',
    tableId: 'রিপোর্ট আইডি',
    tableType: 'জরুরি ধরন',
    tableLocation: 'অবস্থান',
    tableDate: 'তারিখ ও সময়',
    tableStatus: 'অবস্থা',
    tableAction: 'পদক্ষেপ',

    statusPending: 'অপেক্ষমাণ',
    statusUnderReview: 'পর্যালোচনাধীন',
    statusActionRecorded: 'পদক্ষেপ গৃহীত',
    statusResolved: 'মীমাংসিত',

    hospitalsTitle: 'কাছাকাছি জরুরি হাসপাতাল',
    hospitalsSub: 'আপনার নিকটস্থ ২৪/৭ জরুরি ওয়ার্ড ও ট্রমা কেয়ার সেন্টার।',
    hospitalSearchPlaceholder: 'হাসপাতালের নাম বা এলাকা দিয়ে খুঁজুন...',
    hospitalDistance: 'দূরত্ব',
    hospitalOpen247: '২৪/৭ জরুরি পরিষেবা',
    hospitalEmergencyWard: 'ট্রমা ও জরুরি বিভাগ',

    safetyDisclaimer: 'বিজ্ঞপ্তি: AutoResQ একটি সহায়ক রিপোর্টিং প্রোটোটাইপ। জীবন রক্ষার্থে অবিলম্বে ১১২ বা ১০৮ নম্বরে সরাসরি কল করুন।',
    hotlineEmergency: 'জাতীয় জরুরি: ১১২',
    hotlineAmbulance: 'অ্যাম্বুলেন্স: ১০৮',
    hotlineFire: 'দমকল: ১০১',
    hotlinePolice: 'পুলিশ: ১০০',

    loading: 'তথ্য লোড হচ্ছে...',
    errorRequiredField: 'অনুগ্রহ করে এই প্রয়োজনীয় তথ্যটি পূরণ করুন।',
    errorSubmissionFailed: 'রিপোর্ট জমা দেওয়া যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
    demoModeNotice: 'ডেমো মোড: হ্যাকাথন মূল্যায়নের জন্য নমুনা তথ্য দেখানো হচ্ছে।',

    voiceTapToSpeak: 'বলতে ট্যাপ করুন',
    voiceListening: 'শুনছি... এখন কথা বলুন',
    voiceStop: 'রেকর্ডিং থামান',
    voiceNotSupported: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে টাইপ করুন।',
    voicePermissionDenied: 'মাইক্রোফোনের অনুমতি মেলেনি। অনুগ্রহ করে অনুমতি দিন অথবা টাইপ করুন।',
    voiceTryAgain: 'কথা শোনা যায়নি। পুনরায় চেষ্টা করতে ট্যাপ করুন।'
  }
};
