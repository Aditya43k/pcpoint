import type { Technician } from './types';

export const mockTechnicians: Technician[] = [
  {
    id: 'tech-001',
    name: 'Alice Johnson',
    expertise: ['Hardware', 'Data Recovery', 'Laptop Repair', 'Apple Products'],
    currentWorkload: 3,
  },
  {
    id: 'tech-002',
    name: 'Bob Williams',
    expertise: ['Software', 'OS Troubleshooting', 'Windows', 'Networking'],
    currentWorkload: 2,
  },
  {
    id: 'tech-003',
    name: 'Charlie Brown',
    expertise: ['Hardware', 'Desktop PC', 'Custom Builds', 'Gaming Rigs'],
    currentWorkload: 4,
  },
  {
    id: 'tech-004',
    name: 'Diana Miller',
    expertise: ['Software', 'macOS', 'Peripheral Repair', 'Printer Repair'],
    currentWorkload: 1,
  },
];
