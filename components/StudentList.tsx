
import React, { useState } from 'react';
import { StudentData } from '../types';
import { Plus, Search, Edit, Trash2, Camera, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { calculateAverage } from '../utils';

interface StudentListProps {
  students: StudentData[];
  onEdit: (student: StudentData) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search students by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
        <button 
          onClick={onCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition shadow-sm font-medium"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Student Name</th>
              <th className="p-4 font-semibold hidden sm:table-cell">Class</th>
              <th className="p-4 font-semibold hidden md:table-cell">Status</th>
              <th className="p-4 font-semibold hidden md:table-cell">Avg Score</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => {
                 const avg = calculateAverage(student.subjects);
                 const hasPhoto = !!student.photoUrl;
                 const hasRemarks = !!student.teacherRemark;
                 const isComplete = hasPhoto && hasRemarks;

                 return (
                  <tr key={student.id} className="hover:bg-gray-50 group transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                              {student.fullName.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.fullName || 'Unnamed Student'}</p>
                          <div className="flex items-center gap-2 sm:hidden mt-1">
                             {/* Mobile Status Icons */}
                             {!hasPhoto && <Camera size={12} className="text-orange-500" />}
                             {!hasRemarks && <MessageSquare size={12} className="text-orange-500" />}
                             {isComplete && <CheckCircle size={12} className="text-green-500" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-gray-600">{student.className}</td>
                    
                    {/* Desktop Status Column */}
                    <td className="p-4 hidden md:table-cell">
                       <div className="flex items-center gap-3">
                         {isComplete ? (
                           <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                             <CheckCircle size={12} /> Ready
                           </span>
                         ) : (
                           <div className="flex gap-2">
                              {!hasPhoto && (
                                <span className="p-1.5 bg-orange-100 text-orange-600 rounded-md" title="Missing Photo">
                                  <Camera size={14} />
                                </span>
                              )}
                              {!hasRemarks && (
                                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-md" title="Missing Remarks">
                                  <MessageSquare size={14} />
                                </span>
                              )}
                           </div>
                         )}
                       </div>
                    </td>

                    <td className="p-4 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold
                        ${Number(avg) >= 70 ? 'bg-green-100 text-green-700' : 
                          Number(avg) >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }
                      `}>
                        {avg}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this student?')) {
                              onDelete(student.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <Search size={24} />
                    </div>
                    <p>No matching students found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
