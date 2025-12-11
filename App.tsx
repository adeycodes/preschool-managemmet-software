
import React, { useState, useEffect } from 'react';
import { Printer, Save, FileSpreadsheet, Download, LogOut, FileText, ChevronLeft, Menu } from 'lucide-react';
import InputForm from './components/InputForm';
import ReportCard from './components/ReportCard';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { Settings } from './components/Settings';
import Sidebar from './components/Sidebar';
import { StudentData, INITIAL_SUBJECTS, INITIAL_CONDUCTS, User, AppSettings } from './types';
import { generateRemarks } from './services/geminiService';
import { generateExcel } from './services/excelService';
import { authService } from './services/authService';

// Extend window for html2pdf
declare global {
  interface Window {
    html2pdf: any;
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  schoolName: 'LAURASTEPHENS SCHOOL',
  schoolAddress: 'LauraStephens Road, Lekki Scheme II, Lekki-Epe Expressway, Lagos.',
  schoolPhone: '08137022005',
  term: 'Second (Spring)',
  session: '2024/2025',
  nextTermBegins: 'Monday, 28th April, 2025',
  defaultTeacherName: 'Adejolaoluwa Odekoya',
  defaultHeadName: 'Ozoro Elohor Sarah',
  defaultHeadOfSchoolName: 'Raymond Adeleke',
};

const createInitialStudent = (settings: AppSettings): StudentData => ({
  id: Date.now().toString(),
  schoolName: settings.schoolName,
  schoolAddress: settings.schoolAddress,
  schoolPhone: settings.schoolPhone,
  schoolLogoUrl: null,
  fullName: '',
  age: '' as any,
  gender: '',
  className: "Fabulous 3's",
  rollNumber: '',
  photoUrl: null,
  schoolOpened: 120,
  timesPresent: 0,
  subjects: JSON.parse(JSON.stringify(INITIAL_SUBJECTS)),
  conducts: JSON.parse(JSON.stringify(INITIAL_CONDUCTS)),
  teacherRemark: '',
  headRemark: '',
  // Use settings for defaults
  teacherName: settings.defaultTeacherName,
  headName: settings.defaultHeadName,
  headOfSchoolName: settings.defaultHeadOfSchoolName,
  term: settings.term,
  session: settings.session,
  nextTermBegins: settings.nextTermBegins
});

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false);

  // Data State
  const [students, setStudents] = useState<StudentData[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [isExcelGenerating, setIsExcelGenerating] = useState(false);

  // --- Effects ---

  // Auth Check
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  // Load Settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('kinderReport_settings');
    if (savedSettings) {
      try {
        setAppSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }
  }, []);

  // Save Settings
  useEffect(() => {
    localStorage.setItem('kinderReport_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // Load Roster
  useEffect(() => {
    const savedRoster = localStorage.getItem('kinderReport_roster');
    if (savedRoster) {
      try {
        const parsed = JSON.parse(savedRoster);
        // Hydration fix for schema updates
        const hydratedStudents = parsed.map((s: any) => ({
             ...s,
             // ensure school info exists if missing from old data
             schoolName: s.schoolName || DEFAULT_SETTINGS.schoolName,
             schoolAddress: s.schoolAddress || DEFAULT_SETTINGS.schoolAddress,
             schoolPhone: s.schoolPhone || DEFAULT_SETTINGS.schoolPhone,
             subjects: INITIAL_SUBJECTS.map(initSub => {
                const existing = s.subjects?.find((existingSub: any) => existingSub.id === initSub.id);
                return existing || initSub;
             }),
             conducts: INITIAL_CONDUCTS.map(initCon => {
                const existing = s.conducts?.find((e: any) => e.id === initCon.id);
                return existing || initCon;
             })
        }));
        setStudents(hydratedStudents);
      } catch (e) {
        console.error("Failed to load saved roster", e);
      }
    }
  }, []);

  // Save Roster
  useEffect(() => {
    if (students.length > 0) {
        localStorage.setItem('kinderReport_roster', JSON.stringify(students));
    }
  }, [students]);

  // --- Handlers ---

  const activeStudent = students.find(s => s.id === currentStudentId) || createInitialStudent(appSettings);

  const handleUpdateActiveStudent = (updatedData: StudentData) => {
    setStudents(prev => prev.map(s => s.id === updatedData.id ? updatedData : s));
  };

  const handleCreateStudent = () => {
    const newStudent = createInitialStudent(appSettings);
    // Inherit some fields from previous student for convenience (like Logo or Class)
    if (students.length > 0) {
        const last = students[students.length - 1];
        newStudent.className = last.className;
        newStudent.schoolLogoUrl = last.schoolLogoUrl;
    }
    setStudents(prev => [...prev, newStudent]);
    setCurrentStudentId(newStudent.id);
    setIsEditorActive(true);
  };

  const handleEditStudent = (student: StudentData) => {
    setCurrentStudentId(student.id);
    setIsEditorActive(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (currentStudentId === id) setIsEditorActive(false);
  };

  const handleGenerateRemarks = async () => {
    if (!process.env.API_KEY) {
      alert("API Key is missing.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const remarks = await generateRemarks(activeStudent);
      const updated = {
        ...activeStudent,
        teacherRemark: remarks.teacherRemark,
        headRemark: remarks.headRemark
      };
      handleUpdateActiveStudent(updated);
    } catch (error) {
      alert("Failed to generate remarks.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  const handleExcelExport = async () => {
    setIsExcelGenerating(true);
    try {
      await generateExcel(activeStudent);
    } catch (error) {
      alert("Failed to generate Excel file.");
    } finally {
      setIsExcelGenerating(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // --- Render ---

  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  // 1. Editor View (Full Screen Override)
  if (isEditorActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Editor Header - Added no-print */}
        <header className="bg-white border-b sticky top-0 z-20 px-4 h-16 flex items-center justify-between shadow-sm no-print">
           <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsEditorActive(false)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-700 transition"
              >
                  <ChevronLeft size={20} />
                  <span className="hidden sm:inline font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <span className="font-semibold text-gray-800 hidden sm:inline">
                Editing: {activeStudent.fullName || 'New Student'}
              </span>
           </div>

           <div className="flex items-center gap-2">
              {/* Mobile Preview Toggle */}
              <button 
                className="sm:hidden px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg"
                onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              >
                {showPreviewMobile ? 'Edit' : 'Preview'}
              </button>

              <button 
                onClick={handleExcelExport}
                disabled={isExcelGenerating}
                className="p-2 sm:px-3 sm:py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
              >
                <FileSpreadsheet size={18} />
                <span className="hidden sm:inline">Excel</span>
              </button>

              <button 
                onClick={handlePrint}
                className="p-2 sm:px-3 sm:py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-bold"
              >
                <Printer size={18} />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
           </div>
        </header>

        {/* Editor Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex gap-8">
            <div className={`flex-1 min-w-0 ${showPreviewMobile ? 'hidden' : 'block'} sm:block no-print`}>
              <InputForm 
                  data={activeStudent} 
                  onChange={handleUpdateActiveStudent} 
                  onGenerateRemarks={handleGenerateRemarks}
                  isGenerating={isGenerating}
              />
            </div>
            <div className={`flex-1 ${showPreviewMobile ? 'block' : 'hidden'} sm:block`}>
               <div className="sticky top-24">
                  <div className="overflow-auto max-h-[calc(100vh-12rem)] rounded-xl border border-gray-200 shadow-xl bg-gray-500/10 p-4 sm:p-8">
                    <ReportCard data={activeStudent} />
                  </div>
               </div>
            </div>
        </main>
      </div>
    );
  }

  // 2. Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
        user={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
        {/* Top Bar */}
        <header className="bg-white h-16 border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'Overview' : activeTab}
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
             {appSettings.term} • {appSettings.session}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                students={students}
                teacherName={currentUser.name || appSettings.defaultTeacherName}
                onCreate={handleCreateStudent}
                onEdit={handleEditStudent}
                onViewAll={() => setActiveTab('students')}
                className={students.length > 0 ? students[0].className : ''}
              />
            )}
            
            {activeTab === 'students' && (
              <StudentList 
                students={students}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onCreate={handleCreateStudent}
              />
            )}

            {activeTab === 'settings' && (
              <Settings 
                settings={appSettings}
                onSave={setAppSettings}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
