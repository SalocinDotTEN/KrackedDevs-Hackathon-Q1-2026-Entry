
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Heart, Search, Calendar, MapPin, ChevronRight, CheckCircle, AlertCircle,
  Car, Bell, Sun, Moon, ExternalLink, Activity, Languages, ChevronDown, 
  Hospital as HospitalIcon, GraduationCap, Award, MessageSquareQuote, 
  ArrowLeft, Star, ShieldCheck, Map as MapIcon, List as ListIcon
} from 'lucide-react';
import { Specialty, Doctor, MatchResult, Appointment, Testimonial } from './types';
import { MOCK_DOCTORS } from './constants';
import { getSmartDoctorMatch, getNavigationInstructions, NavigationAdvice } from './services/geminiService';
import { translations, Language } from './translations';

// Declare Leaflet global 'L' to fix TypeScript missing reference errors
declare const L: any;

// --- Map Component ---
const MapComponent: React.FC<{ 
  doctors: Doctor[], 
  facilities: MatchResult['suggestedFacilities'],
  onSelectDoctor: (doc: Doctor) => void 
}> = ({ doctors, facilities, onSelectDoctor }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already done
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([3.1390, 101.6869], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB'
      }).addTo(leafletMap.current);
      markersLayer.current = L.layerGroup().addTo(leafletMap.current);
    }

    const map = leafletMap.current;
    const group = markersLayer.current;
    group.clearLayers();

    const bounds: any[] = [];

    // Add Doctor Markers
    doctors.forEach(doc => {
      const marker = L.marker([doc.coords.lat, doc.coords.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-8 h-8 bg-teal-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      });
      
      marker.bindPopup(`
        <div class="p-2 min-w-[150px]">
          <h4 class="font-bold text-slate-800">${doc.name}</h4>
          <p class="text-xs text-slate-500 mb-2">${doc.hospital}</p>
          <button class="w-full bg-teal-600 text-white text-xs py-1.5 rounded font-bold hover:bg-teal-700 transition" id="btn-book-${doc.id}">View Profile</button>
        </div>
      `);

      marker.on('popupopen', () => {
        document.getElementById(`btn-book-${doc.id}`)?.addEventListener('click', () => onSelectDoctor(doc));
      });

      marker.addTo(group);
      bounds.push([doc.coords.lat, doc.coords.lng]);
    });

    // Add Facility Markers
    facilities.forEach(fac => {
      if (fac.coords) {
        const marker = L.marker([fac.coords.lat, fac.coords.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M9 22V12h6v10"/><path d="M2 9h20L12 2 2 9Z"/></svg></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
        });

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-amber-600">${fac.name}</h4>
            <p class="text-[10px] text-slate-500">${fac.type}</p>
            <p class="text-xs my-2">${fac.highlight}</p>
          </div>
        `);
        
        marker.addTo(group);
        bounds.push([fac.coords.lat, fac.coords.lng]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [doctors, facilities, onSelectDoctor]);

  return <div ref={mapRef} className="h-full w-full border border-slate-200 dark:border-slate-800" />;
};

// --- Sub-Components ---
const CyberLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-slate-400 dark:bg-slate-500 rounded-b"></div>
      <div className="grid grid-cols-3 gap-1 p-1 mt-2">
        <div className="h-1 bg-white dark:bg-slate-800 opacity-50"></div>
        <div className="h-1 bg-white dark:bg-slate-800 opacity-50"></div>
        <div className="h-1 bg-white dark:bg-slate-800 opacity-50"></div>
      </div>
    </div>
    <div className="relative z-10 w-7 h-7 bg-[#fee2e2] rounded-full flex items-center justify-center shadow-sm">
      <Heart className="text-red-500 fill-red-500" size={16} />
    </div>
  </div>
);

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [navigationAdvice, setNavigationAdvice] = useState<NavigationAdvice | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved && translations[saved]) return saved;
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ms') return 'ms';
      if (browserLang === 'zh') return 'zh';
      if (browserLang === 'ta') return 'ta';
    }
    return 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const t = translations[lang];

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

  useEffect(() => { localStorage.setItem('language', lang); }, [lang]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation blocked", err)
      );
    }
  }, []);

  const resetToHome = () => {
    setStep(1); setSymptoms(''); setMatchResult(null); setSelectedDoctor(null);
    setSelectedDate(''); setSelectedTime(''); setAppointment(null);
    setNavigationAdvice(null); setViewingProfile(false); setHospitalFilter('');
    setDayFilter(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMatchSpecialist = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const result = await getSmartDoctorMatch(symptoms);
      setMatchResult(result);
      setStep(2);
    } catch (error) {
      console.error("Matching failed", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    if (!matchResult) return [];
    return MOCK_DOCTORS.filter(doc => {
      const matchesSpecialty = doc.specialty === matchResult.recommendedSpecialty || doc.specialty === Specialty.GENERAL_PRACTICE;
      const matchesHospital = hospitalFilter === '' || doc.hospital === hospitalFilter;
      const matchesDay = dayFilter === '' || doc.availability.includes(dayFilter);
      return matchesSpecialty && matchesHospital && matchesDay;
    });
  }, [matchResult, hospitalFilter, dayFilter]);

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setViewingProfile(true);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    setLoading(true);
    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id, doctorName: selectedDoctor.name,
      patientName: 'Malaysian Citizen', symptoms,
      date: selectedDate, time: selectedTime, location: selectedDoctor.hospital,
      remindersSet: true
    };
    try {
      // Pass the selectedDate here to ensure the navigation advice is date-specific
      const advice = await getNavigationInstructions(selectedDoctor.hospital, selectedDate, selectedTime, userLocation);
      setNavigationAdvice(advice); setAppointment(newAppt); setStep(4);
    } finally { setLoading(false); }
  };

  const uniqueHospitals = useMemo(() => Array.from(new Set(MOCK_DOCTORS.map(d => d.hospital))).sort(), []);
  const uniqueDays = useMemo(() => {
    const days = new Set<string>();
    MOCK_DOCTORS.forEach(d => d.availability.forEach(day => days.add(day)));
    return Array.from(days).sort();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetToHome}>
            <CyberLogo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-slate-800 dark:text-white uppercase">Cyber</span>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">Hospitals</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold">
              <Languages size={18} /> {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${step >= num ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-200'}`}>
              {step > num ? <CheckCircle size={20} /> : num}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h1 className="text-3xl font-bold mb-2">{t.hero.title}</h1>
            <p className="text-slate-500 mb-8">{t.hero.subtitle}</p>
            <div className="space-y-6">
              <textarea className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl p-6 min-h-[180px] focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder={t.hero.placeholder} value={symptoms} onChange={e => setSymptoms(e.target.value)} />
              <button onClick={handleMatchSpecialist} disabled={loading || !symptoms.trim()} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-lg">
                {loading ? t.hero.analyzing : <>{t.hero.button} <Search size={20} /></>}
              </button>
            </div>
          </div>
        )}

        {step === 2 && matchResult && !viewingProfile && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-teal-100 dark:border-teal-900/50 flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-teal-600">{t.matching.aiRecommendation}: {matchResult.recommendedSpecialty}</h2>
                <p className="text-slate-500 mt-2">{matchResult.reasoning}</p>
                <div className={`mt-4 inline-block px-4 py-1.5 rounded-full font-bold text-sm ${matchResult.urgency === 'High' ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}>
                  {t.matching.urgency}: {matchResult.urgency}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition ${viewMode === 'list' ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800'}`}><ListIcon size={20} /></button>
                <button onClick={() => setViewMode('map')} className={`p-3 rounded-xl transition ${viewMode === 'map' ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800'}`}><MapIcon size={20} /></button>
              </div>
            </div>

            {viewMode === 'map' ? (
              <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white dark:border-slate-800">
                <MapComponent doctors={filteredDoctors} facilities={matchResult.suggestedFacilities} onSelectDoctor={handleSelectDoctor} />
                <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg border flex items-center gap-3">
                    <div className="w-4 h-4 bg-teal-600 rounded-full"></div>
                    <span className="text-xs font-bold">Booking Doctors</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg border flex items-center gap-3">
                    <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                    <span className="text-xs font-bold">Verified AI Centers</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                   {filteredDoctors.map(doc => (
                     <div key={doc.id} onClick={() => handleSelectDoctor(doc)} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border hover:border-teal-500 cursor-pointer transition flex items-center gap-6 group">
                       <img src={doc.image} className="w-20 h-20 rounded-xl object-cover" />
                       <div className="flex-grow">
                         <h4 className="font-bold group-hover:text-teal-600">{doc.name}</h4>
                         <p className="text-sm text-slate-500">{doc.hospital}</p>
                         <div className="mt-2 flex items-center gap-4 text-xs font-bold text-teal-600">
                           <span>★ {doc.rating}</span>
                           <span>{doc.experience} Years Exp</span>
                         </div>
                       </div>
                       <ChevronRight className="text-slate-300 group-hover:text-teal-600" />
                     </div>
                   ))}
                </div>
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="font-bold text-xl flex items-center gap-2"><ShieldCheck className="text-amber-500" /> {t.matching.realWorldSuggestions}</h3>
                  {matchResult.suggestedFacilities.map((fac, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-amber-500 shadow-sm">
                      <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">{fac.type}</p>
                      <h4 className="font-bold">{fac.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{fac.highlight}</p>
                    </div>
                  ))}
                  
                  {matchResult.searchSources && matchResult.searchSources.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><ExternalLink size={14} /> Medical Data Sources</h4>
                      <div className="space-y-2">
                        {matchResult.searchSources.map((source, i) => (
                          <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-teal-600 hover:underline truncate">
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && viewingProfile && selectedDoctor && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
             <button onClick={() => setViewingProfile(false)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium"><ArrowLeft size={20} /> {t.profile.backToList}</button>
             <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border">
               <div className="h-32 bg-teal-600"></div>
               <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-12">
                 <img src={selectedDoctor.image} className="w-40 h-40 rounded-2xl border-8 border-white dark:border-slate-900 shadow-xl object-cover" />
                 <div className="flex-grow pb-2">
                   <h2 className="text-3xl font-black">{selectedDoctor.name}</h2>
                   <p className="text-teal-600 font-bold">{selectedDoctor.specialty} Specialist</p>
                   <p className="text-slate-500 text-sm mt-1">{selectedDoctor.hospital}</p>
                 </div>
                 <button onClick={() => setStep(3)} className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 shadow-lg">Book Now</button>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-lg">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-600"><GraduationCap /> Education</h3>
                 <ul className="space-y-3">{selectedDoctor.education.map((e, i) => <li key={i} className="text-slate-600 dark:text-slate-400">• {e}</li>)}</ul>
               </div>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-lg">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-600"><MessageSquareQuote /> Testimonials</h3>
                 <div className="space-y-4">{selectedDoctor.testimonials.map((t, i) => <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl italic text-sm text-slate-600 dark:text-slate-400">"{t.comment}" — {t.name}</div>)}</div>
               </div>
             </div>
          </div>
        )}

        {step === 3 && selectedDoctor && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-8">Schedule with {selectedDoctor.name}</h2>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div><label className="block text-sm font-bold mb-2">Date</label><input type="date" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl" onChange={e => setSelectedDate(e.target.value)} /></div>
                 <div><label className="block text-sm font-bold mb-2">Time</label><select className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl" onChange={e => setSelectedTime(e.target.value)}><option value="">Select Time</option><option>09:00 AM</option><option>02:00 PM</option></select></div>
               </div>
               <button onClick={handleConfirmAppointment} className="w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-teal-700 shadow-lg transition disabled:opacity-50" disabled={!selectedDate || !selectedTime || loading}>
                 {loading ? "Analyzing Logistics..." : "Confirm Booking"}
               </button>
            </div>
          </div>
        )}

        {step === 4 && appointment && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in">
             <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border-t-8 border-teal-500 text-center">
               <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div>
               <h2 className="text-4xl font-black uppercase">Confirmed!</h2>
               <p className="text-slate-500 mt-2">Ref: <span className="text-teal-600 font-mono font-bold uppercase">{appointment.id}</span></p>
               <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor</p>
                   <p className="font-bold">{appointment.doctorName}</p>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Timing</p>
                   <p className="font-bold">{appointment.date} @ {appointment.time}</p>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                   <p className="font-bold">{appointment.location}</p>
                 </div>
               </div>
             </div>
             {navigationAdvice && (
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border">
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Car className="text-teal-600" /> Getting There Safely</h3>
                 <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{navigationAdvice.text}</div>
                 
                 {navigationAdvice.sources && navigationAdvice.sources.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                     <p className="text-xs font-bold text-slate-400 uppercase mb-3">Live Transport Sources</p>
                     <div className="flex flex-wrap gap-3">
                       {navigationAdvice.sources.map((source, i) => (
                         <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full hover:bg-teal-100 transition">
                           {source.title} <ExternalLink size={12} />
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             )}
             <button onClick={resetToHome} className="w-full text-slate-400 font-bold hover:text-teal-600 transition">Start New Search</button>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 py-16 text-center text-white mt-auto">
        <CyberLogo className="w-12 h-12 mx-auto mb-4" />
        <p className="text-slate-400">Powered by Gemini AI for Malaysian Healthcare Excellence.</p>
      </footer>
    </div>
  );
};

export default App;
