
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save, Upload, Trash2 } from 'lucide-react';

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

  const handleFileUpload = (field: keyof AppSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (field: keyof AppSettings) => {
      setFormData(prev => ({ ...prev, [field]: null }));
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

            {/* Signatures & Stamps */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Default Signatures & Stamps</h3>
              <p className="text-xs text-gray-500 mb-4">Upload these images to have them automatically applied to all new students.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Teacher Signature */}
                 <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Class Teacher Signature</label>
                    <input
                        type="text"
                        value={formData.defaultTeacherName}
                        onChange={(e) => handleChange('defaultTeacherName', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm mb-2"
                        placeholder="Default Teacher Name"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] relative bg-gray-50">
                        {formData.defaultTeacherSignatureUrl ? (
                            <>
                                <img src={formData.defaultTeacherSignatureUrl} alt="Signature" className="max-h-20 object-contain mb-2" />
                                <button type="button" onClick={() => clearImage('defaultTeacherSignatureUrl')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 size={14}/></button>
                            </>
                        ) : (
                            <label className="cursor-pointer text-center">
                                <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                <span className="text-xs text-blue-600 font-medium">Upload Image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('defaultTeacherSignatureUrl')} />
                            </label>
                        )}
                    </div>
                 </div>

                 {/* Head of Preschool Stamp */}
                 <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Head of Preschool Stamp</label>
                    <input
                        type="text"
                        value={formData.defaultHeadName}
                        onChange={(e) => handleChange('defaultHeadName', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm mb-2"
                        placeholder="Head Name"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] relative bg-gray-50">
                        {formData.defaultHeadTeacherStampUrl ? (
                            <>
                                <img src={formData.defaultHeadTeacherStampUrl} alt="Stamp" className="max-h-20 object-contain mb-2" />
                                <button type="button" onClick={() => clearImage('defaultHeadTeacherStampUrl')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 size={14}/></button>
                            </>
                        ) : (
                            <label className="cursor-pointer text-center">
                                <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                <span className="text-xs text-blue-600 font-medium">Upload Stamp</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('defaultHeadTeacherStampUrl')} />
                            </label>
                        )}
                    </div>
                 </div>

                 {/* Head of School Stamp */}
                 <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Head of School Stamp</label>
                    <input
                        type="text"
                        value={formData.defaultHeadOfSchoolName}
                        onChange={(e) => handleChange('defaultHeadOfSchoolName', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm mb-2"
                        placeholder="Head of School Name"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] relative bg-gray-50">
                        {formData.defaultHeadOfSchoolStampUrl ? (
                            <>
                                <img src={formData.defaultHeadOfSchoolStampUrl} alt="Stamp" className="max-h-20 object-contain mb-2" />
                                <button type="button" onClick={() => clearImage('defaultHeadOfSchoolStampUrl')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 size={14}/></button>
                            </>
                        ) : (
                            <label className="cursor-pointer text-center">
                                <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                <span className="text-xs text-blue-600 font-medium">Upload Stamp</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('defaultHeadOfSchoolStampUrl')} />
                            </label>
                        )}
                    </div>
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
