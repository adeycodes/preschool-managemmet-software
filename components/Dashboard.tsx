
import React from 'react';
import { StudentData } from '../types';
import { StatsCards } from './StatsCards';
import { ArrowRight, Plus, CheckCircle, AlertCircle, Camera, MessageSquare, Clock } from 'lucide-react';

interface DashboardProps {
  students: StudentData[];
  teacherName: string;
  onCreate: () => void;
  onEdit: (student: StudentData) => void;
  onViewAll: () => void;
  className: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ students, teacherName, onCreate, onEdit, onViewAll, className }) => {
  // Logic to determine "Completeness"
  const getStudentStatus = (s: StudentData) => {
    const hasPhoto = !!s.photoUrl;
    const hasRemarks = !!s.teacherRemark && !!s.headRemark;
    const hasScores = s.subjects.some(sub => (sub.caScore + sub.examScore) > 0);
    
    const missing = [];
    if (!hasPhoto) missing.push('Photo');
    if (!hasRemarks) missing.push('Remarks');
    if (!hasScores) missing.push('Scores');
    
    return {
      isComplete: hasPhoto && hasRemarks && hasScores,
      missing
    };
  };

  const totalStudents = students.length;
  const completedCount = students.filter(s => getStudentStatus(s).isComplete).length;
  const progressPercentage = totalStudents === 0 ? 0 : Math.round((completedCount / totalStudents) * 100);

  const missingPhotosCount = students.filter(s => !s.photoUrl).length;
  const missingRemarksCount = students.filter(s => !s.teacherRemark).length;

  const recentStudents = students.slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* Welcome & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Header */}
        <div className="lg:col-span-2 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, <span className="text-red-700">{teacherName || 'Teacher'}</span> 👋
          </h1>
          <p className="text-gray-500">
            You have <strong className="text-gray-900">{totalStudents} students</strong> in <span className="font-medium text-gray-900">{className || 'your class'}</span>.
            Here is your report card generation progress.
          </p>
          
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-3xl font-bold text-gray-900">{completedCount}</span>
                <span className="text-gray-400 text-lg"> / {totalStudents}</span>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">Reports Ready</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">{progressPercentage}%</span>
                <p className="text-xs text-gray-400">Completion</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-orange-900 flex items-center gap-2 mb-4">
              <AlertCircle size={20} />
              Needs Attention
            </h3>
            <div className="space-y-3">
              {missingPhotosCount > 0 && (
                <div className="flex items-center gap-3 text-sm text-orange-800 bg-white/60 p-2 rounded-lg">
                  <Camera size={16} />
                  <span><strong>{missingPhotosCount}</strong> students missing photos</span>
                </div>
              )}
              {missingRemarksCount > 0 && (
                <div className="flex items-center gap-3 text-sm text-orange-800 bg-white/60 p-2 rounded-lg">
                  <MessageSquare size={16} />
                  <span><strong>{missingRemarksCount}</strong> students missing remarks</span>
                </div>
              )}
              {missingPhotosCount === 0 && missingRemarksCount === 0 && (
                <div className="flex items-center gap-3 text-sm text-green-700 bg-green-100/60 p-2 rounded-lg">
                  <CheckCircle size={16} />
                  <span>All data is looking good!</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onCreate}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-orange-700 border border-orange-200 px-4 py-2 rounded-xl hover:bg-orange-100 transition shadow-sm text-sm font-bold"
          >
            <Plus size={18} />
            Add New Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards students={students} className={className} />

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-gray-400" />
            Recently Updated
          </h2>
          <button 
            onClick={onViewAll}
            className="text-sm text-red-700 font-medium hover:underline flex items-center gap-1"
          >
            View Class Roster
            <ArrowRight size={16} />
          </button>
        </div>

        {recentStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentStudents.map(student => {
              const status = getStudentStatus(student);
              return (
                <button 
                  key={student.id} 
                  onClick={() => onEdit(student)}
                  className="text-left group p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:shadow-md transition bg-gray-50/50 hover:bg-white relative"
                >
                  {/* Status Dot */}
                  <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${status.isComplete ? 'bg-green-500' : 'bg-orange-400'}`}></div>

                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm relative">
                      {student.photoUrl ? (
                        <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xl">
                          {student.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm truncate w-full leading-tight">{student.fullName || 'New Student'}</p>
                      <p className="text-xs text-gray-500 mt-1">{status.isComplete ? 'Ready' : 'In Progress'}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-2">You haven't added any students yet.</p>
            <button onClick={onCreate} className="text-red-700 font-medium hover:underline">
              Get started by adding your first student
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
