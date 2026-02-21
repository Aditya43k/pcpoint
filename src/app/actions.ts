'use server';

import { z } from 'zod';

const formSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  deviceType: z.enum(['Laptop', 'Desktop', 'Printer', 'Software']),
  brand: z.string().min(1, { message: 'Please select an option.' }),
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
