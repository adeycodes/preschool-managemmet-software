import { Subject, GRADING_SYSTEM } from './types';

export const calculateTotal = (ca: number, exam: number) => {
  return (Number(ca) || 0) + (Number(exam) || 0);
};

export const getGradeInfo = (totalScore: number) => {
  if (totalScore >= 90) return { grade: 'A+', remark: 'EXCEllENT', color: 'text-green-600' };
  if (totalScore >= 70) return { grade: 'A', remark: 'EXCEEDING', color: 'text-green-500' };
  if (totalScore >= 50) return { grade: 'B', remark: 'EXPECTED', color: 'text-blue-600' };
  if (totalScore >= 40) return { grade: 'C', remark: 'EMERGING', color: 'text-yellow-600' };
  return { grade: 'D', remark: 'NEEDS SPECIAL HELP', color: 'text-red-600' };
};

export const calculateAverage = (subjects: Subject[]) => {
  if (subjects.length === 0) return 0;
  const total = subjects.reduce((acc, sub) => acc + calculateTotal(sub.caScore, sub.examScore), 0);
  return (total / subjects.length).toFixed(1);
};

export const getTotalPossibleScore = (subjects: Subject[]) => subjects.length * 100;
export const getStudentTotalScore = (subjects: Subject[]) => subjects.reduce((acc, sub) => acc + calculateTotal(sub.caScore, sub.examScore), 0);
