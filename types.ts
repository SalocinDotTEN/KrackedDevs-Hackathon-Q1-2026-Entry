
export enum Specialty {
  CARDIOLOGY = 'Cardiology',
  DERMATOLOGY = 'Dermatology',
  GENERAL_PRACTICE = 'General Practice',
  ORTHOPEDICS = 'Orthopedics',
  PEDIATRICS = 'Pediatrics',
  NEUROLOGY = 'Neurology',
  GYNECOLOGY = 'Gynecology',
  OPHTHALMOLOGY = 'Ophthalmology'
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  hospital: string;
  location: string;
  rating: number;
  availability: string[]; // e.g., ["Monday", "Wednesday"]
  experience: number;
  image: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  symptoms: string;
  date: string;
  time: string;
  location: string;
  remindersSet: boolean;
}

export interface MatchResult {
  recommendedSpecialty: Specialty;
  reasoning: string;
  urgency: 'Low' | 'Medium' | 'High';
}
