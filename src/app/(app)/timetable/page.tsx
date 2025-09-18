'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClassSchedule } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];


const TimetableGrid = ({ scheduleData }: { scheduleData: ClassSchedule[] }) => {
    const getEventForSlot = (day: string, time: string): ClassSchedule | undefined => {
        return scheduleData.find(event => {
            const [startTime] = event.time.split('-');
            return event.day === day && startTime.startsWith(time.split(':')[0]);
        });
    }

    const getEventDurationInSlots = (event: ClassSchedule): number => {
        const [start, end] = event.time.split('-');
        const startHour = parseInt(start.split(':')[0], 10);
        const startMinutes = parseInt(start.split(':')[1], 10);
        const endHour = parseInt(end.split(':')[0], 10);
        const endMinutes = parseInt(end.split(':')[1], 10);

        const startTime = startHour + startMinutes / 60;
        const endTime = endHour + endMinutes / 60;
        
        return Math.ceil(endTime - startTime);
    }

    const renderedEvents = new Set<string>();

    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] min-w-[700px]">
            {/* Time column */}
            <div className="hidden md:flex flex-col">
                <div className="h-10"></div>
                {timeSlots.map(time => (
                    <div key={time} className="h-24 flex items-center justify-center -mt-3 text-sm font-medium text-muted-foreground">
                        {time}
                    </div>
                ))}
            </div>
            
            {/* Day columns */}
            {daysOfWeek.map(day => (
                <div key={day} className="flex-1">
                    <h3 className="text-center text-lg font-semibold p-2 sticky top-0 bg-background z-10">{day}</h3>
                    <div className="relative grid grid-rows-8 h-full border-l">
                        {timeSlots.map((time, index) => {
                            const event = scheduleData.find(e => {
                                const [startTime] = e.time.split('-');
                                return e.day === day && startTime.split(':')[0] === time.split(':')[0];
                            });

                            if (event && !renderedEvents.has(event.course + event.time)) {
                                renderedEvents.add(event.course + event.time);
                                const duration = getEventDurationInSlots(event);
                                const [start] = event.time.split('-');
                                const startMinutes = parseInt(start.split(':')[1]);
                                const topOffset = (startMinutes / 60) * 100; // 6rem = 96px

                                return (
                                    <div 
                                        key={`${day}-${time}`} 
                                        className="absolute w-full px-1"
                                        style={{ 
                                            top: `calc(${index * 6}rem + ${topOffset / 100 * 6}rem)`,
                                            height: `${duration * 6}rem`
                                        }}
                                    >
                                        <Card className="bg-secondary h-full flex flex-col shadow-md">
                                            <CardContent className="p-2 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <p className="font-semibold text-xl leading-tight">{event.course}</p>
                                                    <p className="text-s text-muted-foreground">{event.location}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                     <Badge variant={event.type === 'Class' ? 'default' : 'outline'} className="text-xs">{event.type}</Badge>
                                                     <p className="text-s text-muted-foreground">{event.time}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            }
                            // Render empty slots for grid lines
                            return (
                                <div key={`${day}-${time}`} className="h-24 border-t-2 border-red-500 border-solid -z-10"></div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}


export default function TimetablePage() {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState<ClassSchedule[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClasses() {
            if (user) {
                // Query Firestore for student by email
                const studentsRef = collection(db, 'students');
                const q = query(studentsRef, where('email', '==', user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Use the first matching document
                    const data = querySnapshot.docs[0].data();
                    const classes = data.classes || {};
                    // Flatten classes object into ClassSchedule[]
                    const scheduleArr: ClassSchedule[] = [];
                    Object.entries(classes).forEach(([course, classList]) => {
                        (classList as any[]).forEach(cls => {
                            scheduleArr.push({
                                course,
                                type: cls.type,
                                day: cls.day,
                                time: `${cls.start}-${cls.end}`,
                                location: cls.location || '',
                                instructor: cls.instructor || '',
                            });
                        });
                    });
                    setSchedule(scheduleArr);
                } else {
                    setSchedule(null);
                }
                setLoading(false);
            }
        }
        fetchClasses();
      }, [user]);

  if (loading) {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <Card>
                <CardContent className="overflow-x-auto p-0 md:p-6">
                    <Skeleton className="h-[788px] w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">Your Timetable</h1>
                <p className="text-lg mt-4 text-muted-foreground">
                    Your weekly lecture and tutorial schedule
                </p>
            </div>

            <Card>
                <CardContent className="overflow-x-auto p-0 md:p-6">
                    {schedule && schedule.length > 0 ? (
                        <TimetableGrid scheduleData={schedule} />
                    ) : (
                        <div className="flex items-center justify-center h-96">
                                <p className="text-muted-foreground">No schedule found. Please update your profile.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
