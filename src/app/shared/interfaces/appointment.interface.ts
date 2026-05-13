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


export interface AppointmentPatient {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

export interface MyAppointment {
  _id: string;
  patient: AppointmentPatient;
  appointmentDate: string;
  time: string;
  appointmentType: 'Lab-Visit' | 'Home-Visit';
  address?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface MyAppointmentsResponse {
  status: string;
  results: number;
  data: MyAppointment[];
}
