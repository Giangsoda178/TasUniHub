'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { scheduleData } from '@/lib/schedule-data';
import { ClassSchedule } from '@/lib/types';
import { Badge } from '@/components/ui/badge';


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];


const TimetableGrid = () => {
    const getEventForSlot = (day: string, time: string): ClassSchedule | undefined => {
        const currentHour = parseInt(time.split(':')[0]);
        return scheduleData.find(event => {
            const [startTime] = event.time.split('-');
            const startHour = parseInt(startTime.split(':')[0]);
            return event.day === day && startHour === currentHour;
        });
    }

    const getEventDurationInHours = (event: ClassSchedule): number => {
        const [start, end] = event.time.split('-');
        const startHour = parseInt(start.split(':')[0], 10);
        const startMinutes = parseInt(start.split(':')[1], 10);
        const endHour = parseInt(end.split(':')[0], 10);
        const endMinutes = parseInt(end.split(':')[1], 10);

        const startTime = startHour + startMinutes / 60;
        const endTime = endHour + endMinutes / 60;
        
        return endTime - startTime;
    }

    const renderedEvents = new Set<string>();

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-1 bg-background">
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
                     <h3 className="md:hidden text-lg font-semibold p-2 sticky top-0 bg-background z-10">{day}</h3>
                    {timeSlots.map((time, index) => {
                        const event = getEventForSlot(day, time);
                        
                        if (event && !renderedEvents.has(event.course + event.time)) {
                             renderedEvents.add(event.course + event.time);
                             const duration = getEventDurationInHours(event);
                             
                             return (
                                <div key={`${day}-${time}`} className="relative" style={{ gridRow: `${index + 1} / span ${Math.ceil(duration)}` }}>
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
                            <div key={`${day}-${time}`} className="h-24 border-t border-dashed -z-10"></div>
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
        <CardContent className="overflow-x-auto">
          <TimetableGrid />
        </CardContent>
      </Card>
    </div>
  );
}
