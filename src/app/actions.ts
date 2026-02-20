'use server';

import { z } from 'zod';
import { suggestTechnicianAssignment } from '@/ai/flows/suggest-technician-assignment';
import type { ServiceRequest, Technician } from '@/lib/types';
import { mockTechnicians } from './lib/data';

const formSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  deviceType: z.enum(['Laptop', 'Desktop', 'Smartphone', 'Tablet', 'Other']),
  osVersion: z.string().min(2),
  issueDescription: z.string().min(20),
  errorMessages: z.string().optional(),
});

export async function submitServiceRequest(formData: unknown) {
  const validatedFields = formSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
    };
  }
  
  // In a real application, you would save this data to a database.
  // For now, we'll just simulate a successful submission.
  const requestId = `SR-${Math.floor(Math.random() * 900) + 100}`;
  console.log('New Service Request:', { id: requestId, ...validatedFields.data });
  
  // Here you can add logic to notify admins, etc.
  
  return {
    success: true,
    requestId,
  };
}

export async function getAiTechnicianSuggestion(request: ServiceRequest) {
  if (!request) {
    return { success: false, error: 'Service request not found.' };
  }

  try {
    const aiInput = {
      serviceRequest: {
        deviceType: request.deviceType,
        issueDescription: request.issueDescription,
        osVersion: request.osVersion,
        errorMessages: request.errorMessages,
      },
      availableTechnicians: mockTechnicians,
    };

    const result = await suggestTechnicianAssignment(aiInput);
    
    return { success: true, suggestion: result.suggestedTechnician };
  } catch (error) {
    console.error('AI suggestion failed:', error);
    return { success: false, error: 'Failed to get AI suggestion.' };
  }
}
