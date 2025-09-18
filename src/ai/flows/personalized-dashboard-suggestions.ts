'use server';

/**
 * @fileOverview AI-powered study organization suggestions for the personalized dashboard.
 *
 * - getStudySuggestions - A function to generate study suggestions for a student.
 * - StudySuggestionsInput - The input type for the getStudySuggestions function.
 * - StudySuggestionsOutput - The return type for the getStudySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudySuggestionsInputSchema = z.object({
  studentId: z.string().describe('The unique identifier of the student.'),
  enrolledUnits: z
    .array(z.string())
    .describe('A list of the student`s enrolled units.'),
  grades: z.record(z.number()).describe('A map of unit IDs to grades.'),
});
export type StudySuggestionsInput = z.infer<typeof StudySuggestionsInputSchema>;

const StudySuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of AI-powered study organization suggestions.'),
});
export type StudySuggestionsOutput = z.infer<typeof StudySuggestionsOutputSchema>;

export async function getStudySuggestions(
  input: StudySuggestionsInput
): Promise<StudySuggestionsOutput> {
  return studySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studySuggestionsPrompt',
  input: {schema: z.object({
    studentId: StudySuggestionsInputSchema.shape.studentId,
    enrolledUnits: StudySuggestionsInputSchema.shape.enrolledUnits,
    grades: z.array(z.string()).describe("A list of units and grades, formatted as 'UnitCode: Grade'."),
  })},
  output: {schema: StudySuggestionsOutputSchema},
  prompt: `You are an AI study assistant helping University of Tasmania students organize their studies.

  Based on the student's enrolled units and grades, provide a list of actionable suggestions to help them manage their time effectively and improve their academic performance.

  Student ID: {{{studentId}}}
  Enrolled Units: {{#each enrolledUnits}}{{{this}}}, {{/each}}
  Grades: {{#each grades}}{{{this}}}, {{/each}}

  Suggestions:
  `,
});

const studySuggestionsFlow = ai.defineFlow(
  {
    name: 'studySuggestionsFlow',
    inputSchema: StudySuggestionsInputSchema,
    outputSchema: StudySuggestionsOutputSchema,
  },
  async input => {
    const gradesAsStrings = Object.entries(input.grades).map(([courseCode, grade]) => `${courseCode}: ${grade}`);

    const {output} = await prompt({
        ...input,
        grades: gradesAsStrings,
    });
    return output!;
  }
);
