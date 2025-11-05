export type CareType = 'children' | 'elderly' | 'disability' | 'hospital';

export type Weekday = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export interface CareRequest {
  id: string;
  title: string;
  careType: CareType;
  personAge: number;
  description: string;
  location: string;
  startDate: Date;
  isRecurring: boolean;
  weekdays?: Weekday[];
  schedule: string;
  hourlyRate: number;
  totalHours: number;
  requirements: string[];
  urgency: 'low' | 'medium' | 'high';
  createdBy: string;
  applicants: number;
  status: 'active' | 'accepted' | 'completed' | 'cancelled';
}

export interface MyRequest extends CareRequest {
  clientName: string;
  clientAvatar: string;
  appliedDate?: Date;
  acceptedDate?: Date;
}


export interface Applicant {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location?: string;
  postedDate?: string;
  applicantsCount: number;
  hourlyRate?: string | number;
  applicants: Applicant[];
}