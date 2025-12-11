import React, { useState } from 'react';
import { StudentData, INITIAL_SUBJECTS, INITIAL_CONDUCTS } from '../types';
import { generateRemarks } from '../services/geminiService';

const createSampleStudent = (name = 'Sample Student'): StudentData => ({
  id: 'demo-student',
  schoolName: 'Demo School',
  schoolAddress: 'Demo Address',
  schoolPhone: '0000000000',
  schoolLogoUrl: null,
  fullName: name,
  age: 5,
  gender: 'Female',
  className: "Demo Class",
  rollNumber: '001',
  photoUrl: null,
  schoolOpened: 120,
  timesPresent: 115,
  subjects: JSON.parse(JSON.stringify(INITIAL_SUBJECTS)),
  conducts: JSON.parse(JSON.stringify(INITIAL_CONDUCTS)),
  teacherRemark: '',
  headRemark: '',
  teacherName: 'Ms Demo',
  headName: 'Mr Head',
  headOfSchoolName: 'Headmaster',
  term: 'Demo Term',
  session: 'Demo Session',
  nextTermBegins: 'Next Term',
});

export default function RemarksDemo() {
  const [name, setName] = useState('Jane Doe');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ teacherRemark?: string; headRemark?: string; error?: string }>({});

  const handleGenerate = async () => {
    setLoading(true);
    setResult({});
    try {
      const student = createSampleStudent(name);
      // Small tweak: give a couple of scores so the AI sees some data
      student.subjects[0].caScore = 30;
      student.subjects[0].examScore = 45;
      student.subjects[1].caScore = 25;
      student.subjects[1].examScore = 40;

      const remarks = await generateRemarks(student);
      setResult({ teacherRemark: remarks.teacherRemark, headRemark: remarks.headRemark });
    } catch (e: any) {
      setResult({ error: e?.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Remarks Demo</h2>
      <p className="text-sm text-gray-600 mb-4">This demo calls the AI to generate remarks for a sample student. Ensure `GEMINI_API_KEY` is set in your `.env.local`.</p>

      <div className="flex gap-2 mb-4">
        <input value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded flex-1" />
        <button onClick={handleGenerate} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {result.error && <div className="text-red-600">Error: {result.error}</div>}

      {result.teacherRemark && (
        <div className="mt-4">
          <h3 className="font-medium">Class Teacher's Remark</h3>
          <p className="mt-1">{result.teacherRemark}</p>
          <h3 className="font-medium mt-3">Head's Remark</h3>
          <p className="mt-1">{result.headRemark}</p>
        </div>
      )}
    </div>
  );
}
