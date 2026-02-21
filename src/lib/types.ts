export type ServiceRequest = {
  id: string;
  customerName: string;
  customerEmail: string;
  deviceType: 'Laptop' | 'Desktop' | 'Printer';
  brand: string;
  osVersion: string;
  issueDescription: string;
  errorMessages?: string;
  status: 'Pending' | 'In Progress' | 'Awaiting Parts' | 'Completed' | 'Cancelled';
  submittedAt: string;
  updatedAt: string;
  technicianId?: string;
  technicianNotes?: string;
  estimatedCompletion?: string;
};

export type Technician = {
  id: string;
  name: string;
  expertise: string[];
  currentWorkload: number;
};
