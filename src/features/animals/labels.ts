export type AnimalCopy = {
  title: string;
  filters: string;
  sort: string;
  apply: string;
  cancel: string;
  back: string;
  searchPlaceholder: string;
  demoNotice: string;
  speciesLabel: string;
  statusLabel: string;
  zoneLabel: string;
  lastSeenLabel: string;
  all: string;
  tiger: string;
  leopard: string;
  active: string;
  archived: string;
  core: string;
  buffer: string;
  today: string;
  yesterday: string;
  daysAgo: string;
  last7: string;
  last30: string;
  sortBy: string;
  mostRecent: string;
  codeAZ: string;
  grid: string;
  list: string;
  resultCount: string;
  noResults: string;
  clearFilters: string;
  sightings: string;
  profile: string;
  firstSeen: string;
  sex: string;
  ageClass: string;
  lastKnownLocation: string;
  cameraTrap: string;
  fieldCapture: string;
  female: string;
  male: string;
  adult: string;
  subadult: string;
  internalIdNote: string;
  notFound: string;
  notes: string;
};

const copies: Record<'en' | 'hi' | 'mr', AnimalCopy> = {
  en: {
    title: 'Animals',
    filters: 'Filters',
    sort: 'Sort',
    apply: 'Apply',
    cancel: 'Cancel',
    back: 'Back',
    searchPlaceholder: 'Search by code or name',
    demoNotice: 'Illustrative demo records — not live data.',
    speciesLabel: 'Species',
    statusLabel: 'Status',
    zoneLabel: 'Zone',
    lastSeenLabel: 'Last seen',
    all: 'All',
    tiger: 'Tiger',
    leopard: 'Leopard',
    active: 'Active',
    archived: 'Archived',
    core: 'Core',
    buffer: 'Buffer',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: '{n} days ago',
    last7: 'Last 7 days',
    last30: 'Last 30 days',
    sortBy: 'Sort by',
    mostRecent: 'Most recent',
    codeAZ: 'Code A–Z',
    grid: 'Grid',
    list: 'List',
    resultCount: '{count} animals',
    noResults: 'No animals match these filters.',
    clearFilters: 'Clear filters',
    sightings: 'Sightings',
    profile: 'Animal profile',
    firstSeen: 'First seen',
    sex: 'Sex',
    ageClass: 'Age class',
    lastKnownLocation: 'Last known location',
    cameraTrap: 'Camera trap',
    fieldCapture: 'Field capture',
    female: 'Female',
    male: 'Male',
    adult: 'Adult',
    subadult: 'Subadult',
    internalIdNote: 'Internal ID, not an official forest-department ID.',
    notFound: 'Animal profile not found.',
    notes: 'Notes',
  },
  hi: {
    title: 'वन्यजीव',
    back: 'वापस',
    filters: '\u092b\u093c\u093f\u0932\u094d\u091f\u0930',
    sort: '\u0915\u094d\u0930\u092e',
    apply: '\u0932\u093e\u0917\u0942 \u0915\u0930\u0947\u0902',
    cancel: '\u0930\u0926\u094d\u0926 \u0915\u0930\u0947\u0902',
    searchPlaceholder: 'कोड या नाम से खोजें',
    demoNotice: 'डेमो रिकॉर्ड — वास्तविक डेटा नहीं।',
    speciesLabel: 'प्रजाति',
    statusLabel: 'स्थिति',
    zoneLabel: 'क्षेत्र',
    lastSeenLabel: 'अंतिम बार देखा',
    all: 'सभी',
    tiger: 'बाघ',
    leopard: 'तेंदुआ',
    active: 'सक्रिय',
    archived: 'संग्रहीत',
    core: 'मुख्य क्षेत्र',
    buffer: 'बफर क्षेत्र',
    today: 'आज',
    yesterday: 'कल',
    daysAgo: '{n} दिन पहले',
    last7: 'पिछले 7 दिन',
    last30: 'पिछले 30 दिन',
    sortBy: 'क्रम',
    mostRecent: 'नवीनतम',
    codeAZ: 'कोड A–Z',
    grid: 'ग्रिड',
    list: 'सूची',
    resultCount: '{count} वन्यजीव',
    noResults: 'इन फ़िल्टर से कोई वन्यजीव नहीं मिला।',
    clearFilters: 'फ़िल्टर हटाएँ',
    sightings: 'दर्शन',
    profile: 'वन्यजीव प्रोफ़ाइल',
    firstSeen: 'पहली बार देखा',
    sex: 'लिंग',
    ageClass: 'आयु वर्ग',
    lastKnownLocation: 'अंतिम ज्ञात स्थान',
    cameraTrap: 'कैमरा ट्रैप',
    fieldCapture: 'क्षेत्र में दर्ज',
    female: 'मादा',
    male: 'नर',
    adult: 'वयस्क',
    subadult: 'किशोर',
    internalIdNote: 'यह आंतरिक ID है, आधिकारिक वन विभाग ID नहीं।',
    notFound: 'वन्यजीव प्रोफ़ाइल नहीं मिली।',
    notes: 'टिप्पणियाँ',
  },
  mr: {
    title: 'वन्यजीव',
    back: 'मागे',
    filters: '\u092b\u093f\u0932\u094d\u091f\u0930',
    sort: '\u0915\u094d\u0930\u092e',
    apply: '\u0932\u093e\u0917\u0942 \u0915\u0930\u093e',
    cancel: '\u0930\u0926\u094d\u0926 \u0915\u0930\u093e',
    searchPlaceholder: 'कोड किंवा नावाने शोधा',
    demoNotice: 'डेमो नोंदी — प्रत्यक्ष डेटा नाही.',
    speciesLabel: 'प्रजाती',
    statusLabel: 'स्थिती',
    zoneLabel: 'क्षेत्र',
    lastSeenLabel: 'शेवटचे दर्शन',
    all: 'सर्व',
    tiger: 'वाघ',
    leopard: 'बिबट्या',
    active: 'सक्रिय',
    archived: 'संग्रहित',
    core: 'मुख्य क्षेत्र',
    buffer: 'बफर क्षेत्र',
    today: 'आज',
    yesterday: 'काल',
    daysAgo: '{n} दिवसांपूर्वी',
    last7: 'मागील 7 दिवस',
    last30: 'मागील 30 दिवस',
    sortBy: 'क्रम',
    mostRecent: 'नवीनतम',
    codeAZ: 'कोड A–Z',
    grid: 'ग्रिड',
    list: 'यादी',
    resultCount: '{count} वन्यजीव',
    noResults: 'या फिल्टरमध्ये वन्यजीव आढळले नाहीत.',
    clearFilters: 'फिल्टर साफ करा',
    sightings: 'दर्शने',
    profile: 'वन्यजीव प्रोफाइल',
    firstSeen: 'पहिले दर्शन',
    sex: 'लिंग',
    ageClass: 'वयोगट',
    lastKnownLocation: 'शेवटचे ज्ञात स्थान',
    cameraTrap: 'कॅमेरा ट्रॅप',
    fieldCapture: 'क्षेत्रात नोंद',
    female: 'मादी',
    male: 'नर',
    adult: 'प्रौढ',
    subadult: 'उपप्रौढ',
    internalIdNote: 'ही अंतर्गत ID आहे; अधिकृत वन विभागाची ID नाही.',
    notFound: 'वन्यजीव प्रोफाइल सापडली नाही.',
    notes: 'नोंदी',
  },
};

export function getAnimalCopy(language: string): AnimalCopy {
  if (language === 'hi' || language === 'mr') return copies[language];
  return copies.en;
}

export function formatLastSeen(daysAgo: number, copy: AnimalCopy): string {
  if (daysAgo === 0) return copy.today;
  if (daysAgo === 1) return copy.yesterday;
  return copy.daysAgo.replace('{n}', String(daysAgo));
}