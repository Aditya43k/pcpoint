'use server';
/**
 * @fileOverview A Genkit flow for suggesting the most suitable technician for a service request.
 *
 * - suggestTechnicianAssignment - A function that handles the technician assignment suggestion process.
 * - SuggestTechnicianAssignmentInput - The input type for the suggestTechnicianAssignment function.
 * - SuggestTechnicianAssignmentOutput - The return type for the suggestTechnicianAssignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TechnicianSchema = z.object({
  id: z.string().describe('Unique identifier for the technician.'),
  name: z.string().describe('Name of the technician.'),
  expertise: z
    .array(z.string())
    .describe(
      'List of expertise areas for the technician (e.g., "Hardware", "Software", "Windows", "MacOS", "Networking", "Printer Repair", "Data Recovery", "Apple Products").'
    ),
  currentWorkload: z
    .number()
    .describe('Current number of open service requests assigned to the technician.'),
});

const SuggestTechnicianAssignmentInputSchema = z
  .object({
    serviceRequest: z
      .object({
        deviceType: z
          .string()
          .describe(
            'Type of device requiring service (e.g., "Laptop", "Desktop PC", "Smartphone", "Tablet", "Printer", "Server").'
          ),
        issueDescription: z
          .string()
          .describe('Detailed description of the service request issue.'),
        osVersion: z
          .string()
          .optional()
          .describe(
            'Operating System and version, if applicable (e.g., "Windows 11 Pro", "macOS Sonoma 14.2", "iOS 17").'
          ),
        errorMessages: z
          .string()
          .optional()
          .describe('Any specific error messages or codes encountered.'),
      })
      .describe('Details of the service request.'),
    availableTechnicians: z
      .array(TechnicianSchema)
      .describe(
        'List of available technicians with their expertise and current workload.'
      ),
  })
  .describe('Input for suggesting a technician for a service request.');
export type SuggestTechnicianAssignmentInput = z.infer<
  typeof SuggestTechnicianAssignmentInputSchema
>;

const SuggestedTechnicianSchema = z.object({
  id: z.string().describe('Unique identifier of the suggested technician.'),
  name: z.string().describe('Name of the suggested technician.'),
  reasoning: z
    .string()
    .describe(
      'A detailed explanation for why this technician was selected, considering their expertise and current workload relative to the service request.'
    ),
});

const SuggestTechnicianAssignmentOutputSchema = z
  .object({
    suggestedTechnician: SuggestedTechnicianSchema,
  })
  .describe('Output containing the suggested technician and reasoning.');
export type SuggestTechnicianAssignmentOutput = z.infer<
  typeof SuggestTechnicianAssignmentOutputSchema
>;

export async function suggestTechnicianAssignment(
  input: SuggestTechnicianAssignmentInput
): Promise<SuggestTechnicianAssignmentOutput> {
  return suggestTechnicianAssignmentFlow(input);
}

const suggestTechnicianAssignmentPrompt = ai.definePrompt({
  name: 'suggestTechnicianAssignmentPrompt',
  input: {schema: SuggestTechnicianAssignmentInputSchema},
  output: {schema: SuggestTechnicianAssignmentOutputSchema},
  prompt: `You are an expert system designed to assign the most suitable technician to a service request.
Your goal is to suggest ONE technician from the provided list who best matches the service request requirements and has a manageable workload.

Here is the service request details:
Device Type: {{{serviceRequest.deviceType}}}
Issue Description: {{{serviceRequest.issueDescription}}}
{{#if serviceRequest.osVersion}}OS Version: {{{serviceRequest.osVersion}}}
{{/if}}{{#if serviceRequest.errorMessages}}Error Messages: {{{serviceRequest.errorMessages}}}
{{/if}}

Here is a list of available technicians, their expertise, and current workload:
{{#each availableTechnicians}}
- Technician ID: {{{this.id}}}
  Name: {{{this.name}}}
  Expertise: {{#each this.expertise}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Current Workload: {{{this.currentWorkload}}} open tickets
{{/each}}

Based on the service request details, find the technician whose expertise best aligns with the issue and who has the lowest current workload among suitable candidates.
Provide a clear and concise reasoning for your choice, explicitly mentioning how their expertise matches the request and why their workload makes them a good choice.`,
});

const suggestTechnicianAssignmentFlow = ai.defineFlow(
  {
    name: 'suggestTechnicianAssignmentFlow',
    inputSchema: SuggestTechnicianAssignmentInputSchema,
    outputSchema: SuggestTechnicianAssignmentOutputSchema,
  },
  async (input) => {
    const {output} = await suggestTechnicianAssignmentPrompt(input);
    return output!;
  }
);
