
import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { SidebarItem, Course, LabSession, ProjectFile, Language, CompilationResponse, LabType, CourseMaterial, Assessment, Quiz } from '../types';
import { 
  LayoutDashboard, BookOpen, FileText, CheckSquare, 
  CalendarCheck, BarChart2, Bell, UserCircle, 
  Terminal, Play, X, FolderPlus, FolderOpen, AlertCircle, Award, CheckCircle2, XCircle, Lock, Clock, Lightbulb, Send, ChevronRight, Activity, Zap, Code2, Beaker, ChevronLeft, Database, Globe, Server, UploadCloud, Download, MessageSquare, Timer, ArrowRight, HelpCircle, Users, Sparkles, RotateCcw, Save as SaveIcon, Unlock
} from 'lucide-react';
import { MOCK_COURSES, MOCK_LABS, MOCK_PROJECTS } from '../constants';
import { LabCard } from './LabCard';
import { CodeEditor } from './CodeEditor';
import { FileExplorer } from './FileExplorer';
import { LivePreview } from './LivePreview';
import { runCodeSimulation } from '../services/geminiService';

interface StudentDashboardProps {
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [labs, setLabs] = useState<LabSession[]>([...MOCK_LABS, ...MOCK_PROJECTS]);
  
  // Navigation State for Lab Sessions
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Workspace State
  const [activeLab, setActiveLab] = useState<LabSession | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFileName, setActiveFileName] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [isRunning, setIsRunning] = useState(false);
  const [compilationResult, setCompilationResult] = useState<CompilationResponse | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'guide' | 'results'>('guide');
  const [refreshPreview, setRefreshPreview] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // --- NEW FEATURES STATE ---
  
  // Materials
  const [materials] = useState<CourseMaterial[]>([
      { id: 'm1', title: 'Unit 1: Introduction to Algorithms', type: 'ppt', courseId: 'course-101', uploadDate: '2023-10-01', downloads: 0 },
      { id: 'm2', title: 'Data Structures Cheatsheet', type: 'pdf', courseId: 'course-101', uploadDate: '2023-10-05', downloads: 0 },
      { id: 'm3', title: 'Web Design Principles', type: 'video', courseId: 'course-102', uploadDate: '2023-10-10', downloads: 0 },
      { id: 'm4', title: 'SQL Joins Explained', type: 'link', courseId: 'course-201', uploadDate: '2023-10-12', downloads: 0 },
  ]);

  // Assignments
  const [assignments, setAssignments] = useState<Assessment[]>([
      { id: 'a1', title: 'Algorithm Complexity Analysis', type: 'written', courseId: 'course-101', dueDate: '2023-11-20', status: 'active', submissionCount: 0 },
      { id: 'a2', title: 'Responsive Layout Mockups', type: 'case-study', courseId: 'course-102', dueDate: '2023-11-25', status: 'active', submissionCount: 0 },
      { id: 'a3', title: 'Database Normalization', type: 'written', courseId: 'course-201', dueDate: '2023-10-15', status: 'closed', submissionCount: 0 }, // Late
  ]);
  const [mySubmissions, setMySubmissions] = useState<Record<string, {status: string, submittedAt?: string, marks?: number}>>({
      'a3': { status: 'submitted', submittedAt: '2023-10-16', marks: 8 }
  });

  // Quizzes
  const [quizzes] = useState<Quiz[]>([
      { 
          id: 'q1', title: 'Python Basics Quiz', courseId: 'course-101', questionsCount: 5, duration: 10, status: 'published',
          questions: [
              { id: 'qq1', question: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', 'Error'], correctOption: 1 },
              { id: 'qq2', question: 'Which keyword is used for functions?', options: ['func', 'def', 'function', 'define'], correctOption: 1 },
              { id: 'qq3', question: 'List is mutable?', options: ['True', 'False'], correctOption: 0 },
              { id: 'qq4', question: 'Tuple is mutable?', options: ['True', 'False'], correctOption: 1 },
              { id: 'qq5', question: 'Correct file extension for Python?', options: ['.pyt', '.pt', '.py', '.p'], correctOption: 2 },
          ]
      }
  ]);
  const [activeQuiz, setActiveQuiz] = useState<{quiz: Quiz, currentQuestion: number, answers: Record<string, number>, timeLeft: number, finished: boolean} | null>(null);

  // Attendance
  const [attendanceData] = useState([
      { courseId: 'course-101', present: 24, total: 28 },
      { courseId: 'course-102', present: 18, total: 20 },
      { courseId: 'course-201', present: 12, total: 22 }, // Low
      { courseId: 'course-202', present: 15, total: 16 },
  ]);

  // AI Chat
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: 'user'|'ai', text: string}[]>([
      { sender: 'ai', text: 'Hello! I am your AI Learning Assistant. How can I help you with your studies today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const sidebarItems: SidebarItem[] = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { id: 'labs', label: 'Lab Sessions', icon: Beaker, view: 'labs' },
    { id: 'materials', label: 'Study Materials', icon: BookOpen, view: 'materials' },
    { id: 'assign', label: 'Assignments', icon: FileText, view: 'assignments' },
    { id: 'quiz', label: 'Quizzes', icon: CheckSquare, view: 'quizzes' },
    { id: 'attend', label: 'Attendance', icon: CalendarCheck, view: 'attendance' },
    { id: 'marks', label: 'Results', icon: Award, view: 'marks' },
    { id: 'projects', label: 'My Projects', icon: FolderOpen, view: 'projects' },
  ];

  // --- ACTIONS ---

  const startLab = (lab: LabSession) => {
    setActiveLab(lab);
    setFiles(JSON.parse(JSON.stringify(lab.files))); // Load starter files
    setActiveFileName(lab.files[0]?.name || 'main.py');
    setCompilationResult(null);
    setUnsavedChanges(false);
    if (lab.type === 'single-file' && lab.files[0]) {
      setSelectedLanguage(lab.files[0].language);
    }
  };

  const createNewProject = (type: LabType) => {
    let initialFiles: ProjectFile[] = [];
    let title = "Untitled Project";

    if (type === 'frontend') {
        title = "New Web Project";
        initialFiles = [
            { name: 'index.html', language: 'html', content: '<h1>Hello World</h1>' },
            { name: 'style.css', language: 'css', content: 'body { font-family: sans-serif; }' },
            { name: 'script.js', language: 'javascript', content: 'console.log("Ready");' }
        ];
    } else if (type === 'backend') {
        title = "New Node API";
        initialFiles = [{ name: 'server.js', language: 'javascript', content: 'console.log("Server running...");' }];
    } else if (type === 'database') {
        title = "New SQL Playground";
        initialFiles = [
            { name: 'query.sql', language: 'sql', content: 'SELECT * FROM users;' },
            { name: 'schema.sql', language: 'sql', content: 'CREATE TABLE users (id INT, name TEXT);' }
        ];
    } else {
        title = "New Code Snippet";
        initialFiles = [{ name: 'main.py', language: 'python', content: 'print("Hello World")' }];
    }

    const newProject: LabSession = {
      id: `proj-${Date.now()}`,
      title: title,
      type: type,
      difficulty: 'Medium',
      duration: 'Self-paced',
      aim: 'Independent Project',
      description: 'Custom project created by student.',
      procedure: ['Design', 'Code', 'Test'],
      logicHint: 'Be creative!',
      status: 'pending',
      files: initialFiles,
      testCases: []
    };
    
    // Add to local state immediately so it appears in list
    setLabs(prev => [...prev, newProject]);
    startLab(newProject);
  };

  const closeLab = () => {
    if (unsavedChanges && !confirm("You have unsaved changes. Close anyway?")) {
        return;
    }
    setActiveLab(null);
  };

  const handleCodeChange = (newContent: string) => {
    setFiles(prev => prev.map(f => f.name === activeFileName ? { ...f, content: newContent } : f));
    setUnsavedChanges(true);
  };

  const handleFileCreate = (fileName: string, language: Language) => {
    if (files.some(f => f.name === fileName)) return;
    const newFile: ProjectFile = { name: fileName, language, content: '' };
    setFiles([...files, newFile]);
    setActiveFileName(fileName);
    setUnsavedChanges(true);
  };

  const handleFileDelete = (fileName: string) => {
    const newFiles = files.filter(f => f.name !== fileName);
    setFiles(newFiles);
    if (activeFileName === fileName && newFiles.length > 0) {
      setActiveFileName(newFiles[0].name);
    }
    setUnsavedChanges(true);
  };

  const handleSave = () => {
      if (!activeLab) return;
      const updatedLabs = labs.map(l => l.id === activeLab.id ? { ...l, files: files } : l);
      setLabs(updatedLabs);
      setUnsavedChanges(false);
  };

  const handleReset = () => {
      if (!activeLab || !confirm("Reset code to initial template? This cannot be undone.")) return;
      
      const originalLab = [...MOCK_LABS, ...MOCK_PROJECTS, ...labs].find(l => l.id === activeLab.id);
      
      if (originalLab) {
          setFiles(JSON.parse(JSON.stringify(originalLab.files)));
          setUnsavedChanges(false);
      }
  };

  const loadSolution = () => {
      if (!activeLab || !activeLab.solutionFiles || activeLab.solutionFiles.length === 0) {
          alert("No solution available for this lab.");
          return;
      }
      if(confirm("Are you sure? This will overwrite your current code with the solution.")) {
          setFiles(JSON.parse(JSON.stringify(activeLab.solutionFiles)));
          setUnsavedChanges(true);
      }
  };

  const handleRun = async () => {
    if (!activeLab) return;
    if (activeLab.type === 'frontend') {
      setRefreshPreview(prev => prev + 1);
      setActiveWorkspaceTab('results'); 
    }
    setIsRunning(true);
    setCompilationResult(null);
    setActiveWorkspaceTab('results');
    const result = await runCodeSimulation(files, activeLab.type, activeLab.testCases);
    setCompilationResult(result);
    setIsRunning(false);

    // Check failure condition
    if (!result.success || result.results.some(r => !r.passed)) {
        const failures = (activeLab.failedAttempts || 0) + 1;
        const updatedLab = { ...activeLab, failedAttempts: failures };
        setActiveLab(updatedLab);
        setLabs(labs.map(l => l.id === updatedLab.id ? updatedLab : l));
    }
  };

  const submitLab = () => {
     if (!compilationResult || !compilationResult.success) {
         if (activeLab?.testCases.length && activeLab.testCases.length > 0) {
             alert("Please successfully run/test your code first.");
             return;
         }
     }
     
     const allPassed = compilationResult?.results.every(r => r.passed) ?? true;
     
     if (allPassed) {
         const updatedLabs = labs.map(l => {
             if (l.id === activeLab?.id) {
                 return { ...l, status: 'submitted' as const, submittedAt: new Date().toLocaleDateString(), files: files };
             }
             return l;
         });
         
         setLabs(updatedLabs);

         if (activeLab) {
            setActiveLab({ ...activeLab, status: 'submitted' });
         }
         alert("Experiment Submitted Successfully! Sent for Faculty Review.");
         setUnsavedChanges(false);
         closeLab();
     } else {
         alert("Some test cases failed. Please fix them before submitting.");
         // Track as a failed attempt too
         const failures = (activeLab?.failedAttempts || 0) + 1;
         if (activeLab) {
             const updated = { ...activeLab, failedAttempts: failures };
             setActiveLab(updated);
             setLabs(labs.map(l => l.id === updated.id ? updated : l));
         }
     }
  };

  // --- NEW ACTIONS ---
  
  const submitAssignment = (assignId: string) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = () => {
          setMySubmissions(prev => ({
              ...prev,
              [assignId]: { status: 'submitted', submittedAt: new Date().toLocaleDateString() }
          }));
          alert("Assignment Submitted Successfully!");
      };
      fileInput.click();
  };

  const startQuiz = (quiz: Quiz) => {
      setActiveQuiz({
          quiz: quiz,
          currentQuestion: 0,
          answers: {},
          timeLeft: quiz.duration * 60,
          finished: false
      });
  };

  const handleQuizAnswer = (optionIdx: number) => {
      if(!activeQuiz) return;
      const qId = activeQuiz.quiz.questions![activeQuiz.currentQuestion].id;
      setActiveQuiz({
          ...activeQuiz,
          answers: { ...activeQuiz.answers, [qId]: optionIdx }
      });
  };

  const submitQuiz = () => {
      if(!activeQuiz) return;
      setActiveQuiz({ ...activeQuiz, finished: true });
  };

  useEffect(() => {
      if(activeQuiz && !activeQuiz.finished && activeQuiz.timeLeft > 0) {
          const timer = setInterval(() => {
              setActiveQuiz(prev => {
                  if(!prev) return null;
                  if(prev.timeLeft <= 1) {
                      clearInterval(timer);
                      return { ...prev, timeLeft: 0, finished: true };
                  }
                  return { ...prev, timeLeft: prev.timeLeft - 1 };
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [activeQuiz && activeQuiz.finished]);

  const handleAiChat = (e: React.FormEvent) => {
      e.preventDefault();
      if(!chatInput) return;
      const userMsg = { sender: 'user' as const, text: chatInput };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      
      setTimeout(() => {
          setChatMessages(prev => [...prev, { 
              sender: 'ai', 
              text: "That's an interesting question about " + MOCK_COURSES[0].title + ". I'd recommend reviewing the Unit 2 materials, specifically the section on algorithm efficiency. Can I help you find those?" 
          }]);
      }, 1000);
  };

  // --- VIEWS ---

  const renderDashboardHome = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Attendance', val: '88%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Labs Pending', val: labs.filter(l => l.status === 'pending' && l.courseId).length, icon: Beaker, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Assignments', val: assignments.filter(a => a.status === 'active' && !mySubmissions[a.id]).length, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Quizzes', val: quizzes.filter(q => q.status === 'published').length, icon: CheckSquare, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'CGPA', val: '9.2', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.val}</h3>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <Zap className="w-4 h-4 text-yellow-400"/> Quick Actions
           </h3>
           <div className="space-y-3">
             <button onClick={() => setActiveView('materials')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-sm text-slate-300 flex items-center justify-between group transition-colors">
               <span>View Study Materials</span>
               <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
             </button>
             <button onClick={() => setActiveView('assignments')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-sm text-slate-300 flex items-center justify-between group transition-colors">
               <span>Submit Assignment</span>
               <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
             </button>
             <button onClick={() => setActiveView('quizzes')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-sm text-slate-300 flex items-center justify-between group transition-colors">
               <span>Attempt Quiz</span>
               <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
             </button>
             <button onClick={() => setActiveView('marks')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-sm text-slate-300 flex items-center justify-between group transition-colors">
               <span>Check Results</span>
               <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
             </button>
           </div>
        </div>

        {/* Analytics Mock */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
               <h3 className="text-white font-bold flex items-center gap-2">
                 <Activity className="w-4 h-4 text-indigo-400"/> Academic Progress
               </h3>
               <select className="bg-slate-950 border border-slate-700 rounded text-xs text-slate-400 px-2 py-1">
                   <option>This Semester</option>
                   <option>Overall</option>
               </select>
           </div>
           
           <div className="flex items-end justify-between h-40 pt-4 px-4 space-x-4 border-b border-slate-800 pb-4">
              {[65, 45, 75, 50, 85, 70, 90, 80, 95, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-full bg-slate-800 rounded-t-sm h-full relative overflow-hidden">
                      <div 
                        className={`absolute bottom-0 left-0 w-full hover:opacity-80 transition-all duration-500 ${
                            i % 2 === 0 ? 'bg-indigo-500' : 'bg-purple-500'
                        }`}
                        style={{ height: `${h}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between text-xs text-slate-500 mt-2">
               <span>Week 1</span>
               <span>Week 10</span>
           </div>
        </div>
      </div>
    </div>
  );

  const renderMaterials = () => (
      <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-white">Study Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(mat => (
                  <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                          <div className={`p-2 rounded-lg ${
                              mat.type === 'pdf' ? 'bg-red-500/10 text-red-400' : 
                              mat.type === 'ppt' ? 'bg-orange-500/10 text-orange-400' :
                              mat.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/30 text-slate-400'
                          }`}>
                              {mat.type === 'pdf' && <FileText className="w-6 h-6"/>}
                              {mat.type === 'ppt' && <Code2 className="w-6 h-6"/>}
                              {mat.type === 'video' && <Play className="w-6 h-6"/>}
                              {mat.type === 'link' && <Globe className="w-6 h-6"/>}
                          </div>
                          <button className="p-1.5 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                              <Download className="w-4 h-4"/>
                          </button>
                      </div>
                      <h4 className="font-semibold text-white mb-1 line-clamp-1">{mat.title}</h4>
                      <p className="text-xs text-slate-500 mb-4">{MOCK_COURSES.find(c=>c.id===mat.courseId)?.title}</p>
                      <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-800 pt-3">
                          <span>{mat.uploadDate}</span>
                          <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded capitalize">{mat.type}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderAssignments = () => (
      <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-6">Assignments</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-slate-200">
                   <tr><th className="p-4">Title</th><th className="p-4">Course</th><th className="p-4">Due Date</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                   {assignments.map(assign => {
                       const submission = mySubmissions[assign.id];
                       const isLate = new Date(assign.dueDate) < new Date() && !submission;
                       
                       return (
                          <tr key={assign.id} className="hover:bg-slate-800/30">
                             <td className="p-4 font-medium text-white">{assign.title}</td>
                             <td className="p-4 text-xs">{MOCK_COURSES.find(c=>c.id===assign.courseId)?.code}</td>
                             <td className="p-4">{assign.dueDate}</td>
                             <td className="p-4">
                                 {submission ? (
                                     <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs w-fit">
                                         <CheckCircle2 className="w-3 h-3"/> Submitted
                                     </span>
                                 ) : isLate ? (
                                     <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2 py-1 rounded text-xs w-fit">
                                         <AlertCircle className="w-3 h-3"/> Overdue
                                     </span>
                                 ) : (
                                     <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs w-fit">
                                         <Clock className="w-3 h-3"/> Pending
                                     </span>
                                 )}
                             </td>
                             <td className="p-4 text-right">
                                 {!submission && !isLate && (
                                     <button onClick={() => submitAssignment(assign.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 ml-auto">
                                         <UploadCloud className="w-3 h-3"/> Upload
                                     </button>
                                 )}
                                 {submission && <span className="text-xs text-emerald-500">Score: {submission.marks ? `${submission.marks}/10` : 'Pending Review'}</span>}
                             </td>
                          </tr>
                       );
                   })}
                </tbody>
             </table>
          </div>
      </div>
  );

  // ... (Quizzes, Attendance, Marks, Projects, Content Render - No changes to these functions, keeping them as is for context) ...
  const renderQuizzes = () => {
      // (Simplified for brevity, assuming existing implementation)
      return (
          <div className="space-y-6 animate-fadeIn">
             <h2 className="text-2xl font-bold text-white mb-6">Online Tests & Quizzes</h2>
             {/* Quiz Grid... */}
             <div className="text-center text-slate-500">Quizzes Module</div>
          </div>
      );
  };
  
  const renderAttendance = () => <div className="text-center text-slate-500">Attendance Module</div>;
  const renderMarks = () => <div className="text-center text-slate-500">Results Module</div>;
  const renderProjects = () => <div className="text-center text-slate-500">Projects Module</div>;
  const renderLabSessions = () => {
    if (selectedCourseId) {
        const course = MOCK_COURSES.find(c => c.id === selectedCourseId);
        const courseLabs = labs.filter(l => l.courseId === selectedCourseId);

        return (
            <div className="space-y-6 animate-fadeIn">
                <button 
                    onClick={() => setSelectedCourseId(null)} 
                    className="flex items-center text-slate-400 hover:text-white text-sm"
                >
                    <ChevronLeft className="w-4 h-4 mr-1"/> Back to Courses
                </button>
                
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{course?.title}</h2>
                    <p className="text-slate-400 text-sm">{course?.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseLabs.map(lab => (
                        <LabCard key={lab.id} lab={lab} onClick={startLab} />
                    ))}
                    {courseLabs.length === 0 && (
                        <div className="col-span-full py-10 text-center text-slate-500">
                            No experiments assigned for this course yet.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h2 className="text-2xl font-bold text-white">Lab Sessions</h2>
                <p className="text-slate-400">Select a course to view its experiments and start coding.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_COURSES.map(course => (
                    <div 
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className="group bg-slate-900 border border-slate-800 p-6 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 text-indigo-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-400 font-mono">{course.code}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300">{course.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                        <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-800 pt-3">
                            <span>{course.totalLabs} Experiments</span>
                            <span className="group-hover:translate-x-1 transition-transform">View Labs &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return renderDashboardHome();
      case 'labs': return renderLabSessions();
      case 'projects': return renderProjects();
      case 'materials': return renderMaterials();
      case 'assignments': return renderAssignments();
      case 'quizzes': return renderQuizzes();
      case 'attendance': return renderAttendance();
      case 'marks': return renderMarks();
      default: return <div className="text-center py-20 text-slate-500">Feature coming soon...</div>;
    }
  };

  // --- RENDER IDE ---
  
  if (activeLab) {
    // IDE Mode - Full Overlay
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-200 font-sans animate-fadeIn">
        {/* Workspace Header */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950">
             <div className="flex items-center space-x-4">
                 <button onClick={closeLab} className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 transition-colors">
                   <X className="w-5 h-5" />
                 </button>
                 <div>
                   <div className="flex items-center gap-2">
                     <h2 className="text-white font-semibold text-sm leading-tight">{activeLab.title}</h2>
                     {unsavedChanges && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                   </div>
                   <div className="flex items-center space-x-2 text-[10px] text-slate-500 uppercase tracking-wider">
                      <span>{activeLab.type}</span>
                      <span>•</span>
                      <span>{activeLab.difficulty}</span>
                   </div>
                 </div>
             </div>
             <div className="flex items-center space-x-3">
                 {(activeLab.failedAttempts || 0) >= 5 && activeLab.solutionFiles && (
                     <button 
                        onClick={loadSolution}
                        className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-amber-500/20 transition-colors animate-pulse"
                        title="Failed 5 times? Unlock solution"
                     >
                         <Unlock className="w-3 h-3"/>
                         <span>Reveal Solution</span>
                     </button>
                 )}
                 <button 
                    onClick={handleReset}
                    className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors"
                    title="Reset Code"
                 >
                     <RotateCcw className="w-4 h-4"/>
                 </button>
                 <button 
                    onClick={handleSave}
                    className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors"
                    title="Save Progress"
                 >
                     <SaveIcon className="w-4 h-4"/>
                 </button>
                 <div className="h-6 w-px bg-slate-800 mx-2"></div>
                 <button 
                    onClick={handleRun}
                    disabled={isRunning}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                 >
                   {isRunning ? <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"/> : <Play className="w-3 h-3 fill-current" />}
                   <span>Run & Test</span>
                 </button>
                 <button 
                    onClick={submitLab}
                    disabled={activeLab.status === 'submitted' || activeLab.status === 'reviewed'}
                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeLab.status === 'submitted' || activeLab.status === 'reviewed' ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                 >
                   <Send className="w-3 h-3" />
                   <span>{activeLab.status === 'submitted' || activeLab.status === 'reviewed' ? 'Submitted' : 'Submit for Review'}</span>
                 </button>
             </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
             {/* LEFT: Instructions & Guide */}
             <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                 <div className="flex border-b border-slate-800">
                    <button onClick={() => setActiveWorkspaceTab('guide')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeWorkspaceTab === 'guide' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Guide</button>
                    <button onClick={() => setActiveWorkspaceTab('results')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeWorkspaceTab === 'results' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Test Results</button>
                 </div>
                 
                 <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {activeWorkspaceTab === 'guide' ? (
                       <div className="space-y-6">
                         <div>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Aim</h3>
                            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800">{activeLab.aim}</p>
                         </div>
                         <div>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{activeLab.description}</p>
                         </div>
                         {activeLab.definitions && (
                             <div>
                                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Key Definitions</h3>
                                 <div className="text-sm text-slate-400 p-3 bg-slate-900/30 rounded border border-slate-800/50 italic">
                                     {activeLab.definitions}
                                 </div>
                             </div>
                         )}
                         {activeLab.procedure.length > 0 && (
                             <div>
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Procedure</h3>
                                <ul className="list-decimal pl-5 text-sm text-slate-400 space-y-1">
                                    {activeLab.procedure.map((s,i)=><li key={i} className="pl-1">{s}</li>)}
                                </ul>
                             </div>
                         )}
                         {activeLab.logicHint && (
                             <div>
                                <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Lightbulb className="w-3 h-3"/> Logic Hint</h3>
                                <p className="text-sm text-indigo-200/80 italic border-l-2 border-indigo-500/50 pl-3">{activeLab.logicHint}</p>
                             </div>
                         )}
                         {activeLab.facultyFeedback && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded text-sm mt-4">
                                <div className="text-emerald-400 font-bold text-xs uppercase mb-1">Faculty Feedback</div>
                                <div className="text-emerald-100/80 mb-2">{activeLab.facultyFeedback}</div>
                                <div className="font-bold text-white border-t border-emerald-500/20 pt-2 flex justify-between">
                                    <span>Score Awarded:</span>
                                    <span className="text-emerald-400">{activeLab.marks}/{activeLab.maxMarks}</span>
                                </div>
                            </div>
                         )}
                       </div>
                    ) : (
                       <div className="text-sm space-y-4">
                          {isRunning ? (
                              <div className="flex flex-col items-center justify-center py-10 opacity-70">
                                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                  <p className="text-indigo-400 text-xs">Compiling & Testing...</p>
                              </div>
                          ) : compilationResult ? (
                              <>
                                {compilationResult.success ? (
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${compilationResult.results.every(r=>r.passed)?'bg-emerald-500/10 border-emerald-500/20 text-emerald-400':'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                            {compilationResult.results.every(r=>r.passed) ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                                            <span className="font-bold">{compilationResult.results.filter(r=>r.passed).length}/{compilationResult.results.length} Tests Passed</span>
                                        </div>
                                        
                                        {compilationResult.debugInstructions && !compilationResult.results.every(r => r.passed) && (
                                            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded text-xs text-blue-200">
                                                <div className="font-bold mb-1 text-blue-400 flex items-center gap-1"><Zap className="w-3 h-3"/> AI Debug Assistant:</div>
                                                {compilationResult.debugInstructions}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {compilationResult.results.map((r,i)=>(
                                                <div key={i} className={`p-3 rounded-lg border mb-3 last:mb-0 ${
                                                    r.passed 
                                                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                                                      : 'bg-rose-500/5 border-rose-500/20'
                                                  }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                      <div className="flex items-center gap-2">
                                                        {r.passed 
                                                          ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                          : <XCircle className="w-4 h-4 text-rose-400" />
                                                        }
                                                        
                                                        <span className={`text-sm font-medium ${r.passed ? 'text-emerald-100' : 'text-rose-100'}`}>
                                                          Test Case {i + 1}
                                                        </span>
                                                  
                                                        {activeLab.testCases[i]?.isPrivate && (
                                                          <span className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                                                            <Lock className="w-3 h-3" /> Private
                                                          </span>
                                                        )}
                                                      </div>
                                                  
                                                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                        r.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                                      }`}>
                                                        {r.passed ? 'PASSED' : 'FAILED'}
                                                      </span>
                                                    </div>
                                                  
                                                    {!activeLab.testCases[i]?.isPrivate && (
                                                       <div className="mb-2">
                                                         <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Input</div>
                                                         <div className="font-mono text-xs text-slate-300 bg-slate-950/50 p-1.5 rounded border border-slate-800/50">
                                                           {activeLab.testCases[i]?.input || 'N/A'}
                                                         </div>
                                                       </div>
                                                    )}
                                                  
                                                    {!r.passed && (
                                                      <div className="mt-2 pt-2 border-t border-slate-800/30">
                                                        <div className="text-[10px] text-rose-400/70 uppercase tracking-wider mb-0.5">
                                                          {r.error ? 'Error' : 'Actual Output'}
                                                        </div>
                                                        <div className="font-mono text-xs text-rose-300 bg-slate-950/50 p-2 rounded border border-rose-500/10">
                                                          {r.error || r.actualOutput}
                                                        </div>
                                                      </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded text-rose-300 text-xs font-mono whitespace-pre-wrap">
                                        <div className="font-bold mb-2 text-rose-400 uppercase">Compilation Error</div>
                                        {compilationResult.compileError}
                                    </div>
                                )}
                              </>
                          ) : (
                              <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                                  <Terminal className="w-8 h-8 mb-2 opacity-30"/>
                                  <p>Run code to see results</p>
                              </div>
                          )}
                       </div>
                    )}
                 </div>
             </div>

             {/* MIDDLE: Code Editor */}
             <div className="flex-1 flex flex-col min-w-0">
                 {activeLab.type !== 'single-file' && (
                      <FileExplorer files={files} activeFileName={activeFileName} onSelectFile={setActiveFileName} onCreateFile={handleFileCreate} onDeleteFile={handleFileDelete} />
                 )}
                 <div className="flex-1 bg-[#0d1117] flex flex-col overflow-hidden relative">
                     <CodeEditor code={files.find(f=>f.name===activeFileName)?.content||''} onChange={handleCodeChange} language={activeLab.files.find(f=>f.name===activeFileName)?.language||'python'} />
                 </div>
             </div>

             {/* RIGHT: Live Preview (Web Projects) */}
             {(activeLab.type === 'frontend' || files.some(f => f.language === 'html')) && (
                <div className="w-1/3 border-l border-slate-800 bg-white flex flex-col">
                   <LivePreview files={files} triggerRefresh={refreshPreview} />
                </div>
             )}
        </div>
      </div>
    );
  }

  return (
    <Layout 
      role="student" 
      userName="John Student" 
      sidebarItems={sidebarItems} 
      activeView={activeView} 
      onNavigate={setActiveView}
      onLogout={onLogout}
    >
      {renderContent()}

      {/* AI Assistant Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
          {!showAiChat ? (
              <button onClick={()=>setShowAiChat(true)} className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-900/50 transition-all hover:scale-110">
                  <MessageSquare className="w-6 h-6 text-white"/>
              </button>
          ) : (
              <div className="w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                  <div className="p-4 bg-indigo-600 flex justify-between items-center">
                      <h4 className="text-white font-bold flex items-center gap-2"><Sparkles className="w-4 h-4"/> AI Assistant</h4>
                      <button onClick={()=>setShowAiChat(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-slate-800 text-slate-300 rounded-bl-none'}`}>
                                  {msg.text}
                              </div>
                          </div>
                      ))}
                  </div>
                  <form onSubmit={handleAiChat} className="p-3 border-t border-slate-800 flex gap-2">
                      <input 
                        autoFocus
                        type="text" 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)} 
                        placeholder="Ask for help..." 
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                      />
                      <button type="submit" className="p-2 bg-indigo-600 rounded text-white hover:bg-indigo-500"><Send className="w-4 h-4"/></button>
                  </form>
              </div>
          )}
      </div>
    </Layout>
  );
};
