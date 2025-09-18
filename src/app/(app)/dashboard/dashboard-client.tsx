'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, GraduationCap, Lightbulb, CalendarCheck } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart } from "recharts";

const gradesData = [
    { course: "KNE101", grade: 82, fill: "hsl(var(--chart-1))" },
    { course: "KMA155", grade: 75, fill: "hsl(var(--chart-2))" },
    { course: "KIT101", grade: 88, fill: "hsl(var(--chart-3))" }, // Assuming a mock current grade
    { course: "KNE121", grade: 91, fill: "hsl(var(--chart-4))" }, // Assuming a mock current grade
];

const chartConfig = {
    grade: {
      label: "Grade",
    },
} satisfies ChartConfig;

type EnrolledUnit = {
    code: string;
    name: string;
    grade: number | null;
    status: string;
};


type DashboardClientProps = {
  suggestions: string[];
  enrolledUnits: EnrolledUnit[];
};

export default function DashboardClient({ suggestions, enrolledUnits }: DashboardClientProps) {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, Student!</h1>
        <p className="text-muted-foreground">Here’s what’s happening with your studies.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">HD</div>
            <p className="text-xs text-muted-foreground">85% across all units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses in Progress</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Due Dates</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">In the next month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions.length}</div>
            <p className="text-xs text-muted-foreground">Personalized tips available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>AI-Powered Study Suggestions</CardTitle>
                <CardDescription>Tips to help you stay on track and improve your results.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {suggestions.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Lightbulb className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Overview</CardTitle>
            <CardDescription>Your performance in current and past units.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <RechartsBarChart data={gradesData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="course" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="grade" radius={8} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="mb-2">Units</CardTitle>
            <CardDescription className="text-md">Your passed and enrolled units</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Unit Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrolledUnits.map((unit) => (
                        <TableRow key={unit.code}>
                            <TableCell className="font-medium">{unit.code}</TableCell>
                            <TableCell>{unit.name}</TableCell>
                            <TableCell>
                                <Badge variant={unit.status === 'Completed' ? 'secondary' : 'default'}>{unit.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
