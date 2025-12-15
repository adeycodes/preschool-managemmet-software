
import React from 'react';
import { School, Check, Printer } from 'lucide-react';
import { StudentData, Subject } from '../types';
import { calculateTotal, getGradeInfo, calculateAverage, getStudentTotalScore, getTotalPossibleScore } from '../utils';

interface ReportCardProps {
  data: StudentData;
}

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  const studentTotal = getStudentTotalScore(data.subjects);
  const totalPossible = getTotalPossibleScore(data.subjects);
  const average = calculateAverage(data.subjects);
  
  const displayScore = (val: number) => val === 0 ? '-' : val;
  const timesAbsent = Math.max(0, data.schoolOpened - data.timesPresent);

  // Helper to remove quotes from remarks
  const cleanRemark = (text: string) => text ? text.replace(/^["']|["']$/g, '').trim() : "No remarks provided.";

  // Helper to parse school name for styling
  const schoolName = data.schoolName || 'LauraStephens School';
  const nameParts = schoolName.split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

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
                <td className="py-[3px] px-2 text-left text-[11px] text-gray-800 font-medium">{s.name}</td>
                <td className="py-[3px] px-2 text-center text-[11px] text-gray-600">{displayScore(s.caScore)}</td>
                <td className="py-[3px] px-2 text-center text-[11px] text-gray-600">{displayScore(s.examScore)}</td>
                <td className="py-[3px] px-2 text-center text-[11px] font-bold text-gray-900">{total}</td>
                <td className={`py-[3px] px-2 text-center text-[11px] font-bold ${gradeColor}`}>{grade}</td>
                <td className="py-[3px] px-2 text-left text-[9px] text-gray-500 uppercase font-medium tracking-tight">{remark}</td>
            </tr>
        );
      });
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Strictly enforce A4 dimensions */
          #report-card {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 6mm !important; /* Reduced padding to give more room for content */
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            overflow: hidden !important; 
            z-index: 9999;
          }
        }
      `}</style>

      {/* Print Button - Hidden when printing */}
      <button 
        onClick={() => window.print()}
        className="no-print fixed top-20 right-4 md:top-4 md:right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 font-medium transition-all"
      >
        <Printer size={18} />
        Print Report Card
      </button>

      {/* Main Report Card Container - Padding reduced to 6mm to allow larger font */}
      <div id="report-card" className="bg-white mx-auto w-full max-w-[210mm] h-[297mm] p-[6mm] box-border font-sans relative text-slate-900 flex flex-col shadow-sm sm:shadow-none overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-center items-center mb-1 border-b border-gray-200 pb-2 flex-shrink-0">
             {/* Container for Logo + Name/Image */}
            <div className="flex items-center gap-4">
                {/* 1. The School Crest (Left Side) */}
                <div className="text-red-800 flex-shrink-0">
                    {data.schoolCrestUrl ? (
                         <img src={data.schoolCrestUrl} className="h-24 w-24 object-contain" alt="Crest" />
                    ) : (
                      <School size={80} strokeWidth={1.0} color="#8B2E2E" />
                    )}
                </div>

                {/* 2. The Name Part - Either Text or Image */}
                <div className="flex flex-col items-center">
                    {data.schoolLogoUrl ? (
                        <div className="flex items-end gap-3 mt-1 mb-1">
                            <img 
                                src={data.schoolLogoUrl} 
                                className="h-10 w-auto object-contain max-w-[250px]" 
                                alt="School Name" 
                            />
                            <span className="text-2xl font-bold font-serif uppercase tracking-widest text-[#b91c1c] mb-1 leading-none">
                                {restName || 'SCHOOL'}
                            </span>
                        </div>
                    ) : (
                        <h1 className="text-[#8B2E2E] mb-1 leading-none flex items-baseline justify-center gap-2">
                            <span className="text-4xl" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                                {firstName}
                            </span>
                            {restName && (
                                <span className="text-2xl font-bold font-serif uppercase tracking-widest text-[#b91c1c]">
                                    {restName}
                                </span>
                            )}
                        </h1>
                    )}
                    
                    {/* Address - Always under the name/image */}
                     <div className="text-[11px] text-gray-600 font-medium leading-tight normal-case tracking-wide text-center">
                        <p>{data.schoolAddress || 'Address Line 1'}</p>
                        <p>Tel: {data.schoolPhone || '000-000-000'}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* TITLE */}
        <div className="flex items-center justify-center mb-2 flex-shrink-0">
            <div className="bg-[#b91c1c] text-white py-0.5 px-8 rounded-sm shadow-sm">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Report For {data.term} Term {data.session} Session
                </h2>
            </div>
        </div>

        {/* BIODATA SECTION */}
        <div className="bg-[#F9FAFB] p-2.5 rounded-sm mb-2 border border-gray-200 flex-shrink-0">
            <div className="flex gap-4 items-start">
                
                {/* Photo */}
                <div className="w-[70px] h-[86px] bg-white border border-gray-200 shadow-sm flex-shrink-0 p-1">
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {data.photoUrl ? (
                            <img src={data.photoUrl} className="w-full h-full object-cover" alt="Student" />
                        ) : (
                            <span className="text-[9px] font-bold text-gray-400 uppercase leading-tight text-center">Student<br/>Photo</span>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-3 gap-y-1.5 gap-x-4 border-l border-gray-200 pl-4">
                    {/* Column 1 */}
                    <div className="border-b border-gray-100 pb-0.5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Student Name</p>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight truncate">{data.fullName}</p>
                    </div>
                      <div className="border-b border-gray-100 pb-0.5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Class</p>
                        <p className="text-[11px] font-bold text-gray-900">{data.className}</p>
                    </div>
                      <div>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">School Opened</p>
                        <p className="text-[11px] font-bold text-gray-900">{data.schoolOpened}</p>
                    </div>

                    {/* Column 2 */}
                    <div className="border-b border-gray-100 pb-0.5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Age</p>
                        <p className="text-[11px] font-bold text-gray-900">{data.age} Years</p>
                    </div>
                      <div className="border-b border-gray-100 pb-0.5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">No. on Roll</p>
                        <p className="text-[11px] font-bold text-gray-900">{data.rollNumber || '-'}</p>
                    </div>
                      <div>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Times Present</p>
                        <p className="text-[11px] font-bold text-gray-900">{data.timesPresent}</p>
                    </div>

                    {/* Column 3 */}
                    <div className="border-b border-gray-100 pb-0.5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Sex</p>
                        <p className="text-[11px] font-bold text-gray-900">{data.gender}</p>
                    </div>
                      <div className="border-b border-gray-100 pb-0.5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Next Term Begins</p>
                        <p className="text-[11px] font-bold text-[#b91c1c] truncate">{data.nextTermBegins}</p>
                    </div>
                      <div>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0">Times Absent</p>
                        <p className="text-[11px] font-bold text-gray-900">{timesAbsent}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* ACADEMIC TABLE */}
        <div className="mb-3 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                <h3 className="text-[9px] font-bold text-[#b91c1c] uppercase tracking-widest">Academic Performance</h3>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-[#0f172a] text-white">
                        <th className="py-1.5 px-2 text-left text-[9px] font-bold uppercase tracking-wider w-[35%]">Subject Area</th>
                        <th className="py-1.5 px-2 text-center text-[9px] font-bold uppercase tracking-wider w-[12%]">CA (40)</th>
                        <th className="py-1.5 px-2 text-center text-[9px] font-bold uppercase tracking-wider w-[12%]">Exam (60)</th>
                        <th className="py-1.5 px-2 text-center text-[9px] font-bold uppercase tracking-wider w-[10%]">Total</th>
                        <th className="py-1.5 px-2 text-center text-[9px] font-bold uppercase tracking-wider w-[10%]">Grade</th>
                        <th className="py-1.5 px-2 text-left text-[9px] font-bold uppercase tracking-wider w-[21%]">Remark</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={6} className="py-1 px-2 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                            Prime Areas of Learning
                        </td>
                    </tr>
                    {renderSubjects(data.subjects.filter(s => s.category === 'Prime'))}

                    <tr className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={6} className="py-1 px-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                            Specific Areas of Learning
                        </td>
                    </tr>
                    {renderSubjects(data.subjects.filter(s => s.category === 'Specific'))}
                </tbody>
            </table>

            {/* Table Footer */}
            <div className="flex items-center justify-end gap-6 mt-1.5 border-t border-gray-200 pt-1.5">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total</span>
                <span className="text-sm font-bold text-gray-900">{studentTotal} <span className="text-[11px] font-medium text-gray-400">/ {totalPossible}</span></span>
                
                <div className="border border-gray-200 rounded px-3 py-0.5 flex items-center gap-2 ml-4 bg-white">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Average</span>
                    <span className="text-sm font-bold text-[#b91c1c]">{average}%</span>
                </div>
            </div>
        </div>

        {/* CONDUCT & GRADING */}
        <div className="grid grid-cols-2 gap-4 mb-3 items-start flex-shrink-0">
            {/* Conduct */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                    <h3 className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-widest">Conduct</h3>
                </div>
                <div className="border-t border-gray-200">
                    <div className="grid grid-cols-[1fr_repeat(6,1.2rem)] bg-gray-50 border-b border-gray-200">
                        <div className="py-1 px-2 text-[9px] font-bold text-gray-500 uppercase">Trait</div>
                        {['A','B','C','D','E','F'].map(l => (
                            <div key={l} className="py-1 text-center text-[9px] font-bold text-gray-500 border-l border-gray-200">{l}</div>
                        ))}
                    </div>
                    {data.conducts.map((c) => (
                        <div key={c.id} className="grid grid-cols-[1fr_repeat(6,1.2rem)] border-b border-gray-100 last:border-0 items-center">
                            <div className="py-1 px-2 text-[11px] font-medium text-gray-700 truncate">{c.name}</div>
                              {['A','B','C','D','E','F'].map(l => (
                                <div key={l} className="py-1 border-l border-gray-100 flex items-center justify-center h-full">
                                    {c.rating === l && <Check size={10} className="text-green-600" strokeWidth={3} />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grading Key */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                    <h3 className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-widest">Grading</h3>
                </div>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-1 px-2 text-left text-[9px] font-bold text-gray-500 uppercase">Grd</th>
                                <th className="py-1 px-2 text-center text-[9px] font-bold text-gray-500 uppercase">Score</th>
                                <th className="py-1 px-2 text-left text-[9px] font-bold text-gray-500 uppercase">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {gradingScale.map((g) => (
                                <tr key={g.grade}>
                                    <td className={`py-1 px-2 text-[11px] font-bold ${g.grade.startsWith('A') || g.grade === 'D' ? 'text-[#b91c1c]' : 'text-gray-800'}`}>{g.grade}</td>
                                    <td className="py-1 px-2 text-center text-[9px] text-gray-600">{g.range}</td>
                                    <td className="py-1 px-2 text-[9px] font-bold text-gray-700 uppercase">{g.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* REMARKS & SIGNATURES */}
        <div className="mt-auto flex-grow flex flex-col justify-end gap-3">
            
            {/* Class Teacher Section */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
                    <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">Class Teacher's Remark</h3>
                </div>
                <div className="flex gap-4 border border-gray-200 rounded-sm p-3 bg-[#F9FAFB] min-h-[50px] items-stretch">
                    <div className="flex-1 flex items-center">
                        <p className="text-[11px] text-gray-800 italic leading-snug whitespace-pre-wrap break-words w-full">
                            {cleanRemark(data.teacherRemark)}
                        </p>
                    </div>
                    
                    {/* Teacher Signature Block */}
                    <div className="text-right min-w-[130px] flex flex-col justify-end relative pt-4">
                        <div className="h-8 mb-0.5 w-full flex items-end justify-end relative">
                            {data.teacherSignatureUrl ? (
                                <img src={data.teacherSignatureUrl} className="max-h-12 w-auto object-contain absolute bottom-0 right-0" alt="Signature" />
                            ) : null}
                        </div>
                        <div className="w-full border-t border-gray-300"></div>
                        <p className="font-handwriting text-sm text-blue-900 leading-none mt-1 truncate">{data.teacherName}</p>
                        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Name & Signature</p>
                    </div>
                </div>
            </div>

            {/* Heads Section */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* Head of Preschool */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                        <h3 className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-widest">Head of Preschool</h3>
                    </div>
                    <div className="border border-gray-200 rounded-sm p-3 h-full flex flex-col justify-between relative min-h-[70px]">
                        <div className="mb-2 relative z-20">
                             <p className="text-[11px] text-gray-800 italic leading-snug whitespace-pre-wrap break-words">
                                {cleanRemark(data.headRemark)}
                            </p>
                        </div>
                        
                        {/* Head of Preschool Stamp - Positioned Absolute */}
                        {data.headTeacherStampUrl ? (
                            <div className="absolute bottom-1 right-1 opacity-90 z-10 pointer-events-none">
                                <img src={data.headTeacherStampUrl} className="w-16 h-16 object-contain -rotate-12" alt="Stamp" />
                            </div>
                        ) : (
                            <div className="absolute bottom-1 right-1 w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center opacity-40">
                                <span className="text-[6px] text-gray-300 font-bold -rotate-12">STAMP</span>
                            </div>
                        )}
                        
                        <div className="flex items-end justify-between mt-auto relative z-20">
                            <div className="flex-1 mr-2">
                                <p className="font-handwriting text-sm text-blue-900 leading-none mb-0.5 truncate">{data.headName}</p>
                                <div className="border-t border-gray-300 w-full"></div>
                                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Name & Signature</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Head of School */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                        <h3 className="text-[9px] font-bold text-[#b91c1c] uppercase tracking-widest">Head of School</h3>
                    </div>
                    <div className="border border-gray-200 rounded-sm p-3 h-full flex flex-col justify-end relative min-h-[70px]">
                        {/* Head of School Stamp */}
                        {data.headOfSchoolStampUrl ? (
                                <div className="absolute bottom-1 right-1 opacity-90 z-10 pointer-events-none">
                                    <img src={data.headOfSchoolStampUrl} className="w-16 h-16 object-contain -rotate-12" alt="Stamp" />
                                </div>
                            ) : (
                                <div className="absolute bottom-1 right-1 w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center opacity-40">
                                    <span className="text-[6px] text-gray-300 font-bold -rotate-12">STAMP</span>
                                </div>
                            )}

                        <div className="flex items-end justify-between mt-4 relative z-20">
                            <div className="w-2/3">
                                <p className="font-handwriting text-sm text-blue-900 leading-none mb-0.5 truncate">{data.headOfSchoolName}</p>
                                <div className="border-t border-gray-300 w-full"></div>
                                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Name & Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ReportCard;
