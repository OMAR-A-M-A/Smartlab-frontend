export interface TestReference {
  _id?: string;
  testName: string;
  category: string;
  applicableTo: 'Male' | 'Female' | 'Children' | 'Newborn' | 'Adults' | 'All';
  unit: string;
  min: number;
  max: number;
  referenceText: string;
  criticalRange?: {
    low?: number;
    high?: number;
  };
  adviceTemplates?: {
    normal?: string;
    low?: string;
    high?: string;
    critical?: string;
  };
  referral?: string;
}
