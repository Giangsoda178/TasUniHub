import { getStudySuggestions } from '@/ai/flows/personalized-dashboard-suggestions';
import DashboardClient from './dashboard-client';


const enrolledUnits = [
    { code: 'KNE101', name: 'Engineering Design', grade: 82, status: 'Completed' },
    { code: 'KMA155', name: 'Calculus and Applications', grade: 75, status: 'Completed' },
    { code: 'KIT101', name: 'Programming Fundamentals', grade: null, status: 'In Progress' },
    { code: 'KNE121', name: 'Statics', grade: null, status: 'In Progress' },
];




export default async function DashboardPage() {

  const aiInput = {
    studentId: '123456',
    enrolledUnits: enrolledUnits.map(c => c.name),
    grades: enrolledUnits
        .filter(c => c.grade !== null)
        .reduce((acc, c) => ({...acc, [c.code]: c.grade as number }), {}),
  };
  const { suggestions } = await getStudySuggestions(aiInput);

  return (
    <DashboardClient 
        suggestions={suggestions}
        enrolledUnits={enrolledUnits}
    />
  );
}
