
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChange = (field: keyof AppSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Global Application Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">School Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.schoolAddress}
                  onChange={(e) => handleChange('schoolAddress', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.schoolPhone}
                  onChange={(e) => handleChange('schoolPhone', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Session & Term</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Term</label>
                <input
                  type="text"
                  value={formData.term}
                  onChange={(e) => handleChange('term', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>
                <input
                  type="text"
                  value={formData.session}
                  onChange={(e) => handleChange('session', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Term Begins</label>
                <input
                  type="text"
                  value={formData.nextTermBegins}
                  onChange={(e) => handleChange('nextTermBegins', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Signatures */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Default Signatories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Class Teacher</label>
                  <input
                    type="text"
                    value={formData.defaultTeacherName}
                    onChange={(e) => handleChange('defaultTeacherName', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Head of Preschool</label>
                  <input
                    type="text"
                    value={formData.defaultHeadName}
                    onChange={(e) => handleChange('defaultHeadName', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Head of School</label>
                  <input
                    type="text"
                    value={formData.defaultHeadOfSchoolName}
                    onChange={(e) => handleChange('defaultHeadOfSchoolName', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
               These settings will apply to all <strong>newly created</strong> students.
            </p>
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-700 text-white px-6 py-2.5 rounded-lg hover:bg-red-800 transition font-medium shadow-sm"
            >
              <Save size={20} />
              {isSaved ? 'Settings Saved!' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
