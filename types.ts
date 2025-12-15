
export interface Subject {
  id: string;
  name: string;
  category: 'Prime' | 'Specific';
  caScore: number; // Max 40
  examScore: number; // Max 60
}

export interface Conduct {
  id: string;
  name: string;
  rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '';
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'teacher' | 'admin';
}

export interface AppSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  term: string;
  session: string;
  nextTermBegins: string;
  defaultTeacherName: string;
  defaultHeadName: string;
  defaultHeadOfSchoolName: string;
  // Images
  defaultSchoolCrestUrl?: string | null; // New: Logo on the left
  defaultTeacherSignatureUrl?: string | null;
  defaultHeadTeacherStampUrl?: string | null;
  defaultHeadOfSchoolStampUrl?: string | null;
}

export interface StudentData {
  id: string; // Unique ID for roster management
  
  // School Info
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolLogoUrl: string | null; // Used for Center Name Image
  schoolCrestUrl: string | null; // New: Used for Left Logo

  // Personal Info
  fullName: string;
  age: number | '';
  gender: 'Male' | 'Female' | '';
  className: string;
  rollNumber: string;
  photoUrl: string | null;

  // Attendance
  schoolOpened: number;
  timesPresent: number;
  
  // Academic
  subjects: Subject[];

  // Conduct
  conducts: Conduct[];

  // Remarks
  teacherRemark: string;
  headRemark: string;
  teacherName: string;
  headName: string;
  headOfSchoolName: string;
  
  // Signatures & Stamps
  teacherSignatureUrl?: string | null;
  headTeacherStampUrl?: string | null;
  headOfSchoolStampUrl?: string | null;
  
  // Meta
  term: string;
  session: string;
  nextTermBegins: string;
  lastUpdated?: number;
}

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'pse', name: 'Personal, Social & Emotional Dev.', category: 'Prime', caScore: 0, examScore: 0 },
  { id: 'cl', name: 'Communication & Language', category: 'Prime', caScore: 0, examScore: 0 },
  { id: 'pd', name: 'Physical Development', category: 'Prime', caScore: 0, examScore: 0 },
  { id: 'lit', name: 'Literacy', category: 'Specific', caScore: 0, examScore: 0 },
  { id: 'dic', name: 'Diction', category: 'Specific', caScore: 0, examScore: 0 },
  { id: 'num', name: 'Numeracy', category: 'Specific', caScore: 0, examScore: 0 },
  { id: 'uw', name: 'Understanding the World', category: 'Specific', caScore: 0, examScore: 0 },
  { id: 'ead', name: 'Expressive Art & Design', category: 'Specific', caScore: 0, examScore: 0 },
];

export const INITIAL_CONDUCTS: Conduct[] = [
  { id: 'att', name: 'Attentiveness', rating: '' },
  { id: 'neat', name: 'Neatness & Orderliness', rating: '' },
  { id: 'punc', name: 'Punctuality', rating: '' },
  { id: 'pol', name: 'Politeness', rating: '' },
  { id: 'rel', name: 'Relationship with Peers', rating: '' },
];

export const GRADING_SYSTEM = [
  { grade: 'A+', range: '90-100', remark: 'Exceeding' },
  { grade: 'A', range: '70-89', remark: 'Exceeding' },
  { grade: 'B', range: '50-69', remark: 'Expected' },
  { grade: 'C', range: '40-49', remark: 'Emerging' },
  { grade: 'D', range: '0-39', remark: 'Needs Support' },
];
