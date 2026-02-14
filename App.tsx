
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Car,
  Train,
  Bell,
  Sun,
  Moon,
  ExternalLink,
  Activity,
  Languages,
  ChevronDown,
  Filter,
  Stethoscope,
  Hospital as HospitalIcon,
  GraduationCap,
  Award,
  MessageSquareQuote,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Specialty, Doctor, MatchResult, Appointment, Testimonial } from './types';
import { MOCK_DOCTORS } from './constants';
import { getSmartDoctorMatch, getNavigationInstructions, NavigationAdvice } from './services/geminiService';
import { translations, Language } from './translations';

const CyberLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Stylized Hospital Building Background */}
    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-slate-400 dark:bg-slate-500 rounded-b"></div>
      <div className="grid grid-cols-3 gap-1 p-1 mt-2">
        <div className="h-1 bg-white dark:bg-slate-800 opacity-50"></div>
        <div className="h-1 bg-white dark:bg-slate-800 opacity-50"></div>
        <div className="h-1 bg-white dark:bg-slate-800 opacity-50"></div>
      </div>
    </div>
    {/* The Heart/Stethoscope Overlay Centerpiece */}
    <div className="relative z-10 w-7 h-7 bg-[#fee2e2] rounded-full flex items-center justify-center shadow-sm">
      <Heart className="text-red-500 fill-red-500" size={16} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-red-600/30 rotate-45"></div>
      </div>
    </div>
    {/* Small Cross Top */}
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-700">
      <div className="w-2 h-2 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-[8px]">+</div>
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
  
  // Filtering States
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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation blocked or failed", err)
      );
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleMatchSpecialist = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const result = await getSmartDoctorMatch(symptoms);
      setMatchResult(result);
      setHospitalFilter(''); // Reset filters on new match
      setDayFilter('');
      setStep(2);
    } catch (error) {
      console.error("Matching failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setViewingProfile(true);
  };

  const startBooking = () => {
    setViewingProfile(false);
    setStep(3);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    setLoading(true);
    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientName: 'Malaysian Citizen',
      symptoms,
      date: selectedDate,
      time: selectedTime,
      location: selectedDoctor.hospital,
      remindersSet: true
    };
    
    try {
      const advice = await getNavigationInstructions(selectedDoctor.hospital, selectedTime, userLocation);
      setNavigationAdvice(advice);
      setAppointment(newAppt);
      setStep(4);
    } catch (error) {
      console.error("Logistics generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized Filter Data
  const filteredDoctors = useMemo(() => {
    if (!matchResult) return [];
    return MOCK_DOCTORS.filter(doc => {
      const matchesSpecialty = doc.specialty === matchResult.recommendedSpecialty || doc.specialty === Specialty.GENERAL_PRACTICE;
      const matchesHospital = hospitalFilter === '' || doc.hospital === hospitalFilter;
      const matchesDay = dayFilter === '' || doc.availability.includes(dayFilter);
      return matchesSpecialty && matchesHospital && matchesDay;
    });
  }, [matchResult, hospitalFilter, dayFilter]);

  const uniqueHospitals = useMemo(() => {
    return Array.from(new Set(MOCK_DOCTORS.map(d => d.hospital))).sort();
  }, []);

  const uniqueDays = useMemo(() => {
    const days = new Set<string>();
    MOCK_DOCTORS.forEach(d => d.availability.forEach(day => days.add(day)));
    return Array.from(days).sort();
  }, []);

  const langNames = {
    en: "English",
    ms: "Bahasa Malaysia",
    zh: "中文",
    ta: "தமிழ்"
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <CyberLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase">Cyber</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase">Hospitals</span>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-8 text-slate-600 dark:text-slate-300 font-medium">
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition">{t.navbar.hospitals}</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition">{t.navbar.specialists}</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition">{t.navbar.emergency}</a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <Languages size={18} />
                <span className="hidden sm:inline font-medium uppercase">{lang}</span>
                <ChevronDown size={14} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl z-[60] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {(Object.keys(langNames) as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-teal-50 dark:hover:bg-teal-900/30 transition ${lang === l ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-900/10' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      <span>{langNames[l]}</span>
                      {lang === l && <CheckCircle size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="hidden sm:block bg-teal-600 dark:bg-teal-500 text-white px-5 py-2 rounded-full font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition">
              {t.navbar.profile}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Progress Bar */}
        <div className="mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
          {[1, 2, 3, 4].map((num) => (
            <div 
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step >= num 
                ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-2 border-slate-200 dark:border-slate-800'
              }`}
            >
              {step > num ? <CheckCircle size={20} /> : num}
            </div>
          ))}
        </div>

        {/* Step 1: Symptom Entry */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h1 className="text-3xl font-bold mb-2">{t.hero.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{t.hero.subtitle}</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.hero.symptomsLabel}</label>
                <textarea 
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition shadow-sm"
                  placeholder={t.hero.placeholder}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleMatchSpecialist}
                disabled={loading || !symptoms.trim()}
                className="w-full bg-teal-600 dark:bg-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-200 dark:hover:shadow-teal-900 transition-all"
              >
                {loading ? t.hero.analyzing : (
                  <>
                    {t.hero.button} <Search size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Specialist Matching */}
        {step === 2 && matchResult && !viewingProfile && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 rounded-xl">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-teal-900 dark:text-teal-300">{t.matching.aiRecommendation}: {matchResult.recommendedSpecialty}</h2>
                  <p className="text-teal-800 dark:text-teal-400 mt-1">{matchResult.reasoning}</p>
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    matchResult.urgency === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 
                    matchResult.urgency === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 
                    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  }`}>
                    {t.matching.urgency}: {matchResult.urgency}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
              <h3 className="text-2xl font-bold">{t.matching.availableDoctors}</h3>
              
              {/* Filters Bar */}
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select 
                    value={hospitalFilter}
                    onChange={(e) => setHospitalFilter(e.target.value)}
                    className="appearance-none bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg pl-8 pr-8 py-2 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none transition"
                  >
                    <option value="">{t.matching.allHospitals}</option>
                    {uniqueHospitals.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-400" />
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="relative">
                  <select 
                    value={dayFilter}
                    onChange={(e) => setDayFilter(e.target.value)}
                    className="appearance-none bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg pl-8 pr-8 py-2 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none transition"
                  >
                    <option value="">{t.matching.allDays}</option>
                    {uniqueDays.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-400" />
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => (
                  <div 
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl dark:hover:shadow-teal-950/20 hover:border-teal-200 dark:hover:border-teal-800 transition-all cursor-pointer group"
                    onClick={() => handleSelectDoctor(doc)}
                  >
                    <img src={doc.image} alt={doc.name} className="w-24 h-24 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">{doc.name}</h4>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">{doc.specialty} • {doc.experience} {t.matching.exp}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-lg font-bold">
                          ★ {doc.rating}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1"><MapPin size={16} className="text-teal-600 dark:text-teal-400" /> {doc.hospital}</div>
                        <div className="flex items-center gap-1"><Calendar size={16} className="text-teal-600 dark:text-teal-400" /> {t.matching.availableOn} {doc.availability.join(', ')}</div>
                      </div>
                      <div className="mt-2 text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Activity size={12} /> {t.matching.viewProfile}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl group-hover:bg-teal-600 dark:group-hover:bg-teal-500 group-hover:text-white transition">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-dashed dark:border-slate-800">
                  <Filter size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No doctors found matching your filters.</p>
                  <button 
                    onClick={() => {setHospitalFilter(''); setDayFilter('');}}
                    className="mt-4 text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setStep(1)} className="text-slate-500 dark:text-slate-400 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition">{t.matching.changeSymptoms}</button>
          </div>
        )}

        {/* Doctor Profile View */}
        {step === 2 && viewingProfile && selectedDoctor && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
            <button 
              onClick={() => setViewingProfile(false)}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition"
            >
              <ArrowLeft size={20} /> {t.profile.backToList}
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="h-32 bg-gradient-to-r from-teal-600 to-slate-800"></div>
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-32 h-32 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl object-cover" />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 border-2 border-white dark:border-slate-900">
                    <Star size={14} fill="currentColor" /> {selectedDoctor.rating}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">{selectedDoctor.name}</h2>
                    <p className="text-teal-600 dark:text-teal-400 font-bold text-lg">{selectedDoctor.specialty} Specialist</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><HospitalIcon size={18} /> {selectedDoctor.hospital}</span>
                      <span className="flex items-center gap-1.5"><Award size={18} /> {selectedDoctor.experience}+ {t.matching.exp}</span>
                    </div>
                  </div>
                  <button 
                    onClick={startBooking}
                    className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 dark:hover:bg-teal-600 shadow-lg hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {t.profile.bookNow} <Calendar size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education & Affiliations */}
              <div className="space-y-8">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl transition-colors">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-100">
                    <GraduationCap className="text-teal-600 dark:text-teal-400" /> {t.profile.education}
                  </h3>
                  <ul className="space-y-4">
                    {selectedDoctor.education.map((item, i) => (
                      <li key={i} className="flex gap-4 group">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-teal-200 dark:bg-teal-800 group-hover:bg-teal-500 transition-colors shrink-0"></div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl transition-colors">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-100">
                    <Award className="text-teal-600 dark:text-teal-400" /> {t.profile.affiliations}
                  </h3>
                  <ul className="space-y-4">
                    {selectedDoctor.affiliations.map((item, i) => (
                      <li key={i} className="flex gap-4 group">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-teal-200 dark:bg-teal-800 group-hover:bg-teal-500 transition-colors shrink-0"></div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Testimonials */}
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl transition-colors h-fit">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-100">
                  <MessageSquareQuote className="text-teal-600 dark:text-teal-400" /> {t.profile.testimonials}
                </h3>
                <div className="space-y-6">
                  {selectedDoctor.testimonials.map((test, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl relative transition-all hover:translate-x-1 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{test.name}</span>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star key={starIdx} size={12} fill={starIdx < test.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">"{test.comment}"</p>
                      <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">{test.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Step 3: Schedule Appointment */}
        {step === 3 && selectedDoctor && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-bold mb-6">{t.booking.scheduleTitle} {selectedDoctor.name}</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t.booking.dateLabel}</label>
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition shadow-sm"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t.booking.slotLabel}</label>
                  <select 
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition shadow-sm"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    value={selectedTime}
                  >
                    <option value="">{t.booking.selectTime}</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-200"><Bell size={18} className="text-teal-600 dark:text-teal-400" /> {t.booking.remindersTitle}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{t.booking.remindersText}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {setStep(2); setViewingProfile(true);}}
                  className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {t.booking.back}
                </button>
                <button 
                  onClick={handleConfirmAppointment}
                  disabled={!selectedDate || !selectedTime || loading}
                  className="flex-[2] bg-teal-600 dark:bg-teal-500 text-white py-4 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 shadow-lg transition"
                >
                  {loading ? t.booking.finalizing : t.booking.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Confirmation & Instructions */}
        {step === 4 && appointment && selectedDoctor && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border-2 border-teal-500 text-center transition-colors">
              <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.confirmation.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">{t.confirmation.reference} <span className="font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">{appointment.id}</span></p>
              
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl grid grid-cols-2 text-left gap-4">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">{t.confirmation.doctorLabel}</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{selectedDoctor.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">{t.confirmation.dateTimeLabel}</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{appointment.date} @ {appointment.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">{t.confirmation.locationLabel}</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1"><MapPin size={14} /> {selectedDoctor.hospital}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Car className="text-teal-600 dark:text-teal-400" /> {t.confirmation.gettingThere}
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold animate-pulse">
                  <Activity size={14} /> {t.confirmation.liveTraffic}
                </div>
              </div>
              
              <div className="prose prose-teal dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mb-6">
                {navigationAdvice?.text}
              </div>

              {navigationAdvice?.sources && navigationAdvice.sources.length > 0 && (
                <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3 flex items-center gap-1">
                    <ExternalLink size={12} /> {t.confirmation.sourcesLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {navigationAdvice.sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all flex items-center gap-1"
                      >
                        {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title} <ChevronRight size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 border dark:border-slate-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800 transition group">
                  <MapPin className="text-teal-600 dark:text-teal-400 group-hover:scale-110 transition" />
                  <span className="font-bold text-sm">Google Maps</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 border dark:border-slate-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800 transition group">
                  <Car className="text-teal-600 dark:text-teal-400 group-hover:scale-110 transition" />
                  <span className="font-bold text-sm">Book Grab</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 border dark:border-slate-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800 transition group">
                  <Train className="text-teal-600 dark:text-teal-400 group-hover:scale-110 transition" />
                  <span className="font-bold text-sm">LRT/MRT Pulse</span>
                </button>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 text-slate-500 dark:text-slate-400 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition"
            >
              {t.confirmation.newInquiry}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white py-12 px-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-2xl mb-4 group cursor-pointer" onClick={() => window.location.reload()}>
              <CyberLogo className="w-12 h-12" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter uppercase">Cyber</span>
                <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">Hospitals</span>
              </div>
            </div>
            <p className="text-slate-400 max-w-md">
              The Malaysian Smart Healthcare Platform by Cyber Hospitals. Empowering patients with AI-driven doctor matching and seamless hospital logistics for a healthier nation.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.navbar.hospitals}</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition">Tele-consultation</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Health Screening</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Vaccinations</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Medicine Delivery</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 dark:border-slate-900 mt-12 pt-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Cyber Hospitals Healthcare. All rights reserved. Registered with MOH Malaysia.
        </div>
      </footer>
    </div>
  );
};

export default App;
