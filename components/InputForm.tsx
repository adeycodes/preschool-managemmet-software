
import React, { ChangeEvent, useState } from 'react';
import { StudentData, Subject, Conduct } from '../types';
import { Upload, Wand2, Calculator, Sparkles, School, User, BookOpen, Activity, MessageSquare, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { calculateTotal, getGradeInfo } from '../utils';

interface InputFormProps {
  data: StudentData;
  onChange: (data: StudentData) => void;
  onGenerateRemarks: () => void;
  isGenerating: boolean;
}

const TEACHER_COMMENTS = [
  "Shows great enthusiasm in class.",
  "Needs to focus more on individual tasks.",
  "Making excellent progress in literacy.",
  "Is a helpful and polite class member.",
  "Works well independently.",
  "Requires more practice with numeracy.",
  "Has a wonderful creative streak.",
  "Participates actively in group activities."
];

const HEAD_COMMENTS = [
  "Excellent progress!",
  "Good effort shown.",
  "Outstanding result.",
  "Keep it up!",
  "More focus needed.",
  "Well done, Zion!",
  "Impressive performance."
];

type Tab = 'profile' | 'academic' | 'conduct' | 'remarks';

const InputForm: React.FC<InputFormProps> = ({ data, onChange, onGenerateRemarks, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const handleInputChange = (field: keyof StudentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSubjectChange = (id: string, field: 'caScore' | 'examScore', value: string) => {
    const numValue = Math.min(field === 'caScore' ? 40 : 60, Math.max(0, Number(value) || 0));
    const newSubjects = data.subjects.map(s => 
      s.id === id ? { ...s, [field]: numValue } : s
    );
    onChange({ ...data, subjects: newSubjects });
  };

  const handleConductChange = (id: string, rating: string) => {
    const newConducts = data.conducts.map(c => 
      c.id === id ? { ...c, rating: rating as any } : c
    );
    onChange({ ...data, conducts: newConducts });
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('schoolLogoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const appendRemark = (type: 'teacher' | 'head', text: string) => {
    const field = type === 'teacher' ? 'teacherRemark' : 'headRemark';
    const current = data[field];
    const newValue = current ? `${current} ${text}` : text;
    handleInputChange(field, newValue);
  };

  const tabs = [
    { id: 'profile', label: 'Student Info', icon: User },
    { id: 'academic', label: 'Academics', icon: BookOpen },
    { id: 'conduct', label: 'Conduct', icon: Activity },
    { id: 'remarks', label: 'Remarks', icon: MessageSquare },
  ];

  const inputClasses = "w-full p-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 outline-none transition font-medium";
  const labelClasses = "block text-sm font-bold text-gray-900 mb-1";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition whitespace-nowrap border-b-2 outline-none
                ${isActive 
                  ? 'border-red-600 text-red-700 bg-red-50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        
        {/* TAB 1: PROFILE & SCHOOL */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Upload - Prominent */}
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 items-start p-5 bg-white rounded-xl border border-gray-300 shadow-sm">
                <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 shadow-inner flex items-center justify-center">
                  {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Student Photo</h3>
                  <p className="text-sm text-gray-600 mb-3 font-medium">Upload a clear passport style photo.</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                    <Upload size={16} />
                    Choose Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-4">
                 <div>
                  <label className={labelClasses}>Full Name</label>
                  <input 
                    type="text" 
                    value={data.fullName} 
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={inputClasses}
                    placeholder="Surname Firstname"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Age</label>
                    <input 
                      type="number" 
                      value={data.age} 
                      onChange={(e) => handleInputChange('age', Number(e.target.value))}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Gender</label>
                    <select 
                      value={data.gender} 
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Class Name</label>
                  <input 
                    type="text" 
                    value={data.className} 
                    onChange={(e) => handleInputChange('className', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Roll Number</label>
                  <input 
                    type="text" 
                    value={data.rollNumber} 
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Collapsible School Logo Section */}
              <div className="md:col-span-2 pt-4 border-t border-gray-200">
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700 hover:text-red-700">
                      <School size={16} />
                      <span>School Branding & Logo (Optional)</span>
                    </summary>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300 flex items-center gap-4">
                       <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                         {data.schoolLogoUrl ? (
                           <img src={data.schoolLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                         ) : (
                           <School size={24} className="text-gray-300" />
                         )}
                       </div>
                       <label className="cursor-pointer bg-white border border-gray-400 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-bold text-gray-900 transition shadow-sm">
                         Change School Logo
                         <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                       </label>
                    </div>
                  </details>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMICS & ATTENDANCE */}
        {activeTab === 'academic' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Attendance Section */}
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-200">
               <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                 <Calendar size={18} className="text-blue-700" /> Attendance & Term
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-900 mb-1">Days Opened</label>
                    <input 
                      type="number" 
                      value={data.schoolOpened} 
                      onChange={(e) => handleInputChange('schoolOpened', Number(e.target.value))}
                      className="w-full p-2 border border-blue-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none text-center font-bold shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-900 mb-1">Days Present</label>
                    <input 
                      type="number" 
                      value={data.timesPresent} 
                      onChange={(e) => handleInputChange('timesPresent', Number(e.target.value))}
                      className="w-full p-2 border border-blue-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none text-center font-bold shadow-sm"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-xs font-bold text-blue-900 mb-1">Next Term Date</label>
                    <input 
                      type="text" 
                      value={data.nextTermBegins} 
                      onChange={(e) => handleInputChange('nextTermBegins', e.target.value)}
                      className="w-full p-2 border border-blue-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium shadow-sm"
                    />
                  </div>
               </div>
            </div>

            {/* Scores Table */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Subject Scores</h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300">
                  Max CA: 40 | Max Exam: 60
                </span>
              </div>
              <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 border-b border-gray-300">
                      <th className="p-4 text-left font-bold">Subject</th>
                      <th className="p-4 w-24 text-center font-bold bg-gray-200/50">CA (40)</th>
                      <th className="p-4 w-24 text-center font-bold bg-gray-200/50 border-l border-white">Exam (60)</th>
                      <th className="p-4 w-20 text-center font-bold">Total</th>
                      <th className="p-4 w-16 text-center font-bold">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.subjects.map((sub) => {
                      const total = calculateTotal(sub.caScore, sub.examScore);
                      const gradeInfo = getGradeInfo(total);
                      return (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 pl-4 font-bold text-gray-900">{sub.name}</td>
                          <td className="p-2 text-center bg-gray-50/30">
                            <input 
                              type="number" 
                              max={40}
                              value={sub.caScore || ''}
                              onChange={(e) => handleSubjectChange(sub.id, 'caScore', e.target.value)}
                              className="w-20 p-2 border-2 border-gray-300 rounded text-center bg-white text-gray-900 font-bold focus:border-blue-500 focus:ring-0 outline-none transition placeholder-gray-400"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2 text-center bg-gray-50/30">
                            <input 
                              type="number" 
                              max={60}
                              value={sub.examScore || ''}
                              onChange={(e) => handleSubjectChange(sub.id, 'examScore', e.target.value)}
                              className="w-20 p-2 border-2 border-gray-300 rounded text-center bg-white text-gray-900 font-bold focus:border-blue-500 focus:ring-0 outline-none transition placeholder-gray-400"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-3 text-center font-black text-gray-900 text-base">{total}</td>
                          <td className={`p-3 text-center font-black ${gradeInfo.color}`}>{gradeInfo.grade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONDUCT */}
        {activeTab === 'conduct' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Conduct Assessment</h3>
            <p className="text-sm font-medium text-gray-600 mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-200 inline-block">
              Rate the student's behavior and skills. A = Excellent, F = Poor.
            </p>
            
            <div className="space-y-3">
              {data.conducts.map((conduct) => (
                <div key={conduct.id} className="bg-white p-4 rounded-xl border border-gray-300 hover:border-red-300 transition shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="font-bold text-gray-900">{conduct.name}</span>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((grade) => (
                        <label 
                          key={grade} 
                          className={`
                            cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all transform hover:scale-105 border
                            ${conduct.rating === grade 
                              ? 'bg-red-600 border-red-600 text-white shadow-md ring-2 ring-offset-2 ring-red-600' 
                              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400'}
                          `}
                        >
                          <input 
                            type="radio" 
                            name={`conduct-${conduct.id}`} 
                            value={grade}
                            checked={conduct.rating === grade}
                            onChange={() => handleConductChange(conduct.id, grade)}
                            className="hidden"
                          />
                          {grade}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REMARKS */}
        {activeTab === 'remarks' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-50 p-5 rounded-xl border border-indigo-200">
               <div>
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-indigo-600" />
                    AI Assistant
                  </h3>
                  <p className="text-xs font-medium text-indigo-700 mt-1">Generate professional remarks based on scores automatically.</p>
               </div>
               <button 
                  onClick={onGenerateRemarks}
                  disabled={isGenerating}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition font-bold"
                >
                  {isGenerating ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <Wand2 size={16} />
                  )}
                  Generate Remarks
                </button>
            </div>

            {/* Teacher Remark */}
            <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm">
              <label className={labelClasses}>Class Teacher's Remark</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TEACHER_COMMENTS.map((comment, i) => (
                  <button
                    key={i}
                    onClick={() => appendRemark('teacher', comment)}
                    className="text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full border border-gray-300 transition"
                  >
                    + {comment}
                  </button>
                ))}
              </div>
              <textarea 
                value={data.teacherRemark}
                onChange={(e) => handleInputChange('teacherRemark', e.target.value)}
                className={`${inputClasses} h-24 resize-none leading-relaxed`}
                placeholder="Write a comment about the student's progress..."
              ></textarea>
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Teacher's Name</label>
                <input 
                  type="text"
                  value={data.teacherName}
                  onChange={(e) => handleInputChange('teacherName', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Head Remark */}
            <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm">
              <label className={labelClasses}>Head of Preschool's Remark</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {HEAD_COMMENTS.map((comment, i) => (
                  <button
                    key={i}
                    onClick={() => appendRemark('head', comment)}
                    className="text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full border border-gray-300 transition"
                  >
                    + {comment}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                value={data.headRemark}
                onChange={(e) => handleInputChange('headRemark', e.target.value)}
                className={inputClasses}
                placeholder="Short endorsement..."
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Head of Preschool Name</label>
                    <input 
                      type="text"
                      value={data.headName}
                      onChange={(e) => handleInputChange('headName', e.target.value)}
                      className={inputClasses}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Head of School Name</label>
                    <input 
                      type="text"
                      value={data.headOfSchoolName}
                      onChange={(e) => handleInputChange('headOfSchoolName', e.target.value)}
                      className={inputClasses}
                    />
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
        <button 
          onClick={() => {
            if(activeTab === 'academic') setActiveTab('profile');
            if(activeTab === 'conduct') setActiveTab('academic');
            if(activeTab === 'remarks') setActiveTab('conduct');
          }}
          disabled={activeTab === 'profile'}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold px-4 py-2 transition hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="flex gap-2">
           {tabs.map(t => (
             <div key={t.id} className={`w-2.5 h-2.5 rounded-full transition-colors ${activeTab === t.id ? 'bg-red-600' : 'bg-gray-200'}`}></div>
           ))}
        </div>

        <button 
          onClick={() => {
            if(activeTab === 'profile') setActiveTab('academic');
            if(activeTab === 'academic') setActiveTab('conduct');
            if(activeTab === 'conduct') setActiveTab('remarks');
          }}
          disabled={activeTab === 'remarks'}
          className="flex items-center gap-2 bg-red-700 text-white px-6 py-2.5 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:bg-gray-400 font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
        >
          Next Step
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default InputForm;
