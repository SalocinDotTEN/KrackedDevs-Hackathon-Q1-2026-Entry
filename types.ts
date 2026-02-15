
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

export interface Testimonial {
  name: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  hospital: string;
  location: string;
  coords: Coordinates;
  rating: number;
  availability: string[];
  experience: number;
  image: string;
  education: string[];
  affiliations: string[];
  testimonials: Testimonial[];
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

export interface SuggestedFacility {
  name: string;
  type: string;
  highlight: string;
  coords?: Coordinates;
  website?: string;
}

export interface MatchResult {
  recommendedSpecialty: Specialty;
  reasoning: string;
  urgency: 'Low' | 'Medium' | 'High';
  suggestedFacilities: SuggestedFacility[];
  searchSources: { title: string; uri: string }[];
}
