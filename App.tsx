
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Printer, Save, FileSpreadsheet, Download, LogOut, FileText, ChevronLeft, Menu, Cloud, CloudOff, RefreshCw, Upload } from 'lucide-react';
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
import { authService, supabase } from './services/authService';
import { db } from './services/db';

// Extend window for html2pdf
declare global {
  interface Window {
    html2pdf: any;
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  schoolName: 'LauraStephens School',
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
  schoolCrestUrl: settings.defaultSchoolCrestUrl || null,
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
  
  // Inherit images
  teacherSignatureUrl: settings.defaultTeacherSignatureUrl,
  headTeacherStampUrl: settings.defaultHeadTeacherStampUrl,
  headOfSchoolStampUrl: settings.defaultHeadOfSchoolStampUrl,

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
  
  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>('');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: Is Guest?
  const isGuest = currentUser?.id === 'guest-user';

  // --- Effects ---

  // 1. Auth & Session Check
  useEffect(() => {
    // Check local storage first
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);

    // Listen for Supabase auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
         const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Teacher',
            username: session.user.user_metadata?.username || '',
            role: session.user.user_metadata?.role || 'teacher'
         };
         localStorage.setItem('kinderReport_currentUser', JSON.stringify(mappedUser));
         setCurrentUser(mappedUser);
      } else if (event === 'SIGNED_OUT') {
         setCurrentUser(null);
         localStorage.removeItem('kinderReport_currentUser');
         setStudents([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Data Loading & MIGRATION
  useEffect(() => {
    if (!currentUser) return;

    const loadAndMigrateData = async () => {
      setIsLoadingData(true);
      
      if (isGuest) {
        // --- GUEST MODE: Load from Local Storage ---
        const settingsKey = `kinderReport_settings_${currentUser.id}`;
        const savedSettings = localStorage.getItem(settingsKey);
        if (savedSettings) setAppSettings(JSON.parse(savedSettings));

        const rosterKey = `kinderReport_roster_${currentUser.id}`;
        const savedRoster = localStorage.getItem(rosterKey);
        if (savedRoster) {
          try {
             // Hydration for legacy data
             const parsed = JSON.parse(savedRoster).map((s: any) => ({
                ...s,
                subjects: INITIAL_SUBJECTS.map(initSub => s.subjects?.find((existing: any) => existing.id === initSub.id) || initSub),
                conducts: INITIAL_CONDUCTS.map(initCon => s.conducts?.find((e: any) => e.id === initCon.id) || initCon)
             }));
             setStudents(parsed);
          } catch(e) { console.error("Error parsing local roster", e); }
        }
        setIsLoadingData(false);

      } else {
        // --- AUTH MODE: Cloud Sync & Migration ---
        try {
          // A. Check for "Guest" data or "Legacy" data to migrate
          // We look for the 'guest-user' key because that's where their offline data lives
          const legacyRosterKey = 'kinderReport_roster_guest-user';
          const legacySettingsKey = 'kinderReport_settings_guest-user';
          const localRoster = localStorage.getItem(legacyRosterKey);
          const localSettings = localStorage.getItem(legacySettingsKey);

          let hasMigrated = false;

          if (localRoster) {
            setMigrationStatus('Found offline data. Syncing to cloud...');
            const parsedRoster: StudentData[] = JSON.parse(localRoster);
            
            // Upload each student to Supabase associated with the NEW userId
            const uploadPromises = parsedRoster.map(student => 
               db.upsertStudent(currentUser.id, { ...student }) // The DB service handles the user_id association
            );
            
            await Promise.all(uploadPromises);
            
            // Rename the local key so we don't migrate again next time
            localStorage.setItem(`${legacyRosterKey}_migrated_to_${currentUser.id}`, localRoster);
            localStorage.removeItem(legacyRosterKey);
            
            // Migrate Settings
            if (localSettings) {
                const parsedSettings = JSON.parse(localSettings);
                await db.saveSettings(currentUser.id, parsedSettings);
                localStorage.removeItem(legacySettingsKey);
            }

            hasMigrated = true;
            setMigrationStatus('Sync complete!');
            setTimeout(() => setMigrationStatus(''), 2000);
          }

          // B. Fetch fresh data from Cloud (which now contains migrated data)
          const [remoteSettings, remoteStudents] = await Promise.all([
             db.fetchSettings(currentUser.id),
             db.fetchStudents(currentUser.id)
          ]);
          
          if (remoteSettings) setAppSettings(remoteSettings);
          if (remoteStudents) setStudents(remoteStudents);
          
        } catch (error) {
          console.error("Failed to load/migrate cloud data", error);
          alert("Could not sync with the cloud. Please check your internet connection.");
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadAndMigrateData();
  }, [currentUser, isGuest]);

  // --- Data Persistence Helpers ---

  // Debounced Save for Student Updates
  const queueStudentSave = useCallback((student: StudentData) => {
    if (isGuest) {
      return; 
    }

    // Cloud Save
    setIsSyncing(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (currentUser) {
          await db.upsertStudent(currentUser.id, student);
        }
      } catch (err) {
        console.error("Save failed", err);
      } finally {
        setIsSyncing(false);
      }
    }, 1500); // 1.5s debounce
  }, [currentUser, isGuest]);


  // Immediate Save for Creates/Deletes/Settings
  const saveStudentImmediate = async (student: StudentData) => {
    if (isGuest) return; // Handled by effect
    setIsSyncing(true);
    try {
      if (currentUser) await db.upsertStudent(currentUser.id, student);
    } finally { setIsSyncing(false); }
  };

  const deleteStudentImmediate = async (id: string) => {
    if (isGuest) return; // Handled by effect
    setIsSyncing(true);
    try {
      if (currentUser) await db.deleteStudent(id);
    } finally { setIsSyncing(false); }
  };

  const saveSettingsImmediate = async (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    if (isGuest) {
      localStorage.setItem(`kinderReport_settings_${currentUser?.id}`, JSON.stringify(newSettings));
    } else if (currentUser) {
      setIsSyncing(true);
      try {
        await db.saveSettings(currentUser.id, newSettings);
      } finally { setIsSyncing(false); }
    }
  };


  // --- Effect for Guest LocalStorage Persistence ---
  useEffect(() => {
    if (isGuest && currentUser) {
      localStorage.setItem(`kinderReport_roster_${currentUser.id}`, JSON.stringify(students));
    }
  }, [students, isGuest, currentUser]);


  // --- Handlers ---

  const activeStudent = students.find(s => s.id === currentStudentId) || createInitialStudent(appSettings);

  const handleUpdateActiveStudent = (updatedData: StudentData) => {
    setStudents(prev => prev.map(s => s.id === updatedData.id ? updatedData : s));
    queueStudentSave(updatedData);
  };

  const handleCreateStudent = () => {
    const newStudent = createInitialStudent(appSettings);
    // Inherit fields logic
    if (students.length > 0) {
        const last = students[students.length - 1];
        newStudent.className = last.className;
        newStudent.schoolLogoUrl = last.schoolLogoUrl;
        newStudent.schoolCrestUrl = last.schoolCrestUrl || newStudent.schoolCrestUrl;
        newStudent.teacherSignatureUrl = last.teacherSignatureUrl || newStudent.teacherSignatureUrl;
        newStudent.headTeacherStampUrl = last.headTeacherStampUrl || newStudent.headTeacherStampUrl;
        newStudent.headOfSchoolStampUrl = last.headOfSchoolStampUrl || newStudent.headOfSchoolStampUrl;
    }
    
    setStudents(prev => [...prev, newStudent]);
    setCurrentStudentId(newStudent.id);
    setIsEditorActive(true);
    saveStudentImmediate(newStudent);
  };

  const handleEditStudent = (student: StudentData) => {
    setCurrentStudentId(student.id);
    setIsEditorActive(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (currentStudentId === id) setIsEditorActive(false);
    deleteStudentImmediate(id);
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
      handleUpdateActiveStudent(updated); // This will trigger queueSave
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
    setStudents([]); 
  };

  // --- Render ---

  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        {migrationStatus ? (
          <>
             <Upload className="animate-bounce text-blue-600" size={48} />
             <p className="text-xl font-bold text-gray-800">{migrationStatus}</p>
             <p className="text-sm text-gray-500">Please wait while we secure your data to the cloud...</p>
          </>
        ) : (
          <>
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
             <p className="text-gray-500 font-medium">Syncing your classroom...</p>
          </>
        )}
      </div>
    );
  }

  // 1. Editor View
  if (isEditorActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
              
              {/* Sync Status Indicator */}
              {!isGuest && (
                 <div className="ml-2 flex items-center gap-1.5 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                    {isSyncing ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-blue-600" />
                        <span className="text-blue-600">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Cloud size={12} />
                        <span>Saved</span>
                      </>
                    )}
                 </div>
              )}
           </div>

           <div className="flex items-center gap-2">
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
                    <ReportCard 
                      data={{
                        ...activeStudent,
                        schoolName: appSettings.schoolName,
                        schoolAddress: appSettings.schoolAddress,
                        schoolPhone: appSettings.schoolPhone,
                        term: appSettings.term,
                        session: appSettings.session,
                        nextTermBegins: appSettings.nextTermBegins,
                        // Defaults
                        schoolCrestUrl: activeStudent.schoolCrestUrl || appSettings.defaultSchoolCrestUrl,
                        teacherSignatureUrl: activeStudent.teacherSignatureUrl || appSettings.defaultTeacherSignatureUrl,
                        headTeacherStampUrl: activeStudent.headTeacherStampUrl || appSettings.defaultHeadTeacherStampUrl,
                        headOfSchoolStampUrl: activeStudent.headOfSchoolStampUrl || appSettings.defaultHeadOfSchoolStampUrl,
                      }} 
                    />
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
          <div className="flex items-center gap-4">
              {!isGuest && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                   {isSyncing ? <RefreshCw size={14} className="animate-spin text-blue-500" /> : <Cloud size={14} className="text-green-500" />}
                   <span>{isSyncing ? 'Syncing...' : 'Cloud Connected'}</span>
                </div>
              )}
             <div className="text-sm text-gray-500 hidden sm:block">
                {appSettings.term} • {appSettings.session}
             </div>
          </div>
        </header>

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
                onSave={saveSettingsImmediate}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
