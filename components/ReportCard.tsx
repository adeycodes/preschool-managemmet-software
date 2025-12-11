
import React from 'react';
import { StudentData, Subject } from '../types';
import { calculateTotal, getGradeInfo, calculateAverage, getStudentTotalScore, getTotalPossibleScore } from '../utils';
import { School } from 'lucide-react';

interface ReportCardProps {
  data: StudentData;
}

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  const studentTotal = getStudentTotalScore(data.subjects);
  const totalPossible = getTotalPossibleScore(data.subjects);
  const average = calculateAverage(data.subjects);
  
  const displayScore = (val: number) => val === 0 ? '-' : val;

  const gradingScale = [
      { grade: 'A+', range: '90-100', remark: 'EXCEEDING' },
      { grade: 'A', range: '70-89', remark: 'EXCEEDING' },
      { grade: 'B', range: '50-69', remark: 'EXPECTED' },
      { grade: 'C', range: '40-49', remark: 'EMERGING' },
      { grade: 'D', range: '0-39', remark: 'NEEDS HELP' },
  ];

  const renderSubjects = (subjects: Subject[]) => {
      if (subjects.length === 0) return null;
      return subjects.map((s) => {
        const total = calculateTotal(s.caScore, s.examScore);
        const { grade, remark } = getGradeInfo(total);
        const gradeColor = grade === 'D' || grade === 'F' ? 'text-[#b91c1c]' : 'text-gray-800';
        
        return (
            <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2 px-3 text-left text-[11px] text-gray-700 font-medium">{s.name}</td>
                <td className="py-2 px-3 text-center text-[11px] text-gray-500">{displayScore(s.caScore)}</td>
                <td className="py-2 px-3 text-center text-[11px] text-gray-500">{displayScore(s.examScore)}</td>
                <td className="py-2 px-3 text-center text-[11px] font-bold text-gray-800">{total}</td>
                <td className={`py-2 px-3 text-center text-[11px] font-bold ${gradeColor}`}>{grade}</td>
                <td className="py-2 px-3 text-left text-[10px] text-gray-500 uppercase font-medium tracking-tight">{remark}</td>
            </tr>
        );
      });
  };

  return (
    <div id="report-card" className="bg-white mx-auto w-full max-w-[210mm] min-h-[297mm] p-[10mm] sm:p-[15mm] box-border font-sans relative text-slate-900 flex flex-col justify-between shadow-sm sm:shadow-none">
      
      <div>
        {/* HEADER */}
        <div className="flex justify-center items-center mb-6 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-6">
                <div className="text-red-800 flex-shrink-0">
                     {data.schoolLogoUrl ? (
                         <img src={data.schoolLogoUrl} className="h-24 w-auto object-contain" alt="Logo" />
                     ) : (
                         <School size={64} strokeWidth={1.5} color="#8B2E2E" />
                     )}
                </div>
                <div className="text-left">
                    <h1 className="text-3xl font-serif font-bold text-[#8B2E2E] tracking-wide mb-1 uppercase leading-none">
                        {data.schoolName || 'LAURASTEPHENS SCHOOL'}
                    </h1>
                    <div className="text-[11px] text-gray-500 font-medium leading-tight uppercase tracking-wide mt-1">
                        <p>{data.schoolAddress || 'Address Line 1'}</p>
                        <p>Tel: {data.schoolPhone || '000-000-000'}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* TITLE */}
        <div className="flex items-center justify-center mb-6">
            <div className="bg-[#b91c1c] text-white py-1 px-8 rounded-sm shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
                    Term Report Card
                </h2>
            </div>
        </div>

        {/* BIODATA SECTION */}
        <div className="bg-[#F9FAFB] p-4 rounded-sm mb-6 border border-gray-100">
            <div className="flex gap-6 items-start">
                
                {/* Photo - Left Side */}
                <div className="w-24 h-32 bg-white border border-gray-200 shadow-sm flex-shrink-0 p-1">
                     <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {data.photoUrl ? (
                            <img src={data.photoUrl} className="w-full h-full object-cover" alt="Student" />
                        ) : (
                            <span className="text-[8px] font-bold text-gray-400 uppercase leading-tight text-center">Passport<br/>Photo</span>
                        )}
                    </div>
                </div>

                {/* Info Grid - Right Side */}
                <div className="flex-1 grid grid-cols-3 gap-y-4 gap-x-6">
                    {/* Row 1 */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Student Name</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{data.fullName}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Class</p>
                        <p className="text-xs font-bold text-gray-900">{data.className}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Session</p>
                        <p className="text-xs font-bold text-gray-900">{data.term} • {data.session}</p>
                    </div>

                    {/* Row 2 */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Attendance</p>
                        <p className="text-xs font-bold text-gray-900">
                            {data.timesPresent} <span className="font-normal text-gray-500">of</span> {data.schoolOpened} <span className="text-[9px] text-gray-400">DAYS</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Details</p>
                        <p className="text-xs font-bold text-gray-900">{data.age} Yrs • {data.gender}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Next Term</p>
                        <p className="text-xs font-bold text-[#b91c1c]">{data.nextTermBegins}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* ACADEMIC TABLE */}
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                <h3 className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest">Academic Performance</h3>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-[#0f172a] text-white">
                        <th className="py-2 px-3 text-left text-[9px] font-bold uppercase tracking-wider w-[35%]">Subject Area</th>
                        <th className="py-2 px-3 text-center text-[9px] font-bold uppercase tracking-wider w-[12%]">CA (40)</th>
                        <th className="py-2 px-3 text-center text-[9px] font-bold uppercase tracking-wider w-[12%]">Exam (60)</th>
                        <th className="py-2 px-3 text-center text-[9px] font-bold uppercase tracking-wider w-[10%]">Total</th>
                        <th className="py-2 px-3 text-center text-[9px] font-bold uppercase tracking-wider w-[10%]">Grade</th>
                        <th className="py-2 px-3 text-left text-[9px] font-bold uppercase tracking-wider w-[21%]">Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Prime Areas */}
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={6} className="py-1.5 px-3 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                            Prime Areas of Learning
                        </td>
                    </tr>
                    {renderSubjects(data.subjects.filter(s => s.category === 'Prime'))}

                    {/* Specific Areas */}
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={6} className="py-1.5 px-3 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                            Specific Areas of Learning
                        </td>
                    </tr>
                    {renderSubjects(data.subjects.filter(s => s.category === 'Specific'))}
                </tbody>
            </table>

            {/* Table Footer */}
            <div className="flex items-center justify-end gap-6 mt-2 border-t border-gray-200 pt-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Overall Performance</span>
                <span className="text-lg font-bold text-gray-900">{studentTotal} <span className="text-xs font-medium text-gray-400">/ {totalPossible}</span></span>
                
                <div className="border border-gray-200 rounded px-3 py-1 flex items-center gap-2 ml-4 bg-white">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Average</span>
                    <span className="text-sm font-bold text-[#b91c1c]">{average}%</span>
                </div>
            </div>
        </div>

        {/* CONDUCT & GRADING */}
        <div className="grid grid-cols-2 gap-8 mb-4 items-start">
            
            {/* Conduct */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                    <h3 className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest">Conduct Assessment</h3>
                </div>
                <div className="border-t border-gray-200">
                    <div className="grid grid-cols-[1fr_repeat(6,1.5rem)] bg-gray-50 border-b border-gray-200">
                        <div className="py-1 px-2 text-[9px] font-bold text-gray-500 uppercase">Trait</div>
                        {['A','B','C','D','E','F'].map(l => (
                            <div key={l} className="py-1 text-center text-[9px] font-bold text-gray-500 border-l border-gray-200">{l}</div>
                        ))}
                    </div>
                    {data.conducts.map((c) => (
                        <div key={c.id} className="grid grid-cols-[1fr_repeat(6,1.5rem)] border-b border-gray-100 last:border-0 items-center">
                            <div className="py-1 px-2 text-[9px] font-medium text-gray-700">{c.name}</div>
                             {['A','B','C','D','E','F'].map(l => (
                                <div key={l} className="py-1 border-l border-gray-100 flex items-center justify-center h-full">
                                    {c.rating === l && <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grading Key */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                    <h3 className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest">Grading Key</h3>
                </div>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-1 px-3 text-left text-[9px] font-bold text-gray-500 uppercase">Grade</th>
                                <th className="py-1 px-3 text-center text-[9px] font-bold text-gray-500 uppercase">Score</th>
                                <th className="py-1 px-3 text-left text-[9px] font-bold text-gray-500 uppercase">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {gradingScale.map((g) => (
                                <tr key={g.grade}>
                                    <td className={`py-1 px-3 text-xs font-bold ${g.grade.startsWith('A') || g.grade === 'D' ? 'text-[#b91c1c]' : 'text-gray-800'}`}>{g.grade}</td>
                                    <td className="py-1 px-3 text-center text-[9px] text-gray-600">{g.range}</td>
                                    <td className="py-1 px-3 text-[9px] font-bold text-gray-700 uppercase">{g.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* REMARKS & SIGNATURES */}
        <div className="mt-auto">
            {/* Class Teacher Section */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
                    <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">Class Teacher's Remark</h3>
                </div>
                <div className="flex gap-4 items-end border border-gray-200 rounded-sm p-3 bg-[#F9FAFB]">
                    <div className="flex-1">
                        <p className="text-xs text-gray-700 italic leading-relaxed min-h-[40px]">
                            "{data.teacherRemark || "No remarks provided."}"
                        </p>
                    </div>
                    <div className="text-right min-w-[150px]">
                        <p className="font-handwriting text-lg text-blue-900 leading-none mb-1">{data.teacherName}</p>
                        <div className="border-t border-gray-300 w-full"></div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Name & Signature</p>
                    </div>
                </div>
            </div>

            {/* Heads Section */}
            <div className="grid grid-cols-2 gap-6">
                
                {/* Head of Preschool */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                        <h3 className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest">Head of Preschool</h3>
                    </div>
                    <div className="border border-gray-200 rounded-sm p-3 h-full flex flex-col justify-between relative">
                        <p className="text-xs text-gray-700 italic leading-relaxed mb-6 min-h-[40px] z-10 relative">
                            "{data.headRemark || "No remarks provided."}"
                        </p>
                        
                        <div className="flex items-end justify-between mt-2">
                            <div className="z-10 relative">
                                <p className="font-handwriting text-lg text-blue-900 leading-none mb-1">{data.headName}</p>
                                <div className="border-t border-gray-300 w-32"></div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Name & Signature</p>
                            </div>
                            
                            {/* Stamp Placeholder */}
                            <div className="absolute bottom-2 right-2 w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center opacity-40">
                                <span className="text-[8px] text-gray-300 font-bold -rotate-12">STAMP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Head of School */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                        <h3 className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest">Head of School</h3>
                    </div>
                    <div className="border border-gray-200 rounded-sm p-3 h-full flex flex-col justify-end relative">
                        <div className="flex items-end justify-between mt-8">
                            <div className="z-10 relative">
                                <p className="font-handwriting text-lg text-blue-900 leading-none mb-1">{data.headOfSchoolName}</p>
                                <div className="border-t border-gray-300 w-32"></div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Name & Signature</p>
                            </div>
                            
                            {/* Stamp Placeholder */}
                            <div className="absolute bottom-2 right-2 w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center opacity-40">
                                <span className="text-[8px] text-gray-300 font-bold -rotate-12">STAMP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default ReportCard;
