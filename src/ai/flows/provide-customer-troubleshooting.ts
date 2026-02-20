'use server';
/**
 * @fileOverview This file provides an AI-powered troubleshooting flow for customer computer issues.
 *
 * - provideCustomerTroubleshooting - A function that generates troubleshooting steps or common solutions for a given computer issue.
 * - ProvideCustomerTroubleshootingInput - The input type for the provideCustomerTroubleshooting function.
 * - ProvideCustomerTroubleshootingOutput - The return type for the provideCustomerTroubleshooting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideCustomerTroubleshootingInputSchema = z.object({
  issueDescription: z.string().describe('A detailed description of the computer or laptop hardware/software issue.'),
});
export type ProvideCustomerTroubleshootingInput = z.infer<typeof ProvideCustomerTroubleshootingInputSchema>;

const ProvideCustomerTroubleshootingOutputSchema = z.object({
  troubleshootingSteps: z.string().describe('A markdown-formatted string containing instant troubleshooting steps or common solutions for the described issue.'),
});
export type ProvideCustomerTroubleshootingOutput = z.infer<typeof ProvideCustomerTroubleshootingOutputSchema>;

export async function provideCustomerTroubleshooting(input: ProvideCustomerTroubleshootingInput): Promise<ProvideCustomerTroubleshootingOutput> {
  return provideCustomerTroubleshootingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'troubleshootingPrompt',
  input: {schema: ProvideCustomerTroubleshootingInputSchema},
  output: {schema: ProvideCustomerTroubleshootingOutputSchema},
  prompt: `You are an expert technical support assistant for computer and laptop hardware and software issues.
Your goal is to provide concise, easy-to-follow troubleshooting steps or common solutions to customers based on their issue description.

Instructions:
1. Analyze the provided issue description.
2. Generate a list of 3-5 troubleshooting steps or common solutions that the customer can try.
3. Format the steps as a numbered markdown list.
4. If the issue seems complex or requires professional intervention, include a concluding remark advising them to proceed with a service request if the steps don't work.

Issue Description: {{{issueDescription}}}

Troubleshooting Steps:`,
});

const provideCustomerTroubleshootingFlow = ai.defineFlow(
  {
    name: 'provideCustomerTroubleshootingFlow',
    inputSchema: ProvideCustomerTroubleshootingInputSchema,
    outputSchema: ProvideCustomerTroubleshootingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
