import Image from 'next/image';
import {
  GraduationCap,
  BookOpen,
  Bot,
  Search,
  ChevronRight,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/login-dialog';
import { UTasLogo } from '@/components/icons';
import Link from 'next/link';

const features = [
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: 'Personalized Dashboard',
    description:
      'Your academic life at a glance. See your courses, grades, and AI-powered study tips all in one place.',
    link: '#',
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'Course Search',
    description:
      'Find your next course with ease. Search by keyword, filter by faculty, and plan your degree pathway.',
    link: '#',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'AI Recommendations',
    description:
      'Get smart study recommendations. Our AI suggests relevant resources to help you excel in your courses.',
    link: '#',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <UTasLogo className="h-8 w-8 text-primary" />
            <span className="font-bold sm:inline-block">TasUni Hub</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <LoginDialog />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="https://picsum.photos/seed/utas-hero/1920/1080"
            alt="University of Tasmania campus"
            fill
            className="object-cover"
            priority
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold md:text-6xl">
              Your University, Connected.
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Welcome to TasUni Hub, the central portal for students and staff
              at the University of Tasmania.
            </p>
            <div className="mt-8">
              <LoginDialog>
                <Button size="lg">Get Started</Button>
              </LoginDialog>
            </div>
          </div>
        </section>

        <section id="features" className="container py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              All-in-One University Hub
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              TasUni Hub streamlines your academic journey with powerful,
              easy-to-use tools designed for success.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="flex transform flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <CardHeader className="items-center">{feature.icon}</CardHeader>
                <CardContent className="flex flex-1 flex-col text-center">
                  <CardTitle className="font-headline text-xl">
                    {feature.title}
                  </CardTitle>
                  <p className="mt-2 flex-1 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary">
        <div className="container py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} University of Tasmania. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
