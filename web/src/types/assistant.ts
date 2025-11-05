export type CareSpecialty = 'elderly' | 'children' | 'disability' | 'hospital' | 'companion' | 'special-needs';
export type Weekday = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
export type Language = 'Español' | 'Inglés' | 'Francés' | 'Portugués' | 'Italiano' | 'Alemán';

export interface Assistant {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  specialties: CareSpecialty[];
  yearsExperience: number;
  certifications: string[];
  languages: string[];
  availabilitySchedule?: string;
  availableWeekdays: Weekday[];
  hourlyRate?: number;
  isAvailable: boolean;
  verified: boolean;
  backgroundCheck: boolean;
  preferredAgeGroups: string[];
  maxDistanceKm?: number;
  hasVehicle: boolean;
  hasFirstAid: boolean;
  rating?: number;
  ratingCount?: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssistantFilters {
  specialty?: 'all' | CareSpecialty;
  availability?: 'all' | 'available' | 'unavailable';
  verified?: 'all' | 'verified' | 'unverified';
  minExperience?: number;
  maxHourlyRate?: number;
  weekday?: Weekday | 'all';
  hasFirstAid?: boolean;
  hasVehicle?: boolean;
  searchQuery?: string;
}

export interface AssistantProfile extends Assistant {
  completedJobs: number;
  responseTime: string;
  acceptanceRate: number;
  reviews: AssistantReview[];
}

export interface AssistantReview {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  clientAvatar?: string;
  date: Date;
  jobType: CareSpecialty;
}
