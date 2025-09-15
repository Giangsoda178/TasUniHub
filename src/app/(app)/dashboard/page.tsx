import { getStudySuggestions } from '@/ai/flows/personalized-dashboard-suggestions';
import DashboardClient from './dashboard-client';


const enrolledCourses = [
    { code: 'KNE101', name: 'Engineering Design', grade: 82, status: 'Completed' },
    { code: 'KMA155', name: 'Calculus and Applications', grade: 75, status: 'Completed' },
    { code: 'KIT101', name: 'Programming Fundamentals', grade: null, status: 'In Progress' },
    { code: 'KNE121', name: 'Statics', grade: null, status: 'In Progress' },
];

const upcomingAssignments = [
    { name: 'Programming Assignment 2', course: 'KIT101', due: '2 weeks' },
    { name: 'Statics Problem Set 5', course: 'KNE121', due: '3 weeks' },
    { name: 'Final Exam Preparation', course: 'All', due: '4 weeks' },
];


export default async function DashboardPage() {
  const aiInput = {
    studentId: '123456',
    enrolledCourses: enrolledCourses.map(c => c.name),
    grades: enrolledCourses
        .filter(c => c.grade !== null)
        .reduce((acc, c) => ({...acc, [c.code]: c.grade as number }), {}),
    upcomingAssignments: upcomingAssignments.map(a => `${a.name} for ${a.course}`),
  }
  const { suggestions } = await getStudySuggestions(aiInput);

  return (
    <DashboardClient 
        suggestions={suggestions}
        enrolledCourses={enrolledCourses}
        upcomingAssignments={upcomingAssignments}
    />
  );
}
