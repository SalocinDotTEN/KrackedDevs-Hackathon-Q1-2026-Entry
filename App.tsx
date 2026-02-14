
import React, { useState, useEffect } from 'react';
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
  Moon
} from 'lucide-react';
import { Specialty, Doctor, MatchResult, Appointment } from './types';
import { MOCK_DOCTORS } from './constants';
import { getSmartDoctorMatch, getNavigationInstructions } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [navigationTips, setNavigationTips] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
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
      const tips = await getNavigationInstructions(selectedDoctor.hospital, selectedTime);
      setNavigationTips(tips);
      setAppointment(newAppt);
      setStep(4);
    } catch (error) {
      console.error("Logistics generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xl cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center text-white">
              <Heart fill="currentColor" size={24} />
            </div>
            <span>MyKlinik</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-slate-600 dark:text-slate-300 font-medium">
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Hospitals</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Specialists</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Emergency</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="bg-teal-600 dark:bg-teal-500 text-white px-5 py-2 rounded-full font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition">
              My Profile
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
            <h1 className="text-3xl font-bold mb-2">How are you feeling today?</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Describe your symptoms and our AI will match you with the right Malaysian specialist.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Symptoms or Ailment</label>
                <textarea 
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition"
                  placeholder="e.g. Having sharp chest pain when breathing, feeling nauseous for the past 2 days..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleMatchSpecialist}
                disabled={loading || !symptoms.trim()}
                className="w-full bg-teal-600 dark:bg-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-200 dark:hover:shadow-teal-900 transition-all"
              >
                {loading ? 'Analyzing Symptoms...' : (
                  <>
                    Find Best Specialist <Search size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Specialist Matching */}
        {step === 2 && matchResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 rounded-xl">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-teal-900 dark:text-teal-300">AI Recommendation: {matchResult.recommendedSpecialty}</h2>
                  <p className="text-teal-800 dark:text-teal-400 mt-1">{matchResult.reasoning}</p>
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    matchResult.urgency === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 
                    matchResult.urgency === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 
                    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  }`}>
                    Urgency: {matchResult.urgency}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8">Available Doctors Near You</h3>
            <div className="grid gap-4">
              {MOCK_DOCTORS.filter(d => d.specialty === matchResult.recommendedSpecialty || d.specialty === Specialty.GENERAL_PRACTICE).map(doc => (
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
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{doc.specialty} • {doc.experience} years exp</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-lg font-bold">
                        ★ {doc.rating}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1"><MapPin size={16} className="text-teal-600 dark:text-teal-400" /> {doc.hospital}</div>
                      <div className="flex items-center gap-1"><Calendar size={16} className="text-teal-600 dark:text-teal-400" /> Available {doc.availability.join(', ')}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl group-hover:bg-teal-600 dark:group-hover:bg-teal-500 group-hover:text-white transition">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-slate-500 dark:text-slate-400 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition">← Change Symptoms</button>
          </div>
        )}

        {/* Step 3: Schedule Appointment */}
        {step === 3 && selectedDoctor && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-bold mb-6">Schedule with {selectedDoctor.name}</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Preferred Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Available Slot</label>
                  <select 
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-xl p-4 focus:ring-2 focus:ring-teal-500 outline-none border-slate-200 dark:border-slate-700 transition"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    value={selectedTime}
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-200"><Bell size={18} className="text-teal-600 dark:text-teal-400" /> Smart Reminders</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">We'll automatically set reminders via SMS & Email. You'll be notified 2 hours before the appointment with live traffic updates.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button 
                  onClick={handleConfirmAppointment}
                  disabled={!selectedDate || !selectedTime || loading}
                  className="flex-[2] bg-teal-600 dark:bg-teal-500 text-white py-4 rounded-xl font-bold hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 shadow-lg transition"
                >
                  {loading ? 'Finalizing...' : 'Confirm Appointment'}
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Appointment Confirmed!</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Your booking reference: <span className="font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">{appointment.id}</span></p>
              
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl grid grid-cols-2 text-left gap-4">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">Doctor</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{selectedDoctor.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">Date & Time</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{appointment.date} @ {appointment.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">Location</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1"><MapPin size={14} /> {selectedDoctor.hospital}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Car className="text-teal-600 dark:text-teal-400" /> Getting There (Navigation Advice)
              </h3>
              
              <div className="prose prose-teal dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {navigationTips}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 border dark:border-slate-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800 transition">
                  <MapPin className="text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-sm">Open Maps</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 border dark:border-slate-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800 transition">
                  <Car className="text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-sm">Book Grab</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 border dark:border-slate-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800 transition">
                  <Train className="text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-sm">Nearby LRT/MRT</span>
                </button>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 text-slate-500 dark:text-slate-400 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition"
            >
              Start New Inquiry
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white py-12 px-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-2xl mb-4">
              <Heart fill="currentColor" size={28} className="text-teal-400" />
              <span>MyKlinik</span>
            </div>
            <p className="text-slate-400 max-w-md">
              The Malaysian Smart Healthcare Platform. Empowering patients with AI-driven doctor matching and seamless hospital logistics for a healthier nation.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Services</h4>
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
          © {new Date().getFullYear()} MyKlinik Healthcare. All rights reserved. Registered with MOH Malaysia.
        </div>
      </footer>
    </div>
  );
};

export default App;
