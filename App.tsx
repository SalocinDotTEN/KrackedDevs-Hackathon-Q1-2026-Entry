
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
  Star,
  ShieldCheck
} from 'lucide-react';
import { Specialty, Doctor, MatchResult, Appointment, Testimonial } from './types';
import { MOCK_DOCTORS } from './constants';
import { getSmartDoctorMatch, getNavigationInstructions, NavigationAdvice } from './services/geminiService';
import { translations, Language } from './translations';

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
        (err) => console.log("Geolocation blocked", err)
      );
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Smoothly reset the app to home state without a hard reload
  const resetToHome = () => {
    setStep(1);
    setSymptoms('');
    setMatchResult(null);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setAppointment(null);
    setNavigationAdvice(null);
    setViewingProfile(false);
    setHospitalFilter('');
    setDayFilter('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMatchSpecialist = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const result = await getSmartDoctorMatch(symptoms);
      setMatchResult(result);
      setHospitalFilter('');
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

  const langNames = { en: "English", ms: "Bahasa Malaysia", zh: "中文", ta: "தமிழ்" };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetToHome}>
            <CyberLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase">Cyber</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase">Hospitals</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-8 text-slate-600 dark:text-slate-300 font-medium">
            <button onClick={resetToHome} className="hover:text-teal-600 dark:hover:text-teal-400 transition">{t.navbar.hospitals}</button>
            <button onClick={resetToHome} className="hover:text-teal-600 dark:hover:text-teal-400 transition">{t.navbar.specialists}</button>
            <button onClick={resetToHome} className="hover:text-teal-600 dark:hover:text-teal-400 transition text-red-600 font-bold">{t.navbar.emergency}</button>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                <Languages size={18} />
                <span className="hidden sm:inline font-medium uppercase">{lang}</span>
                <ChevronDown size={14} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl z-[60] py-2">
                  {(Object.keys(langNames) as Language[]).map((l) => (
                    <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-teal-50 dark:hover:bg-teal-900/30 transition ${lang === l ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-900/10' : 'text-slate-600 dark:text-slate-300'}`}>
                      <span>{langNames[l]}</span>
                      {lang === l && <CheckCircle size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= num ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-2 border-slate-200 dark:border-slate-800'}`}>
              {step > num ? <CheckCircle size={20} /> : num}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h1 className="text-3xl font-bold mb-2">{t.hero.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{t.hero.subtitle}</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.hero.symptomsLabel}</label>
                <textarea className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition shadow-sm" placeholder={t.hero.placeholder} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
              </div>
              <button onClick={handleMatchSpecialist} disabled={loading || !symptoms.trim()} className="w-full bg-teal-600 dark:bg-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all">
                {loading ? t.hero.analyzing : <>{t.hero.button} <Search size={20} /></>}
              </button>
            </div>
          </div>
        )}

        {step === 2 && matchResult && !viewingProfile && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 rounded-xl">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-teal-900 dark:text-teal-300">{t.matching.aiRecommendation}: {matchResult.recommendedSpecialty}</h2>
                  <p className="text-teal-800 dark:text-teal-400 mt-1">{matchResult.reasoning}</p>
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${matchResult.urgency === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : matchResult.urgency === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>
                    {t.matching.urgency}: {matchResult.urgency}
                  </div>
                </div>
              </div>
            </div>

            {matchResult.suggestedFacilities && matchResult.suggestedFacilities.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ShieldCheck className="text-teal-600 dark:text-teal-400" /> {t.matching.realWorldSuggestions}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matchResult.suggestedFacilities.map((facility, i) => {
                    const matchedSource = matchResult.searchSources.find(s => s.title.toLowerCase().includes(facility.name.toLowerCase()) || facility.name.toLowerCase().includes(s.title.toLowerCase()));
                    return (
                      <div key={i} className="bg-white dark:bg-slate-900 border-2 border-teal-100 dark:border-teal-900 p-5 rounded-2xl shadow-sm hover:border-teal-400 transition-all flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">{facility.type}</p>
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2">{facility.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{facility.highlight}</p>
                        </div>
                        {matchedSource ? (
                          <a href={matchedSource.uri} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline">
                            {t.matching.visitSite} <ExternalLink size={12} />
                          </a>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">Verified Malaysian Facility</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {matchResult.searchSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {matchResult.searchSources.slice(0, 3).map((source, i) => (
                      <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors">
                        Source: {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
              <h3 className="text-2xl font-bold">{t.matching.availableDoctors}</h3>
              <div className="flex flex-wrap gap-2">
                <select value={hospitalFilter} onChange={(e) => setHospitalFilter(e.target.value)} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg px-3 py-2 text-sm">
                  <option value="">{t.matching.allHospitals}</option>
                  {uniqueHospitals.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg px-3 py-2 text-sm">
                  <option value="">{t.matching.allDays}</option>
                  {uniqueDays.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
                <div key={doc.id} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:border-teal-200 transition-all cursor-pointer group" onClick={() => handleSelectDoctor(doc)}>
                  <img src={doc.image} alt={doc.name} className="w-24 h-24 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold group-hover:text-teal-600 transition">{doc.name}</h4>
                        <p className="text-slate-500 font-medium">{doc.specialty} • {doc.experience} {t.matching.exp}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 px-2 py-1 rounded-lg font-bold text-sm">★ {doc.rating}</div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1"><MapPin size={16} className="text-teal-600" /> {doc.hospital}</div>
                      <div className="flex items-center gap-1"><Calendar size={16} className="text-teal-600" /> {t.matching.availableOn} {doc.availability.join(', ')}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center"><button className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition"><ChevronRight size={24} /></button></div>
                </div>
              )) : (
                <div className="p-12 text-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-500 font-medium">No direct booking doctors found matching your filters.</p>
                </div>
              )}
            </div>
            <button onClick={() => setStep(1)} className="text-slate-500 font-medium hover:text-teal-600 transition">{t.matching.changeSymptoms}</button>
          </div>
        )}

        {step === 2 && viewingProfile && selectedDoctor && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
            <button onClick={() => setViewingProfile(false)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium transition"><ArrowLeft size={20} /> {t.profile.backToList}</button>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="h-32 bg-gradient-to-r from-teal-600 to-slate-800"></div>
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-32 h-32 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl object-cover" />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">★ {selectedDoctor.rating}</div>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">{selectedDoctor.name}</h2>
                    <p className="text-teal-600 font-bold text-lg">{selectedDoctor.specialty} Specialist</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-slate-500">
                      <span className="flex items-center gap-1.5"><HospitalIcon size={18} /> {selectedDoctor.hospital}</span>
                      <span className="flex items-center gap-1.5"><Award size={18} /> {selectedDoctor.experience}+ {t.matching.exp}</span>
                    </div>
                  </div>
                  <button onClick={startBooking} className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 shadow-lg transition-all flex items-center justify-center gap-2">{t.profile.bookNow} <Calendar size={20} /></button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><GraduationCap className="text-teal-600" /> {t.profile.education}</h3>
                  <ul className="space-y-4">{selectedDoctor.education.map((item, i) => (<li key={i} className="flex gap-4"><div className="mt-1.5 w-2 h-2 rounded-full bg-teal-200 shrink-0"></div><p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item}</p></li>))}</ul>
                </section>
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Award className="text-teal-600" /> {t.profile.affiliations}</h3>
                  <ul className="space-y-4">{selectedDoctor.affiliations.map((item, i) => (<li key={i} className="flex gap-4"><div className="mt-1.5 w-2 h-2 rounded-full bg-teal-200 shrink-0"></div><p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item}</p></li>))}</ul>
                </section>
              </div>
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl h-fit">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><MessageSquareQuote className="text-teal-600" /> {t.profile.testimonials}</h3>
                <div className="space-y-6">{selectedDoctor.testimonials.map((test, i) => (<div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl relative border"><div className="flex justify-between items-center mb-3"><span className="font-bold">{test.name}</span><div className="flex text-yellow-500 font-bold text-xs">★ {test.rating}</div></div><p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">"{test.comment}"</p><div className="mt-3 text-[10px] text-slate-400 uppercase font-bold tracking-widest">{test.date}</div></div>))}</div>
              </section>
            </div>
          </div>
        )}

        {step === 3 && selectedDoctor && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 transition-colors">
            <h2 className="text-2xl font-bold mb-6">{t.booking.scheduleTitle} {selectedDoctor.name}</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div><label className="block text-sm font-semibold mb-3">{t.booking.dateLabel}</label><input type="date" className="w-full bg-white dark:bg-slate-800 border rounded-xl p-4" onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} /></div>
                <div><label className="block text-sm font-semibold mb-3">{t.booking.slotLabel}</label><select className="w-full bg-white dark:bg-slate-800 border rounded-xl p-4" onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime}><option value="">{t.booking.selectTime}</option><option value="09:00 AM">09:00 AM</option><option value="10:30 AM">10:30 AM</option><option value="02:00 PM">02:00 PM</option><option value="04:00 PM">04:00 PM</option></select></div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-dashed"><h4 className="font-bold flex items-center gap-2 mb-2"><Bell size={18} className="text-teal-600" /> {t.booking.remindersTitle}</h4><p className="text-slate-600 dark:text-slate-400 text-sm">{t.booking.remindersText}</p></div>
              <div className="flex gap-4"><button onClick={() => { setStep(2); setViewingProfile(true); }} className="flex-1 border py-4 rounded-xl font-bold hover:bg-slate-50 transition">{t.booking.back}</button><button onClick={handleConfirmAppointment} disabled={!selectedDate || !selectedTime || loading} className="flex-[2] bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 shadow-lg disabled:opacity-50 transition">{loading ? t.booking.finalizing : t.booking.confirm}</button></div>
            </div>
          </div>
        )}

        {step === 4 && appointment && selectedDoctor && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border-2 border-teal-500 text-center">
              <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div>
              <h2 className="text-3xl font-bold">{t.confirmation.title}</h2>
              <p className="text-slate-500 mt-2">{t.confirmation.reference} <span className="font-mono font-bold text-teal-600 uppercase">{appointment.id}</span></p>
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl grid grid-cols-2 text-left gap-4">
                <div><p className="text-xs uppercase font-bold text-slate-400">{t.confirmation.doctorLabel}</p><p className="font-bold">{selectedDoctor.name}</p></div>
                <div><p className="text-xs uppercase font-bold text-slate-400">{t.confirmation.dateTimeLabel}</p><p className="font-bold">{appointment.date} @ {appointment.time}</p></div>
                <div className="col-span-2"><p className="text-xs uppercase font-bold text-slate-400">{t.confirmation.locationLabel}</p><p className="font-bold flex items-center gap-1"><MapPin size={14} /> {selectedDoctor.hospital}</p></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><Car className="text-teal-600" /> {t.confirmation.gettingThere}</h3><div className="flex items-center gap-2 px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 rounded-full text-xs font-bold animate-pulse"><Activity size={14} /> {t.confirmation.liveTraffic}</div></div>
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mb-6">{navigationAdvice?.text}</div>
              {navigationAdvice?.sources && navigationAdvice.sources.length > 0 && (
                <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border"><p className="text-xs font-bold text-slate-400 uppercase mb-3">{t.confirmation.sourcesLabel}</p><div className="flex flex-wrap gap-2">{navigationAdvice.sources.map((source, i) => (<a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-teal-600 hover:text-teal-700 transition flex items-center gap-1">{source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title} <ChevronRight size={10} /></a>))}</div></div>
              )}
            </div>
            <button onClick={resetToHome} className="w-full py-4 text-slate-500 font-medium hover:text-teal-600 transition">{t.confirmation.newInquiry}</button>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 dark:bg-black text-white py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-2xl mb-4 group cursor-pointer" onClick={resetToHome}>
              <CyberLogo className="w-12 h-12" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black uppercase">Cyber</span>
                <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">Hospitals</span>
              </div>
            </div>
            <p className="text-slate-400 max-w-md">Empowering Malaysian patients with AI-driven doctor matching and live grounded healthcare intelligence.</p>
          </div>
          <div><h4 className="font-bold mb-4">{t.navbar.hospitals}</h4><ul className="space-y-2 text-slate-400"><li>Tele-consultation</li><li>Vaccinations</li></ul></div>
          <div><h4 className="font-bold mb-4">Support</h4><ul className="space-y-2 text-slate-400"><li>Help Center</li><li>Contact Us</li></ul></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
