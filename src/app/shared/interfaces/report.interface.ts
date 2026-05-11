export interface ReportTest {
  _id?: string;
  test: string;
  testName: string;
  category: string;
  result: number;
  unit: string;
  referenceText: string;
  referenceRange: {
    low: number;
    high: number;
  };
  status: 'H' | 'N' | 'L';
  critical: boolean;
  patientAdvice: string;
  trend?: {
    direction: 'up' | 'down' | 'none';
  };
}

export interface Report {
  _id?: string;
  createdBy?: string;
  patient: string;
  referredBy: string;
  tests: ReportTest[];
  reportStatus?: string;
  patientAdvice?: string;
  requestDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportResponse {
  message: string;
  results: number;
  data: Report[];
}
