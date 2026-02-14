
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
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, University of Malaya (UM)',
      'Master of Medicine (Internal Medicine), UM',
      'Fellowship in Cardiology, National Heart Institute (IJN)'
    ],
    affiliations: [
      'Member of the National Heart Association of Malaysia',
      'Fellow of the American College of Cardiology',
      'Academy of Medicine of Malaysia'
    ],
    testimonials: [
      { name: 'Siti Aminah', comment: 'Dr. Ahmad is very professional and explained my heart condition in a way I could easily understand. Highly recommended!', rating: 5, date: 'Jan 2024' },
      { name: 'Robert Tan', comment: 'Excellent care during my bypass recovery. The best cardiologist in KL.', rating: 5, date: 'Dec 2023' }
    ]
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
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, Monash University Malaysia',
      'MRCP (UK), Royal College of Physicians',
      'Advanced Master in Dermatology, UKM'
    ],
    affiliations: [
      'Member of the Malaysian Dermatological Society',
      'International Society of Dermatology',
      'Dermatological Society of Singapore'
    ],
    testimonials: [
      { name: 'Wei Hong', comment: 'Finally found a cure for my chronic eczema. Dr. Sarah is miracle worker!', rating: 5, date: 'Feb 2024' },
      { name: 'Lisa K.', comment: 'Very gentle and thorough with her skin checks.', rating: 4, date: 'Nov 2023' }
    ]
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, Kasturba Medical College',
      'Masters in Paediatrics, University of Malaya',
      'Specialist Training in Neonatology, Australia'
    ],
    affiliations: [
      'Malaysian Paediatric Association',
      'Royal College of Paediatrics and Child Health (UK)',
      'Perinatal Society of Malaysia'
    ],
    testimonials: [
      { name: 'Mei Ling', comment: 'My kids love Dr. Kavitha. She makes them feel so brave!', rating: 5, date: 'Mar 2024' },
      { name: 'Arjun S.', comment: 'Very patient with new parents. Answered all our 100 questions.', rating: 5, date: 'Jan 2024' }
    ]
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
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MD, Universiti Kebangsaan Malaysia (UKM)',
      'MS Ortho, Universiti Malaya',
      'Fellowship in Sports Medicine & Arthroplasty, Germany'
    ],
    affiliations: [
      'Malaysian Orthopaedic Association (MOA)',
      'International Society of Arthroscopy (ISAKOS)',
      'Academy of Medicine Malaysia'
    ],
    testimonials: [
      { name: 'Johan Ali', comment: 'Successful ACL surgery. Back on the football pitch in 6 months!', rating: 5, date: 'Feb 2024' },
      { name: 'Linda T.', comment: 'Good doctor, very busy but professional.', rating: 4, date: 'Jan 2024' }
    ]
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
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, International Medical University (IMU)',
      'Graduate Diploma in Family Medicine, Academy of Family Physicians of Malaysia'
    ],
    affiliations: [
      'Malaysian Medical Association (MMA)',
      'Academy of Family Physicians of Malaysia',
      'World Organization of Family Doctors (WONCA)'
    ],
    testimonials: [
      { name: 'Tan Sri Lee', comment: 'Our family doctor for 15 years. Extremely reliable and caring.', rating: 5, date: 'Mar 2024' },
      { name: 'Zul H.', comment: 'Short waiting time and effective treatment.', rating: 5, date: 'Oct 2023' }
    ]
  },
  {
    id: '6',
    name: 'Dr. Chen Wei Ming',
    specialty: Specialty.NEUROLOGY,
    hospital: 'Prince Court Medical Centre',
    location: 'Kia Peng, KL',
    rating: 4.9,
    availability: ['Monday', 'Wednesday', 'Thursday'],
    experience: 18,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBChB, University of Edinburgh, UK',
      'MRCP (UK), Royal College of Physicians',
      'Fellowship in Neurology, National Hospital for Neurology and Neurosurgery, London'
    ],
    affiliations: [
      'Malaysian Society of Neurosciences',
      'Fellow of the Royal College of Physicians of Edinburgh',
      'World Federation of Neurology'
    ],
    testimonials: [
      { name: 'Victor Low', comment: 'Dr. Chen is incredibly thorough. He diagnosed my migraines when others couldnt.', rating: 5, date: 'Jan 2024' },
      { name: 'Puan Halimah', comment: 'A very patient and kind neurologist.', rating: 5, date: 'Nov 2023' }
    ]
  },
  {
    id: '7',
    name: 'Dr. Malini Selvaratnam',
    specialty: Specialty.GYNECOLOGY,
    hospital: 'Columbia Asia Hospital PJ',
    location: 'Petaling Jaya, Selangor',
    rating: 4.8,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    experience: 14,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, University of Madras',
      'Master of Obstetrics and Gynaecology, University of Malaya',
      'Member of the Royal College of Obstetricians and Gynaecologists (MRCOG, UK)'
    ],
    affiliations: [
      'Obstetrical and Gynaecological Society of Malaysia (OGSM)',
      'Royal College of Obstetricians and Gynaecologists (RCOG, UK)',
      'Malaysian Medical Council'
    ],
    testimonials: [
      { name: 'Nabila H.', comment: 'Dr. Malini was wonderful throughout my pregnancy. So reassuring.', rating: 5, date: 'Feb 2024' },
      { name: 'Jessica C.', comment: 'Highly skilled surgeon and very empathetic.', rating: 5, date: 'Dec 2023' }
    ]
  },
  {
    id: '8',
    name: 'Dr. Lee Hock Seng',
    specialty: Specialty.OPHTHALMOLOGY,
    hospital: 'Tun Hussein Onn National Eye Hospital',
    location: 'Petaling Jaya, Selangor',
    rating: 4.9,
    availability: ['Wednesday', 'Thursday', 'Friday'],
    experience: 22,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, University of Malaya',
      'Master of Surgery (Ophthalmology), UKM',
      'Fellowship in Vitreoretinal Surgery, Moorfields Eye Hospital, London'
    ],
    affiliations: [
      'Malaysian Society of Ophthalmology',
      'Academy of Medicine of Malaysia',
      'American Academy of Ophthalmology'
    ],
    testimonials: [
      { name: 'Chong K.F.', comment: 'Successful cataract surgery. My vision has never been clearer!', rating: 5, date: 'Mar 2024' },
      { name: 'Samy Nathan', comment: 'The best eye specialist in the country.', rating: 5, date: 'Jan 2024' }
    ]
  },
  {
    id: '9',
    name: 'Dr. Ibrahim Yusof',
    specialty: Specialty.ORTHOPEDICS,
    hospital: 'Assunta Hospital',
    location: 'Petaling Jaya, Selangor',
    rating: 4.6,
    availability: ['Monday', 'Tuesday', 'Thursday'],
    experience: 11,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MD, Universiti Sains Malaysia (USM)',
      'Master of Orthopaedic Surgery, USM',
      'Fellowship in Spine Surgery, Singapore'
    ],
    affiliations: [
      'Malaysian Orthopaedic Association',
      'Spine Society of Malaysia',
      'Asia Pacific Orthopaedic Association'
    ],
    testimonials: [
      { name: 'Kamarul Ariffin', comment: 'Great service and honest advice regarding my slipped disc.', rating: 5, date: 'Feb 2024' },
      { name: 'Wong M.L.', comment: 'Very professional clinic environment.', rating: 4, date: 'Dec 2023' }
    ]
  },
  {
    id: '10',
    name: 'Dr. Stephanie Tan',
    specialty: Specialty.PEDIATRICS,
    hospital: 'Subang Jaya Medical Centre (SJMC)',
    location: 'Subang Jaya, Selangor',
    rating: 4.9,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    experience: 16,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400',
    education: [
      'MBBS, International Medical University (IMU)',
      'MRCPCH (UK), Royal College of Paediatrics and Child Health',
      'Masters in Child Health, University of Leeds, UK'
    ],
    affiliations: [
      'Malaysian Paediatric Association',
      'Royal College of Paediatrics and Child Health',
      'Malaysian Medical Association'
    ],
    testimonials: [
      { name: 'Sarah G.', comment: 'Dr. Stephanie is so gentle with my newborn. We feel very lucky to have her.', rating: 5, date: 'Mar 2024' },
      { name: 'Azwan Ali', comment: 'Fantastic pediatrician. Very knowledgeable.', rating: 5, date: 'Feb 2024' }
    ]
  }
];

export const MALAYSIAN_STATES = [
  'Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Terengganu', 'Kelantan', 'Kedah', 'Perlis', 'Sabah', 'Sarawak'
];
