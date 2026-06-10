
'use server';

/**
 * @fileOverview Emergency alert analysis flow.
 *
 * This flow analyzes emergency alert data to prioritize responses and suggest appropriate actions.
 * - analyzeEmergencyAlert - A function that analyzes the alert data.
 * - EmergencyAlertInput - The input type for the analyzeEmergencyAlert function.
 * - EmergencyAlertOutput - The return type for the analyzeEmergencyAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyAlertInputSchema = z.object({
  alertDetails: z
    .string()
    .describe('Details of the emergency alert, including location, time, and description of the situation.'),
  vehicleId: z.string().describe('The ID of the vehicle sending the emergency alert.'),
  driverId: z.string().describe('The ID of the driver sending the emergency alert.'),
});
export type EmergencyAlertInput = z.infer<typeof EmergencyAlertInputSchema>;

const EmergencyAlertOutputSchema = z.object({
  priority: z
    .enum(['high', 'medium', 'low'])
    .describe('The priority of the emergency alert, based on the severity of the situation.'),
  suggestedActions: z
    .string()
    .describe('Suggested actions for the dispatcher to take, based on the alert details. This should be a concise, actionable list.'),
  reasoning: z.string().describe('The reasoning behind the assigned priority and suggested actions.'),
});
export type EmergencyAlertOutput = z.infer<typeof EmergencyAlertOutputSchema>;

export async function analyzeEmergencyAlert(
  input: EmergencyAlertInput
): Promise<EmergencyAlertOutput> {
  return analyzeEmergencyAlertFlow(input);
}

const analyzeEmergencyAlertPrompt = ai.definePrompt({
  name: 'analyzeEmergencyAlertPrompt',
  input: {schema: EmergencyAlertInputSchema},
  output: {schema: EmergencyAlertOutputSchema},
  prompt: `You are an expert emergency dispatcher analyzing emergency alerts from vehicles and drivers.

  Based on the alert details, vehicle ID, and driver ID, determine the priority of the alert (high, medium, or low) and suggest appropriate actions for the dispatcher to take.
  Your suggested actions should be clear and concise.
  Explain your reasoning for the assigned priority and suggested actions.

  Alert Details: {{{alertDetails}}}
  Vehicle ID: {{{vehicleId}}}
  Driver ID: {{{driverId}}}

  Consider factors such as the severity of the situation (e.g., collision, medical emergency, mechanical failure), the location of the vehicle (e.g., highway, remote area), and the driver's state (e.g., unresponsive) when determining the priority and suggesting actions.
  Return the output in JSON format.
  `,
});

const analyzeEmergencyAlertFlow = ai.defineFlow(
  {
    name: 'analyzeEmergencyAlertFlow',
    inputSchema: EmergencyAlertInputSchema,
    outputSchema: EmergencyAlertOutputSchema,
  },
  async input => {
    const {output} = await analyzeEmergencyAlertPrompt(input);
    return output!;
  }
);
