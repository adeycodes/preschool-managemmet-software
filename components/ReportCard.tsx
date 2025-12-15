
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
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Force exact positioning for the report card */
          #report-card {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            background: white !important;
            z-index: 9999;
            page-break-after: always;
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

      {/* Main Report Card Container */}
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

          {/* BIODATA SECTION - 3x3 Grid Layout */}
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

                  {/* Info Grid - Right Side (3x3) */}
                  <div className="flex-1 grid grid-cols-3 gap-y-4 gap-x-6 border-l border-gray-200 pl-6">
                      {/* Column 1 */}
                      <div className="border-b border-gray-100 pb-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Student Name</p>
                          <p className="text-sm font-bold text-gray-900 leading-tight truncate">{data.fullName}</p>
                      </div>
                       <div className="border-b border-gray-100 pb-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Class</p>
                          <p className="text-xs font-bold text-gray-900">{data.className}</p>
                      </div>
                       <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Times School Opened</p>
                          <p className="text-xs font-bold text-gray-900">{data.schoolOpened}</p>
                      </div>

                      {/* Column 2 */}
                      <div className="border-b border-gray-100 pb-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Age</p>
                          <p className="text-xs font-bold text-gray-900">{data.age} Years</p>
                      </div>
                       <div className="border-b border-gray-100 pb-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Number on Roll</p>
                          <p className="text-xs font-bold text-gray-900">{data.rollNumber || '-'}</p>
                      </div>
                       <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Times Present</p>
                          <p className="text-xs font-bold text-gray-900">{data.timesPresent}</p>
                      </div>

                      {/* Column 3 */}
                      <div className="border-b border-gray-100 pb-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Sex</p>
                          <p className="text-xs font-bold text-gray-900">{data.gender}</p>
                      </div>
                       <div className="border-b border-gray-100 pb-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Next Term Begins</p>
                          <p className="text-xs font-bold text-[#b91c1c]">{data.nextTermBegins}</p>
                      </div>
                       <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Times Absent</p>
                          <p className="text-xs font-bold text-gray-900">{timesAbsent}</p>
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
                                      {c.rating === l && <Check size={14} className="text-green-600" strokeWidth={3} />}
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
                              {cleanRemark(data.teacherRemark)}
                          </p>
                      </div>
                      
                      {/* Teacher Signature Block */}
                      <div className="text-right min-w-[150px] flex flex-col items-end relative">
                          <div className="h-10 mb-1 w-full flex items-end justify-end relative">
                               {/* Signature Image embedded exactly above name */}
                              {data.teacherSignatureUrl ? (
                                  <img src={data.teacherSignatureUrl} className="max-h-12 w-auto object-contain absolute bottom-0 right-0" alt="Signature" />
                              ) : null}
                          </div>
                          <div className="w-full border-t border-gray-300"></div>
                          <p className="font-handwriting text-sm text-blue-900 leading-none mt-1">{data.teacherName}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Name & Signature</p>
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
                      <div className="border border-gray-200 rounded-sm p-3 h-full flex flex-col justify-between relative min-h-[100px]">
                          <p className="text-xs text-gray-700 italic leading-relaxed mb-6 z-10 relative">
                              {cleanRemark(data.headRemark)}
                          </p>
                          
                          <div className="flex items-end justify-between mt-auto">
                              <div className="z-20 relative">
                                  <p className="font-handwriting text-md text-blue-900 leading-none mb-1">{data.headName}</p>
                                  <div className="border-t border-gray-300 w-32"></div>
                                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Name & Signature</p>
                              </div>
                              
                              {/* Head of Preschool Stamp */}
                              {data.headTeacherStampUrl ? (
                                  <div className="absolute bottom-2 right-2 opacity-90 z-10 pointer-events-none">
                                      <img src={data.headTeacherStampUrl} className="w-20 h-20 object-contain -rotate-12" alt="Stamp" />
                                  </div>
                              ) : (
                                  <div className="absolute bottom-2 right-2 w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center opacity-40">
                                      <span className="text-[8px] text-gray-300 font-bold -rotate-12">STAMP</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Head of School */}
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></div>
                          <h3 className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest">Head of School</h3>
                      </div>
                      <div className="border border-gray-200 rounded-sm p-3 h-full flex flex-col justify-end relative min-h-[100px]">
                           {/* Head of School Stamp */}
                           {data.headOfSchoolStampUrl ? (
                                  <div className="absolute bottom-6 right-2 opacity-90 z-10 pointer-events-none">
                                      <img src={data.headOfSchoolStampUrl} className="w-20 h-20 object-contain -rotate-12" alt="Stamp" />
                                  </div>
                              ) : (
                                  <div className="absolute bottom-6 right-2 w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center opacity-40">
                                      <span className="text-[8px] text-gray-300 font-bold -rotate-12">STAMP</span>
                                  </div>
                              )}

                          <div className="flex items-end justify-between mt-8">
                              <div className="z-20 relative">
                                  <p className="font-handwriting text-md text-blue-900 leading-none mb-1">{data.headOfSchoolName}</p>
                                  <div className="border-t border-gray-300 w-32"></div>
                                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Name & Signature</p>
                              </div>
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
