export interface Appointment {
  _id?: string;
  appointmentDate: string;
  time: string;
  appointmentType: 'Lab-Visit' | 'Home-Visit';
  address?: string; 
}

export interface LabSettings {
  workingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  offDays: string[];
}
