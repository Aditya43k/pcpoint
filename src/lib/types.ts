import type { Timestamp } from 'firebase/firestore';

export type ServiceRequest = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  deviceType: 'Laptop' | 'Desktop' | 'Printer' | 'Software';
  brand: string;
  osVersion: string;
  issueDescription: string;
  errorMessages?: string;
  status: 'Pending' | 'Scheduled' | 'Declined' | 'In Progress' | 'Awaiting Parts' | 'Completed' | 'Cancelled';
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  technicianId?: string;
  technicianNotes?: string;
  estimatedCompletion?: Timestamp;
  appointmentDate?: Timestamp;
};

export type Technician = {
  id: string;
  name: string;
  expertise: string[];
  currentWorkload: number;
};
