'use server';
/**
 * @fileOverview AI-powered resource recommendation flow for students.
 *
 * - recommendResources - A function that suggests relevant study resources using AI.
 * - RecommendResourcesInput - The input type for the recommendResources function.
 * - RecommendResourcesOutput - The return type for the recommendResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendResourcesInputSchema = z.object({
  courseName: z.string().describe('The name of the course for which resources are needed.'),
  topic: z.string().describe('The specific topic within the course.'),
  studentLevel: z.string().describe('The academic level of the student (e.g., undergraduate, postgraduate).'),
});
export type RecommendResourcesInput = z.infer<typeof RecommendResourcesInputSchema>;

const RecommendResourcesOutputSchema = z.object({
  resources: z.array(z.string()).describe('A list of relevant study resources (e.g., links to articles, videos, books).'),
  reasoning: z.string().describe('Explanation of why the resources are relevant.'),
});
export type RecommendResourcesOutput = z.infer<typeof RecommendResourcesOutputSchema>;

export async function recommendResources(input: RecommendResourcesInput): Promise<RecommendResourcesOutput> {
  return recommendResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendResourcesPrompt',
  input: {schema: RecommendResourcesInputSchema},
  output: {schema: RecommendResourcesOutputSchema},
  prompt: `You are an AI assistant that recommends study resources for university students.

  Based on the course name, topic, and student level, suggest a list of relevant study resources.
  Explain why each resource is relevant to the student's needs.

  Course Name: {{{courseName}}}
  Topic: {{{topic}}}
  Student Level: {{{studentLevel}}}

  Provide resources and the reasoning behind each recommendation.
  Resources:`,//Make it output as an array of resources
});

const recommendResourcesFlow = ai.defineFlow(
  {
    name: 'recommendResourcesFlow',
    inputSchema: RecommendResourcesInputSchema,
    outputSchema: RecommendResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
