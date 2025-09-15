export type Course = {
    code: string;
    title: string;
    faculty: string;
    level: 'Undergraduate' | 'Postgraduate';
    description: string;
    imageUrl: string;
    imageHint: string;
  };

  export type ClassSchedule = {
    day: string;
    time: string;
    course: string;
    type: 'Class' | 'Tutorial';
    location: string;
    instructor: string;
  };