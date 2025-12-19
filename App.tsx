import React, { useState } from 'react';
import { Code2, User, GraduationCap, Shield, Building, FileText, Activity, Users, Book, Briefcase } from 'lucide-react';
import { MOCK_COURSES, MOCK_LABS, MOCK_PROJECTS } from './constants';
import { Course, LabSession, UserRole } from './types';

// Dashboards
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard, PrincipalDashboard, HODDashboard, ExamCellDashboard, CoordinatorDashboard, LibraryDashboard, TPODashboard } from './components/OtherDashboards';

type AppMode = 'landing' | UserRole;

function App() {
  const [appMode, setAppMode] = useState<AppMode>('landing');
  
  // Shared State (Lifted)
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [labs, setLabs] = useState<LabSession[]>([...MOCK_LABS, ...MOCK_PROJECTS]);

  const handleAddLab = (newLab: LabSession) => {
    setLabs([...labs, newLab]);
    setCourses(courses.map(c => c.id === newLab.courseId ? { ...c, totalLabs: c.totalLabs + 1 } : c));
  };

  const handleUpdateLab = (updatedLab: LabSession) => {
    setLabs(labs.map(l => l.id === updatedLab.id ? updatedLab : l));
  };

  // --- RENDERING LANDING PAGE ---
  if (appMode === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
         {/* Background effects */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
         </div>

         <div className="relative z-10 text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl mb-6 shadow-2xl shadow-indigo-500/20">
               <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">RB-ILMS</h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Role-Based Integrated Learning Management System
            </p>
         </div>

         <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl w-full">
            {[
               { id: 'student', label: 'Student', icon: User, color: 'text-indigo-400', bg: 'hover:border-indigo-500/50' },
               { id: 'faculty', label: 'Faculty', icon: GraduationCap, color: 'text-purple-400', bg: 'hover:border-purple-500/50' },
               { id: 'coordinator', label: 'Coordinator', icon: Users, color: 'text-pink-400', bg: 'hover:border-pink-500/50' },
               { id: 'hod', label: 'HOD', icon: Building, color: 'text-emerald-400', bg: 'hover:border-emerald-500/50' },
               { id: 'principal', label: 'Principal', icon: Activity, color: 'text-amber-400', bg: 'hover:border-amber-500/50' },
               { id: 'exam_cell', label: 'Exam Cell', icon: FileText, color: 'text-rose-400', bg: 'hover:border-rose-500/50' },
               { id: 'librarian', label: 'Librarian', icon: Book, color: 'text-cyan-400', bg: 'hover:border-cyan-500/50' },
               { id: 'tpo', label: 'Placement', icon: Briefcase, color: 'text-orange-400', bg: 'hover:border-orange-500/50' },
               { id: 'admin', label: 'Admin', icon: Shield, color: 'text-blue-400', bg: 'hover:border-blue-500/50' },
            ].map((role) => (
               <button 
                  key={role.id}
                  onClick={() => setAppMode(role.id as UserRole)}
                  className={`group bg-slate-900/50 border border-slate-800 ${role.bg} p-6 rounded-xl text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center justify-center`}
               >
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                     <role.icon className={`w-6 h-6 ${role.color}`} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{role.label}</h2>
                  <span className="text-xs text-slate-500 mt-1">Login as {role.label}</span>
               </button>
            ))}
         </div>
         
         <div className="mt-12 text-slate-500 text-xs relative z-10">
            © 2025 RB-ILMS | Version 1.0
         </div>
      </div>
    );
  }

  const logout = () => setAppMode('landing');

  // --- ROUTING ---
  switch (appMode) {
    case 'student': return <StudentDashboard onLogout={logout} />;
    case 'faculty': return <FacultyDashboard courses={courses} labs={labs} onAddLab={handleAddLab} onUpdateLab={handleUpdateLab} onLogout={logout} />;
    case 'admin': return <AdminDashboard role="admin" onLogout={logout} />;
    case 'principal': return <PrincipalDashboard role="principal" onLogout={logout} />;
    case 'hod': return <HODDashboard role="hod" onLogout={logout} />;
    case 'exam_cell': return <ExamCellDashboard role="exam_cell" onLogout={logout} />;
    case 'coordinator': return <CoordinatorDashboard role="coordinator" onLogout={logout} />;
    case 'librarian': return <LibraryDashboard role="librarian" onLogout={logout} />;
    case 'tpo': return <TPODashboard role="tpo" onLogout={logout} />;
    default: return null;
  }
}

export default App;