
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
      { grade: 'D', range: '0-39', remark: 'NEEDS SPECIAL HELP' },
  ];

  const renderSubjects = (subjects: Subject[]) => {
      if (subjects.length === 0) return null;
      return subjects.map((s) => {
        const total = calculateTotal(s.caScore, s.examScore);
        const { grade, remark } = getGradeInfo(total);
                const gradeClass = `grade-${grade.replace('+','plus')}`;
        
        return (
            <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2 px-3 text-left text-[10px] text-gray-700 font-medium">{s.name}</td>
                <td className="py-2 px-3 text-center text-[10px] text-gray-500">{displayScore(s.caScore)}</td>
                <td className="py-2 px-3 text-center text-[10px] text-gray-500">{displayScore(s.examScore)}</td>
                <td className="py-2 px-3 text-center text-[10px] font-bold text-gray-800">{total}</td>
                <td className={`py-2 px-3 text-center text-[10px] font-bold ${gradeClass}`}>{grade}</td>
                <td className="py-2 px-3 text-left text-[10px] text-gray-500 uppercase font-medium tracking-tight">{remark}</td>
            </tr>
        );
      });
  };

    return (
        <div id="report-card" className="bg-white mx-auto w-full max-w-[210mm] min-h-[297mm] p-[10mm] sm:p-[15mm] box-border font-sans relative text-slate-900 flex flex-col justify-between shadow-sm sm:shadow-none">
            <style>{`
                /* Print-friendly adjustments to keep the report on one A4 page */
                .quote-screen{display:inline}
                .print-only{display:none}
                .screen-only{display:inline-block}
                @media print {
                    @page { size: A4 portrait; margin: 6mm; }
                    html, body { height: 297mm; }
                    #report-card { box-shadow: none !important; background: #fff !important; }

                    /* Helpers - hide screen-only decorations and show print-only elements */
                    .quote-screen{display:none}
                    .print-only{display:inline-block}
                    .screen-only{display:none}

                    /* Reduce paddings and fonts uniformly for print */
                    #report-card { padding: 8mm !important; }
                    #report-card h1 { font-size: 22px !important; }
                    #report-card h2 { font-size: 12px !important; }

                    /* Default text color for body content */
                    #report-card p, #report-card td, #report-card span, #report-card div { color: #000 !important; }

                    /* Ensure colored headers keep white text */
                    #report-card .bg-\[\#b91c1c\],
                    #report-card .bg-\[\#0f172a\] { color: #fff !important; }
                    #report-card .bg-\[\#b91c1c\] h2,
                    #report-card .bg-\[\#b91c1c\] h3,
                    #report-card .bg-\[\#0f172a\] th { color: #fff !important; }

                    /* Shrink various text sizes */
                    #report-card .text-3xl { font-size: 20px !important; }
                    #report-card .text-lg { font-size: 12px !important; }
                    #report-card .text-sm, #report-card .text-xs, #report-card .text-[9px], #report-card .text-[10px] { font-size: 9px !important; }

                    /* Reduce photo/logo sizes */
                    #report-card img { max-height: 64px !important; max-width: 120px !important; }
                    #report-card .w-24 { width: 56px !important; }
                    #report-card .h-32 { height: 72px !important; }

                    /* Table adjustments */
                    #report-card table { font-size: 9px !important; border-collapse: collapse !important; }
                    #report-card th, #report-card td { padding: 3px 6px !important; }

                    /* Conduct dot / print-checkmark visibility */
                    #report-card .conduct-dot { background: #000 !important; }
                    #report-card .checkmark { display:inline-block; font-size:12px !important; color:#000 !important; font-weight:700 !important; }
                    #report-card .print-only { color: #000 !important; }

                    /* Grade color mapping for print (contrasting)
                       A / A+ -> green, B -> dark blue, C -> blue, D -> red */
                    #report-card .grade-A, #report-card .grade-Aplus { color: #166534 !important; font-weight:700 !important; }
                    #report-card .grade-B { color: #1e40af !important; }
                    #report-card .grade-C { color: #2563eb !important; }
                    #report-card .grade-D { color: #b91c1c !important; }

                    /* Make overall performance numbers identical size when printing */
                    #report-card .overall-total, #report-card .overall-max { font-size: 14px !important; line-height: 1 !important; }
                    #report-card .overall-sep { margin: 0 4px; }

                    /* Reduce spacing for remarks and signatures */
                    #report-card .min-w-[150px] { min-width: 110px !important; }
                    #report-card .font-handwriting { font-size: 12px !important; }

                    /* Prevent content from breaking across pages where possible */
                    #report-card, #report-card * { page-break-inside: avoid !important; }
                }
            `}</style>
      
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
                <div className="flex-1 grid grid-cols-3 gap-y-3 gap-x-4">
                    {/* Name of Pupil */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Name of Pupil</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{data.fullName}</p>
                    </div>

                    {/* Age */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Age</p>
                        <p className="text-xs font-bold text-gray-900">{data.age}</p>
                    </div>

                    {/* Sex */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Sex</p>
                        <p className="text-xs font-bold text-gray-900">{data.gender}</p>
                    </div>

                    {/* Class */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Class</p>
                        <p className="text-xs font-bold text-gray-900">{data.className}</p>
                    </div>

                    {/* Number on Roll */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Number on Roll</p>
                        <p className="text-xs font-bold text-gray-900">{data.rollNumber || '-'}</p>
                    </div>

                    {/* School Opened */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">School Opened</p>
                        <p className="text-xs font-bold text-gray-900">{data.schoolOpened}</p>
                    </div>

                    {/* Times Present */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Times Present</p>
                        <p className="text-xs font-bold text-gray-900">{data.timesPresent}</p>
                    </div>

                    {/* Times Absent */}
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Times Absent</p>
                        <p className="text-xs font-bold text-gray-900">{(data.schoolOpened || 0) - (data.timesPresent || 0)}</p>
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
                        <th className="py-2 px-3 text-left text-[9px] f-bold uppercase tracking-wider w-[21%]">Remark</th>
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
                <span className="text-lg font-bold text-gray-900"><span className="overall-total">{studentTotal}</span> <span className="overall-sep">/</span> <span className="overall-max">{totalPossible}</span></span>
                
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
                                    {c.rating === l && (
                                        <>
                                            <div className="screen-only conduct-dot w-1.5 h-1.5 rounded-full bg-gray-800"></div>
                                            <div className="print-only text-[10px] font-bold">✓</div>
                                        </>
                                    )}
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
                                    <td className={`py-1 px-3 text-xs font-bold grade-${g.grade.replace('+','plus')}`}>{g.grade}</td>
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
                            <span className="quote-screen">"</span>{data.teacherRemark || "No remarks provided."}<span className="quote-screen">"</span>
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
                            <span className="quote-screen">"</span>{data.headRemark || "No remarks provided."}<span className="quote-screen">"</span>
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
