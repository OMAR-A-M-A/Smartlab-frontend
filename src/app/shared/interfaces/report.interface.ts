export interface ReportTest {
  testId: string;
  result: number;
  status?: 'H' | 'N' | 'L'; // Backend calculates this
  critical?: boolean; // Backend calculates this
}

export interface Report {
  _id?: string;
  patient: string; // Patient ID
  referredBy: string;
  tests: ReportTest[];
  reportStatus?: string; // Backend calculates this
  patientAdvice?: string; // Backend calculates this
}
