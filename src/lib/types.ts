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
  status: 'Pending' | 'Scheduled' | 'Declined' | 'In Progress' | 'Awaiting Parts' | 'Completed' | 'Cancelled' | 'Paid';
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  estimatedCompletion?: Timestamp;
  appointmentDate?: Timestamp;
  cost?: number;
  invoiceNotes?: string;
};
