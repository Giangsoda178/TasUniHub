'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Course } from '@/lib/types';


const allCourses: Course[] = [
  {
    code: 'KIT101',
    title: 'Programming Fundamentals',
    faculty: 'College of Sciences and Engineering',
    level: 'Undergraduate',
    description: 'An introduction to the fundamental concepts of programming and software development.',
    imageUrl: 'https://picsum.photos/seed/course1/600/400',
    imageHint: 'computer code'
  },
  {
    code: 'KMA155',
    title: 'Calculus and Applications',
    faculty: 'College of Sciences and Engineering',
    level: 'Undergraduate',
    description: 'Explore the concepts of calculus and their applications in various scientific fields.',
    imageUrl: 'https://picsum.photos/seed/math/600/400',
    imageHint: 'math equations'
  },
  {
    code: 'BMA101',
    title: 'Introduction to Management',
    faculty: 'College of Business and Economics',
    level: 'Undergraduate',
    description: 'Learn the core principles of management and organizational behavior.',
    imageUrl: 'https://picsum.photos/seed/business/600/400',
    imageHint: 'business meeting'
  },
  {
    code: 'HGA202',
    title: 'Modern World History',
    faculty: 'College of Arts, Law and Education',
    level: 'Undergraduate',
    description: 'A survey of major global events and transformations from the 19th century to the present.',
    imageUrl: 'https://picsum.photos/seed/history/600/400',
    imageHint: 'historical map'
  },
  {
      code: 'CJA501',
      title: 'Advanced Criminological Theory',
      faculty: 'College of Arts, Law and Education',
      level: 'Postgraduate',
      description: 'A deep dive into advanced theories and methodologies in the field of criminology.',
      imageUrl: 'https://picsum.photos/seed/law/600/400',
      imageHint: 'law books'
  },
  {
      code: 'KNE632',
      title: 'Advanced Structural Engineering',
      faculty: 'College of Sciences and Engineering',
      level: 'Postgraduate',
      description: 'Advanced topics in structural analysis and design, including finite element methods.',
      imageUrl: 'https://picsum.photos/seed/engineering/600/400',
      imageHint: 'bridge structure'
  }
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faculty, setFaculty] = useState('all');
  const [level, setLevel] = useState('all');

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = faculty === 'all' || course.faculty === faculty;
    const matchesLevel = level === 'all' || course.level === level;
    return matchesSearch && matchesFaculty && matchesLevel;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Course Search</h1>
        <p className="text-muted-foreground">
          Find and explore courses offered at the University of Tasmania.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by course code or title..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={faculty} onValueChange={setFaculty}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            <SelectItem value="College of Sciences and Engineering">Sciences & Engineering</SelectItem>
            <SelectItem value="College of Business and Economics">Business & Economics</SelectItem>
            <SelectItem value="College of Arts, Law and Education">Arts, Law & Education</SelectItem>
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Undergraduate">Undergraduate</SelectItem>
            <SelectItem value="Postgraduate">Postgraduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.code} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                data-ai-hint={course.imageHint}
              />
            </div>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.code}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{course.level}</Badge>
                    <Badge variant="secondary">{course.faculty}</Badge>
                </div>
              <Button className="mt-4 w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            <p>No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
