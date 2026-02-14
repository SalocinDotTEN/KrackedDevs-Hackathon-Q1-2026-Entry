
import { Doctor, Specialty } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ahmad Rizal',
    specialty: Specialty.CARDIOLOGY,
    hospital: 'Gleneagles Hospital Kuala Lumpur',
    location: 'Jalan Ampang, KL',
    rating: 4.9,
    availability: ['Monday', 'Tuesday', 'Friday'],
    experience: 15,
    image: 'https://picsum.photos/seed/doc1/200/200'
  },
  {
    id: '2',
    name: 'Dr. Sarah Lim',
    specialty: Specialty.DERMATOLOGY,
    hospital: 'Sunway Medical Centre',
    location: 'Bandar Sunway, Selangor',
    rating: 4.8,
    availability: ['Wednesday', 'Thursday', 'Saturday'],
    experience: 10,
    image: 'https://picsum.photos/seed/doc2/200/200'
  },
  {
    id: '3',
    name: 'Dr. Kavitha Raj',
    specialty: Specialty.PEDIATRICS,
    hospital: 'Pantai Hospital Bangsar',
    location: 'Bangsar, KL',
    rating: 4.9,
    availability: ['Monday', 'Thursday'],
    experience: 12,
    image: 'https://picsum.photos/seed/doc3/200/200'
  },
  {
    id: '4',
    name: 'Dr. Mohd Faizal',
    specialty: Specialty.ORTHOPEDICS,
    hospital: 'KPJ Damansara Specialist',
    location: 'Damansara Utama, PJ',
    rating: 4.7,
    availability: ['Tuesday', 'Saturday'],
    experience: 8,
    image: 'https://picsum.photos/seed/doc4/200/200'
  },
  {
    id: '5',
    name: 'Dr. Jane Wong',
    specialty: Specialty.GENERAL_PRACTICE,
    hospital: 'Klinik Kesihatan Bangsar',
    location: 'Bangsar Baru, KL',
    rating: 4.5,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    experience: 20,
    image: 'https://picsum.photos/seed/doc5/200/200'
  }
];

export const MALAYSIAN_STATES = [
  'Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Terengganu', 'Kelantan', 'Kedah', 'Perlis', 'Sabah', 'Sarawak'
];
