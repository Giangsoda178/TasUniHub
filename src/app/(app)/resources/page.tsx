'use client';

import React, { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { recommendResources, RecommendResourcesOutput } from '@/ai/flows/ai-powered-resource-recommendation';
import { Bot, Link as LinkIcon, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  courseName: z.string().min(2, { message: 'Course name must be at least 2 characters.' }),
  topic: z.string().min(2, { message: 'Topic must be at least 2 characters.' }),
  studentLevel: z.string({ required_error: 'Please select a student level.' }),
});

export default function ResourcesPage() {
  const [isPending, startTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<RecommendResourcesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: '',
      topic: '',
      studentLevel: 'undergraduate',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setRecommendation(null);
    startTransition(async () => {
      try {
        const result = await recommendResources(values);
        setRecommendation(result);
      } catch (error) {
        console.error('AI resource recommendation failed:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to get AI recommendations. Please try again.',
        });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>AI Resource Finder</CardTitle>
            <CardDescription>
              Get personalized study resource recommendations from our AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Programming Fundamentals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Data Structures" {...field} />
                      </FormControl>
                      <FormDescription>What specific concept are you studying?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your academic level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get Recommendations</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle>Your Recommended Resources</CardTitle>
            <CardDescription>
              Here are some materials our AI assistant found for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && (
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <p className="font-semibold">AI is thinking...</p>
                <p className="text-sm text-muted-foreground">
                  Searching for the best resources for your topic. This may take a moment.
                </p>
              </div>
            )}
            {!isPending && !recommendation && (
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <p className="font-semibold">Ready to help!</p>
                <p className="text-sm text-muted-foreground">
                  Fill out the form to get your personalized resource list.
                </p>
              </div>
            )}
            {recommendation && (
              <div className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center mb-2"><Sparkles className="h-4 w-4 mr-2 text-primary" />Reasoning</h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{recommendation.reasoning}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Resources</h3>
                    <ul className="space-y-3">
                        {recommendation.resources.map((resource, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <LinkIcon className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                                <span className="text-sm">{resource}</span>
                            </li>
                        ))}
                    </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
