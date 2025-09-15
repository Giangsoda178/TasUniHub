'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { scheduleData } from '@/lib/schedule-data';
import { ClassSchedule } from '@/lib/types';
import { Badge } from '@/components/ui/badge';


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];


const TimetableGrid = () => {
    const getEventForSlot = (day: string, time: string): ClassSchedule | undefined => {
        return scheduleData.find(event => {
            const [startTime] = event.time.split('-');
            return event.day === day && startTime.startsWith(time.split(':')[0]);
        });
    }

    const getEventDuration = (event: ClassSchedule): number => {
        const [start, end] = event.time.split('-');
        const startHour = parseInt(start.split(':')[0], 10);
        const endHour = parseInt(end.split(':')[0], 10);
        const endMinutes = parseInt(end.split(':')[1], 10);

        let duration = endHour - startHour;
        if (endMinutes > 0) {
            duration += 0.5; // for 30 min durations
        }
        return duration > 1 ? Math.ceil(duration) : duration
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-1">
            {/* Time column */}
            <div className="hidden md:block">
                {timeSlots.map(time => (
                    <div key={time} className="h-24 flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {time}
                    </div>
                ))}
            </div>

            {/* Day columns */}
            {daysOfWeek.map(day => (
                <div key={day} className="relative grid grid-rows-8">
                     <h3 className="md:hidden text-lg font-semibold p-2">{day}</h3>
                    {timeSlots.map((time, index) => {
                         const event = getEventForSlot(day, time);
                         if(event) {
                             const duration = getEventDuration(event);
                             const isFirstSlot = event.time.startsWith(time.split(':')[0]);
                             
                             const [start] = event.time.split('-');
                             const startHour = parseInt(start.split(':')[0], 10);
                             const currentHour = parseInt(time.split(':')[0], 10);

                             if(startHour !== currentHour) return null;

                             return (
                                <div key={`${day}-${time}`} className="relative row-span-1" style={{ gridRow: `span ${duration}` }}>
                                    <Card className={`absolute inset-1 bg-secondary flex flex-col`}>
                                        <CardContent className="p-2 flex flex-col justify-between flex-grow">
                                            <div>
                                                <p className="font-semibold text-xs leading-tight">{event.course}</p>
                                                <p className="text-xs text-muted-foreground">{event.location}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                 <Badge variant={event.type === 'Class' ? 'default' : 'secondary'} className="text-xs">{event.type}</Badge>
                                                 <p className="text-xs text-muted-foreground">{event.time}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                             )
                         }

                        return (
                            <div key={`${day}-${time}`} className="h-24 border-t border-dashed md:border-none"></div>
                        );
                    })}
                </div>
            ))}
        </div>
    )
}


export default function TimetablePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Timetable</h1>
        <p className="text-muted-foreground">
          Your weekly class and tutorial schedule.
        </p>
      </div>

      <Card>
        <CardHeader>
            <div className="hidden md:grid grid-cols-6 gap-1">
                <div></div>
                {daysOfWeek.map(day => (
                    <CardTitle key={day} className="text-center">{day}</CardTitle>
                ))}
            </div>
        </CardHeader>
        <CardContent>
          <TimetableGrid />
        </CardContent>
      </Card>
    </div>
  );
}
