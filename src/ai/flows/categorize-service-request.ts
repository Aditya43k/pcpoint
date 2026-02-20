'use server';
/**
 * @fileOverview A Genkit flow for categorizing customer service requests and extracting key entities.
 *
 * - categorizeServiceRequest - A function that handles the categorization of a service request.
 * - CategorizeServiceRequestInput - The input type for the categorizeServiceRequest function.
 * - CategorizeServiceRequestOutput - The return type for the categorizeServiceRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeServiceRequestInputSchema = z.object({
  serviceRequestDescription: z.string().describe("A detailed description of the customer's hardware or software issue."),
});
export type CategorizeServiceRequestInput = z.infer<typeof CategorizeServiceRequestInputSchema>;

const CategorizeServiceRequestOutputSchema = z.object({
  category: z.string().describe("The categorized issue type (e.g., 'hardware - laptop screen', 'software - OS corruption', 'peripheral - printer')."),
  keyEntities: z.array(z.string()).describe("An array of key entities or keywords extracted from the service request description."),
});
export type CategorizeServiceRequestOutput = z.infer<typeof CategorizeServiceRequestOutputSchema>;

export async function categorizeServiceRequest(input: CategorizeServiceRequestInput): Promise<CategorizeServiceRequestOutput> {
  return categorizeServiceRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeServiceRequestPrompt',
  input: {schema: CategorizeServiceRequestInputSchema},
  output: {schema: CategorizeServiceRequestOutputSchema},
  prompt: `You are an AI assistant specialized in categorizing IT service requests and extracting essential information.\nYour task is to analyze the provided service request description and assign it a category, along with identifying key entities mentioned.\n\nHere are some example categories you might use:\n- 'hardware - laptop screen'\n- 'hardware - desktop CPU'\n- 'software - OS corruption'\n- 'software - network connectivity'\n- 'software - application malfunction'\n- 'peripheral - printer'\n- 'peripheral - monitor'\n- 'other - general inquiry'\n\nCategorize the following service request description and extract key entities:\n\nService Request Description: {{{serviceRequestDescription}}}`,
});

const categorizeServiceRequestFlow = ai.defineFlow(
  {
    name: 'categorizeServiceRequestFlow',
    inputSchema: CategorizeServiceRequestInputSchema,
    outputSchema: CategorizeServiceRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to categorize service request.');
    }
    return output;
  }
);
