export type CareType = 'children' | 'elderly' | 'disability' | 'hospital';

export interface CareRequest {
  id: string;
  title: string;
  careType: CareType;
  personAge: number;
  description: string;
  location: string;
  startDate: Date;
  isRecurring: boolean;
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
