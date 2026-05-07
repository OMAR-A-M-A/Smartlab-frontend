export interface Staff {
  _id?: string;
  accountId: string | any;
  nationalId: string;
  department: string;
  shift: string;
  daysOff?: string[];
  salary: number;
  bonus?: number;
  payDay: number;

  name?: string;
  email?: string;
  phone?: string;
}
