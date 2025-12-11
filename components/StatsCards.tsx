
import React from 'react';
import { Users, FileCheck, AlertCircle, Percent } from 'lucide-react';
import { StudentData } from '../types';
import { calculateAverage } from '../utils';

interface StatsCardsProps {
  students: StudentData[];
  className?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ students }) => {
  const totalStudents = students.length;
  
  // Logic for completeness
  const completedReports = students.filter(s => 
    !!s.photoUrl && !!s.teacherRemark && !!s.headRemark
  ).length;

  const pendingReports = totalStudents - completedReports;
  
  const classAverage = students.length > 0 
    ? (students.reduce((acc, curr) => acc + parseFloat(calculateAverage(curr.subjects) as string), 0) / students.length).toFixed(1)
    : '0';

  const cards = [
    {
      label: 'Class Size',
      value: totalStudents,
      icon: Users,
      color: 'blue',
      subText: 'Total Enrolled'
    },
    {
      label: 'Reports Ready',
      value: completedReports,
      icon: FileCheck,
      color: 'green',
      subText: 'Ready to Print'
    },
    {
      label: 'Pending',
      value: pendingReports,
      icon: AlertCircle,
      color: 'orange',
      subText: 'Needs Completion'
    },
    {
      label: 'Class Average',
      value: `${classAverage}%`,
      icon: Percent,
      color: 'purple',
      subText: 'Performance'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = {
          blue: 'bg-blue-50 text-blue-600 border-blue-100',
          green: 'bg-green-50 text-green-600 border-green-100',
          orange: 'bg-orange-50 text-orange-600 border-orange-100',
          purple: 'bg-purple-50 text-purple-600 border-purple-100',
        }[card.color];

        return (
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.subText}</p>
            </div>
            <div className={`p-3 rounded-xl border ${colorClasses}`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
