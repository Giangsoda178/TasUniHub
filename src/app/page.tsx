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
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'General FAQ',
    description:
      'Find answers to your most common questions about UTAS and learn more about what we offer',
    link: '#',
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: 'Unit Outlines',
    description:
      'Explore detailed outlines for each ICT unit, including unit objectives and assessment information',
    link: '#',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'Personal Data & Timetable',
    description:
      'Access details about your personal data and timetable, and stay on top of your academic schedule',
    link: '#',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-20 flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <UTasLogo className="h-8 w-8 text-primary" />
            <span className="font-bold sm:inline-block">UTAS Coursemate</span>
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
            alt="UTAS campus"
            fill
            className="object-cover"
            priority
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold md:text-6xl">
              UTAS Coursemate - Your Friendly AI Assistant
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Hi! I am UTAS Coursemate - your friendly AI-powered assistant.
            </p>
            <div className="mt-8">
              <LoginDialog>
                <Button size="lg">Get Started</Button>
              </LoginDialog>
            </div>
          </div>
        </section>

        <section id="features" className="w-full px-20 py-12 md:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              All-in-One Chatbot
            </h2>
            <p className=" mt-5 text-xl text-muted-foreground">
              UTAS Coursemate streamlines your academic journey with a powerful, easy-to-use assistant designed for success.
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
                  <CardTitle className="mb-2 font-headline text-2xl">
                    {feature.title}
                  </CardTitle>
                  <p className="mt-2 mb-3 flex-1 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary">
        <div className="w-full py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UTAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
