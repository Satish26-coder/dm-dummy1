
import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { SidebarItem, UserRole } from '../types';
import { 
  LayoutDashboard, Users, Building, BookOpen, Settings, FileText, 
  BarChart2, Shield, Activity, GraduationCap, ClipboardList, AlertTriangle,
  UserCheck, TrendingUp, Clock, CheckCircle, Download, Search, PieChart,
  Briefcase, AlertCircle, ArrowUpRight, ArrowDownRight, ArrowRight, Printer,
  CalendarCheck, FileCheck, CheckSquare, Globe, Lock, Unlock, Eye, XCircle,
  Award, TrendingDown, BookMarked, Landmark, Layers, Megaphone, CalendarDays,
  ListTodo, MessageSquare, ClipboardCheck, Database, HardDrive, Server,
  Library, Book, History, QrCode, Building2, UserPlus, Filter, UploadCloud, Plus, X, FileSpreadsheet,
  ToggleLeft, ToggleRight, Trash2, Edit, Save, MoreHorizontal, Terminal, Monitor, Power, PlayCircle, BookCopy, Sparkles, Key, Shuffle, GitBranch, Bell, Network, Phone, Mail, BadgeCheck, Beaker, Calendar, UserCog, Sliders, Laptop, LockKeyhole, BellRing, Share2
} from 'lucide-react';

interface SimpleDashboardProps {
  role: UserRole;
  onLogout: () => void;
}

// --- HELPER TYPES ---

// Coordinator Types based on Spec
type CoordinatorType = 
  | 'Academic' | 'Class' | 'Subject' | 'Course' | 'Lab' 
  | 'Timetable' | 'Attendance' | 'Exam' | 'NAAC_NBA' 
  | 'Internship' | 'Project' | 'Research';

const COORDINATOR_DEFINITIONS: { id: CoordinatorType; label: string; icon: any; desc: string; category: 'Academic' | 'Admin' }[] = [
    { id: 'Academic', label: 'Dept. Academic Coordinator', icon: GraduationCap, desc: 'Overall academic smoothness, syllabus coverage monitoring.', category: 'Academic' },
    { id: 'Class', label: 'Class Coordinator', icon: Users, desc: 'Day-to-day operations, attendance, student counselling.', category: 'Academic' },
    { id: 'Subject', label: 'Subject Coordinator', icon: BookOpen, desc: 'Subject standardization, lesson plans, QA.', category: 'Academic' },
    { id: 'Course', label: 'Program Coordinator', icon: Network, desc: 'Program-level control (OBE), curriculum implementation.', category: 'Academic' },
    { id: 'Lab', label: 'Lab Coordinator', icon: Beaker, desc: 'Lab execution, maintenance, batch allocation.', category: 'Academic' },
    { id: 'Project', label: 'Project Coordinator', icon: Layers, desc: 'Guide allocation, reviews, evaluation coordination.', category: 'Academic' },
    { id: 'Research', label: 'R&D Coordinator', icon: Sparkles, desc: 'Publications tracking, research grants, innovation.', category: 'Academic' },
    { id: 'Timetable', label: 'Timetable Coordinator', icon: CalendarCheck, desc: 'Conflict-free scheduling, real-time adjustments.', category: 'Admin' },
    { id: 'Attendance', label: 'Attendance Coordinator', icon: Clock, desc: 'Attendance integrity, shortage reports, auditing.', category: 'Admin' },
    { id: 'Exam', label: 'Examination Coordinator', icon: FileCheck, desc: 'Internal exam scheduling, marks verification.', category: 'Admin' },
    { id: 'NAAC_NBA', label: 'NAAC/NBA Coordinator', icon: Award, desc: 'Accreditation data collection, documentation.', category: 'Admin' },
    { id: 'Internship', label: 'Internship Coordinator', icon: Briefcase, desc: 'Industry exposure, approvals, student tracking.', category: 'Admin' },
];

interface CoordinatorAssignment {
    type: CoordinatorType;
    validFrom: string;
    validTill: string;
}

interface AdminUser {
  id: number;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  roles: UserRole[]; // Multi-role support
  departments: string[]; // Multi-department support
  coordinatorRoles: CoordinatorType[]; // Simple list for quick checks
  coordinatorAssignments?: CoordinatorAssignment[]; // Detailed assignments with dates
  status: 'Active' | 'Inactive' | 'Suspended';
  designation?: string;
  joiningYear?: number;
  lastLogin: string;
  
  // Extended Fields
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  profilePhoto?: string;
  
  // Faculty Specific
  employeeId?: string;
  doj?: string; // Date of Joining
  qualification?: string;
  experience?: string;
  
  // Student Specific
  rollNo?: string;
  admissionNo?: string;
  regulation?: string;
  course?: string; // e.g. B.Tech
  section?: string;
  admissionType?: 'Convener' | 'Management';
}

interface Department {
  id: string;
  name: string;
  code: string;
  degreeLevel: 'UG' | 'PG' | 'PhD';
  branchType: 'Engineering' | 'Science' | 'Management' | 'Arts';
  estYear: number;
  hod: string;
  status: 'Active' | 'Inactive';
  facultyCount: number;
  studentCount: number;
  courseCount: number;
}

interface AdminCourse {
  id: string;
  name: string;
  code: string;
  dept: string;
  duration: number;
  regulation: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  type: 'Theory' | 'Lab' | 'Elective' | 'Open Elective' | 'Project' | 'Internship';
  dept: string;
  courseId: string; // Linked AdminCourse ID
  semester: number;
  credits: number;
  assignedFaculty: string;
}

interface AuditLog {
  id: number;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
  status: 'Success' | 'Failed';
}

// System Configuration Types
interface SystemConfigState {
  academic: {
    activeYear: string;
    years: { id: string; name: string; status: 'Active' | 'Locked' | 'Upcoming' }[];
    currentSemester: string;
    semesters: { id: string; name: string; status: 'Active' | 'Inactive' }[];
    regulations: { id: string; name: string; status: 'Active' | 'Legacy' }[];
  };
  attendance: {
    markingWindowHours: number;
    gracePeriodMinutes: number;
    minPercentage: number;
    allowFacultyEdit: boolean;
  };
  exam: {
    internalWeightage: number;
    externalWeightage: number;
    lockMarksAfterDays: number;
    allowRevaluation: boolean;
  };
  security: {
    passwordPolicy: 'Strong' | 'Medium' | 'Weak';
    sessionTimeoutMins: number;
    maxLoginAttempts: number;
    mfaEnabled: boolean;
  };
  features: {
    counselling: boolean;
    parentPortal: boolean;
    onlineExams: boolean;
    feedbackModule: boolean;
    internships: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
  };
}

// Granular Permissions
interface GranularPermission {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    approve: boolean;
    publish: boolean;
    export: boolean;
}

interface ModulePermissionRow {
    id: string;
    moduleName: string;
    // Map role to its granular permissions
    roles: Record<string, GranularPermission>; 
}

// --- HELPER COMPONENTS ---

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  format: string;
  type: 'users' | 'admin-courses' | 'subjects' | 'grades' | 'departments';
  onSuccess: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, title, format, type, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setUploading(false);
      setProgress(0);
      setLogs([]);
    }
  }, [isOpen]);

  const handleDownloadTemplate = (e: React.MouseEvent) => {
      e.preventDefault();
      let headers = "";
      let filename = "template.csv";

      if (type === 'users') {
          headers = "UserID,FullName,Email,Mobile,Roles,Departments,Designation";
          filename = "user_import_template.csv";
      } else if (type === 'subjects') {
          headers = "SubjectCode,SubjectName,Type,CourseCode,Semester,Credits,Regulation";
          filename = "subject_import_template.csv";
      } else if (type === 'admin-courses') {
          headers = "CourseName,CourseCode,Department,Duration,Regulation";
          filename = "course_import_template.csv";
      } else if (type === 'departments') {
          headers = "DeptName,DeptCode,DegreeLevel,BranchType,EstYear,HOD";
          filename = "dept_import_template.csv";
      } else {
          headers = "ID,Value1,Value2";
      }

      const blob = new Blob([headers], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setLogs(['Initializing upload sequence...', 'Connecting to secure storage...']);

    // Simulation of processing
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const currentProgress = Math.min(step * 10, 100);
      setProgress(currentProgress);

      if (currentProgress === 30) setLogs(prev => [...prev, `Parsing ${format} structure...`, 'Validating row data types...']);
      if (currentProgress === 60) setLogs(prev => [...prev, 'Checking for duplicates...', 'Mapping foreign keys...']);
      if (currentProgress === 90) setLogs(prev => [...prev, 'Committing transaction to database...', 'Updating indexes...']);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setLogs(prev => [...prev, '✔ Import Successful!', 'Stats: 142 records created, 0 errors.']);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
          <h3 className="font-bold text-white flex items-center gap-2"><UploadCloud className="w-5 h-5 text-indigo-400"/> {title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="p-6 space-y-6">
          {!uploading ? (
            <>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500/50 hover:bg-slate-800/30 transition-all">
                <FileSpreadsheet className="w-12 h-12 text-slate-500 mx-auto mb-4"/>
                <p className="text-slate-300 text-sm font-medium mb-1">Drag & Drop your {format} file here</p>
                <p className="text-slate-500 text-xs mb-4">or click to browse</p>
                <input 
                  type="file" 
                  accept=".csv, .xlsx" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden" 
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer bg-slate-800 text-indigo-400 px-4 py-2 rounded text-xs font-bold border border-slate-700 hover:text-white hover:border-indigo-500">
                  Select File
                </label>
                {file && <div className="mt-4 text-sm text-emerald-400 font-mono bg-emerald-500/10 py-1 px-3 rounded inline-block">{file.name}</div>}
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded flex gap-3 items-start">
                 <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0"/>
                 <div className="text-xs text-amber-200/80">
                    Ensure your file matches the standard template. <a href="#" onClick={handleDownloadTemplate} className="underline text-amber-400 hover:text-amber-300">Download Template</a>
                 </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
               <div className="flex justify-between text-xs text-slate-400 uppercase font-bold">
                  <span>Processing</span>
                  <span>{progress}%</span>
               </div>
               <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
               </div>
               <div className="h-40 bg-slate-950 rounded border border-slate-800 p-3 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('✔') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
           <button onClick={onClose} disabled={uploading} className="px-4 py-2 text-slate-400 hover:text-white text-sm disabled:opacity-50">Cancel</button>
           {!uploading && (
             <button 
               onClick={handleUpload} 
               disabled={!file}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Upload & Process
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---

export const AdminDashboard: React.FC<SimpleDashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeConfigTab, setActiveConfigTab] = useState<'academic' | 'attendance' | 'exam' | 'security' | 'features' | 'notifications'>('academic');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadContext, setUploadContext] = useState<{ title: string; format: string; type: 'users' | 'admin-courses' | 'subjects' | 'grades' | 'departments' }>({ title: '', format: 'CSV', type: 'users' });
  
  // Modals State
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  
  // Coordinator Assignment State
  const [assignCoordModal, setAssignCoordModal] = useState<{ isOpen: boolean; role: CoordinatorType | null }>({ isOpen: false, role: null });
  const [assignTarget, setAssignTarget] = useState({ dept: '', userId: '' });

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Tab State
  const [courseViewTab, setCourseViewTab] = useState<'courses' | 'subjects'>('courses');
  const [roleViewTab, setRoleViewTab] = useState<'matrix' | 'coordinators' | 'workflow'>('matrix');

  const sidebarItems: SidebarItem[] = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { id: 'users', label: 'User Management', icon: Users, view: 'users' },
    { id: 'dept', label: 'Departments', icon: Building, view: 'departments' },
    { id: 'course', label: 'Course & Subjects', icon: BookOpen, view: 'courses' },
    { id: 'roles', label: 'Roles & Perms', icon: Shield, view: 'roles' },
    { id: 'config', label: 'System Config', icon: Settings, view: 'config' },
    { id: 'logs', label: 'Audit Logs', icon: FileText, view: 'logs' },
  ];

  // --- MOCK DATA STATE ---

  const [users, setUsers] = useState<AdminUser[]>([
      { id: 1, userId: 'FAC001', name: 'Alan Turing', email: 'alan@inst.edu', mobile: '9876543210', roles: ['faculty', 'coordinator'], departments: ['CSE'], coordinatorRoles: ['Research', 'Project'], status: 'Active', lastLogin: '2 mins ago', gender: 'Male' },
      { id: 2, userId: 'FAC002', name: 'Grace Hopper', email: 'grace@inst.edu', mobile: '9876543211', roles: ['hod', 'faculty'], departments: ['CSE'], coordinatorRoles: ['Academic'], status: 'Active', lastLogin: '1 hr ago', gender: 'Female' },
      { id: 3, userId: 'STU001', name: 'John Student', email: 'john@inst.edu', mobile: '9876543212', roles: ['student'], departments: ['ECE'], coordinatorRoles: [], status: 'Active', lastLogin: 'Yesterday', rollNo: '23CSE101', gender: 'Male' },
      { id: 4, userId: 'STU002', name: 'Jane Doe', email: 'jane@inst.edu', mobile: '9876543213', roles: ['student'], departments: ['CSE'], coordinatorRoles: [], status: 'Inactive', lastLogin: 'Never', rollNo: '23CSE102', gender: 'Female' },
      { id: 5, userId: 'ADM001', name: 'Admin User', email: 'admin@inst.edu', mobile: '9876543214', roles: ['admin'], departments: ['Office'], coordinatorRoles: [], status: 'Active', lastLogin: 'Now', gender: 'Male' },
  ]);

  // User Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All Roles');

  // Department State
  const [departments, setDepartments] = useState<Department[]>([
      { id: 'd1', name: 'Computer Science & Eng', code: 'CSE', degreeLevel: 'UG', branchType: 'Engineering', estYear: 2005, hod: 'Dr. Grace Hopper', status: 'Active', facultyCount: 24, studentCount: 480, courseCount: 3 },
      { id: 'd2', name: 'Electronics & Comm', code: 'ECE', degreeLevel: 'UG', branchType: 'Engineering', estYear: 2006, hod: 'Dr. Shannon', status: 'Active', facultyCount: 18, studentCount: 360, courseCount: 2 },
      { id: 'd3', name: 'Mechanical Eng', code: 'MECH', degreeLevel: 'UG', branchType: 'Engineering', estYear: 2008, hod: 'Dr. Tesla', status: 'Active', facultyCount: 15, studentCount: 300, courseCount: 2 },
      { id: 'd4', name: 'Master of Business Admin', code: 'MBA', degreeLevel: 'PG', branchType: 'Management', estYear: 2010, hod: 'Dr. Drucker', status: 'Active', facultyCount: 8, studentCount: 120, courseCount: 1 },
  ]);
  const [deptFilters, setDeptFilters] = useState({ search: '', level: 'All', type: 'All', status: 'All' });

  const [adminCourses, setAdminCourses] = useState<AdminCourse[]>([
      { id: 'ac1', name: 'B.Tech Computer Science', code: 'BT-CSE', dept: 'CSE', duration: 4, regulation: 'R23' },
      { id: 'ac2', name: 'B.Tech Electronics', code: 'BT-ECE', dept: 'ECE', duration: 4, regulation: 'R23' },
      { id: 'ac3', name: 'M.Tech CSE', code: 'MT-CSE', dept: 'CSE', duration: 2, regulation: 'R22' },
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([
      { id: 's1', name: 'Data Structures', code: 'CS201', type: 'Lab', dept: 'CSE', courseId: 'ac1', semester: 3, credits: 3, assignedFaculty: 'Alan Turing' },
      { id: 's2', name: 'Operating Systems', code: 'CS202', type: 'Theory', dept: 'CSE', courseId: 'ac1', semester: 4, credits: 4, assignedFaculty: 'Ken Thompson' },
      { id: 's3', name: 'Digital Logic', code: 'EC101', type: 'Theory', dept: 'ECE', courseId: 'ac2', semester: 2, credits: 3, assignedFaculty: 'Claude Shannon' },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
      { id: 1, action: 'User Created', user: 'Admin User', role: 'admin', timestamp: '2023-10-25 10:30 AM', details: 'Created user "John Student"', status: 'Success' },
      { id: 2, action: 'Bulk Upload', user: 'Admin User', role: 'admin', timestamp: '2023-10-25 09:15 AM', details: 'Uploaded 150 students to CSE', status: 'Success' },
      { id: 3, action: 'Login Failed', user: 'Unknown', role: '-', timestamp: '2023-10-24 11:45 PM', details: 'Failed login attempt for admin@inst.edu', status: 'Failed' },
  ]);

  // System Config State (Expanded)
  const [sysConfig, setSysConfig] = useState<SystemConfigState>({
      academic: {
          activeYear: '2023-2024',
          years: [
              { id: 'y1', name: '2023-2024', status: 'Active' },
              { id: 'y2', name: '2024-2025', status: 'Upcoming' },
              { id: 'y0', name: '2022-2023', status: 'Locked' }
          ],
          currentSemester: 'Odd Semester',
          semesters: [
              { id: 'sem1', name: 'Odd Semester (Aug - Dec)', status: 'Active' },
              { id: 'sem2', name: 'Even Semester (Jan - May)', status: 'Inactive' }
          ],
          regulations: [
              { id: 'r1', name: 'R23', status: 'Active' },
              { id: 'r2', name: 'R20', status: 'Legacy' }
          ]
      },
      attendance: {
          markingWindowHours: 24,
          gracePeriodMinutes: 15,
          minPercentage: 75,
          allowFacultyEdit: true
      },
      exam: {
          internalWeightage: 40,
          externalWeightage: 60,
          lockMarksAfterDays: 3,
          allowRevaluation: true
      },
      security: {
          passwordPolicy: 'Strong',
          sessionTimeoutMins: 30,
          maxLoginAttempts: 5,
          mfaEnabled: false
      },
      features: {
          counselling: true,
          parentPortal: false,
          onlineExams: true,
          feedbackModule: true,
          internships: false
      },
      notifications: {
          emailAlerts: true,
          smsAlerts: false,
          pushNotifications: true
      }
  });

  // Role Permissions Data - Granular
  const defaultPerms: GranularPermission = { create: false, read: true, update: false, delete: false, approve: false, publish: false, export: false };
  const adminPerms: GranularPermission = { create: true, read: true, update: true, delete: true, approve: true, publish: true, export: true };
  
  const [rolePermissions, setRolePermissions] = useState<ModulePermissionRow[]>([
      { id: 'm1', moduleName: 'Department Management', roles: { admin: adminPerms, principal: {...adminPerms, delete: false}, hod: {...defaultPerms, read: true, update: true}, coordinator: {...defaultPerms, read: true}, faculty: {...defaultPerms}, student: {...defaultPerms} } },
      { id: 'm2', moduleName: 'User Management', roles: { admin: adminPerms, principal: {...defaultPerms}, hod: {...defaultPerms}, coordinator: {...defaultPerms, read: false}, faculty: {...defaultPerms, read: false}, student: {...defaultPerms, read: false} } },
      { id: 'm3', moduleName: 'Course & Subjects', roles: { admin: adminPerms, principal: adminPerms, hod: adminPerms, coordinator: {...defaultPerms, update: true}, faculty: {...defaultPerms}, student: {...defaultPerms} } },
      { id: 'm4', moduleName: 'Timetable', roles: { admin: adminPerms, principal: adminPerms, hod: adminPerms, coordinator: {...adminPerms, delete: false}, faculty: {...defaultPerms}, student: {...defaultPerms} } },
      { id: 'm5', moduleName: 'Attendance', roles: { admin: adminPerms, principal: {...adminPerms}, hod: {...adminPerms}, coordinator: {...adminPerms}, faculty: {...defaultPerms, create: true, update: true}, student: {...defaultPerms} } },
      { id: 'm6', moduleName: 'Examinations', roles: { admin: adminPerms, principal: adminPerms, hod: adminPerms, coordinator: {...adminPerms}, faculty: {...defaultPerms, update: true}, student: {...defaultPerms} } },
      { id: 'm7', moduleName: 'LMS Content', roles: { admin: adminPerms, principal: adminPerms, hod: adminPerms, coordinator: adminPerms, faculty: {...adminPerms, delete: false}, student: {...defaultPerms} } },
  ]);

  // Selected Permission Cell for Modal
  const [selectedPermCell, setSelectedPermCell] = useState<{moduleId: string, moduleName: string, role: string, perms: GranularPermission} | null>(null);

  // Form States
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({ roles: [], departments: [], coordinatorRoles: [], status: 'Active', gender: 'Male' });
  const [newDept, setNewDept] = useState<Partial<Department>>({ code: '', name: '', hod: '', facultyCount: 0, studentCount: 0, degreeLevel: 'UG', branchType: 'Engineering', estYear: new Date().getFullYear(), status: 'Active' });
  const [newAdminCourse, setNewAdminCourse] = useState<Partial<AdminCourse>>({ duration: 4, regulation: 'R23' });
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({ type: 'Theory', semester: 1, credits: 3 });

  // --- ACTIONS ---

  const handleBulkUpload = (title: string, type: 'users' | 'admin-courses' | 'subjects' | 'grades' | 'departments') => {
      setUploadContext({ title, format: 'CSV/Excel', type });
      setIsUploadOpen(true);
  };

  // User Actions
  const generateUserId = () => {
      if(!newUser.roles || newUser.roles.length === 0) return;
      const role = newUser.roles[0];
      const prefix = role === 'student' ? 'STU' : role === 'faculty' ? 'FAC' : role === 'admin' ? 'ADM' : 'USR';
      const random = Math.floor(1000 + Math.random() * 9000);
      setNewUser({...newUser, userId: `${prefix}2024${random}`});
  };

  const handleAddUser = () => {
      if(!newUser.name || !newUser.email || !newUser.userId || !newUser.roles?.length) {
          alert("Please fill in Mandatory fields: Name, Email, Role, UserID");
          return;
      }
      
      const userPayload: AdminUser = {
          id: editingUserId ? editingUserId : Date.now(),
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile || '',
          roles: newUser.roles,
          departments: newUser.departments || [],
          coordinatorRoles: newUser.coordinatorRoles || [],
          status: newUser.status || 'Active',
          lastLogin: editingUserId ? 'Recently' : 'Never',
          designation: newUser.designation,
          joiningYear: newUser.joiningYear,
          gender: newUser.gender,
          dob: newUser.dob,
          rollNo: newUser.rollNo,
          employeeId: newUser.employeeId,
      };

      if (editingUserId) {
          setUsers(users.map(u => u.id === editingUserId ? userPayload : u));
          setAuditLogs([{ id: Date.now(), action: 'User Updated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Updated user ${newUser.name}`, status: 'Success' }, ...auditLogs]);
      } else {
          setUsers([...users, userPayload]);
          setAuditLogs([{ id: Date.now(), action: 'User Created', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Created user ${newUser.name} with roles ${newUser.roles?.join(', ')}`, status: 'Success' }, ...auditLogs]);
      }
      setShowAddUser(false);
      setEditingUserId(null);
      setNewUser({ roles: [], departments: [], coordinatorRoles: [], status: 'Active', gender: 'Male' });
  };

  const handleEditUser = (user: AdminUser) => {
      setEditingUserId(user.id);
      setNewUser(user);
      setShowAddUser(true);
  };

  const handleDeleteUser = (user: AdminUser) => {
      if(user.status === 'Inactive') {
          // Hard Delete or Reactivate
          if(confirm("This user is already inactive. Do you want to permanently delete them?")) {
              setUsers(users.filter(u => u.id !== user.id));
              setAuditLogs([{ id: Date.now(), action: 'User Deleted', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Deleted user ID ${user.userId}`, status: 'Success' }, ...auditLogs]);
          }
      } else {
          // Soft Delete
          if(confirm("Are you sure you want to deactivate this user? They will lose access immediately.")) {
              setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Inactive' } : u));
              setAuditLogs([{ id: Date.now(), action: 'User Deactivated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Deactivated user ID ${user.userId}`, status: 'Success' }, ...auditLogs]);
          }
      }
  };

  // Roles Actions
  const updatePermission = (moduleId: string, role: string, field: keyof GranularPermission, value: boolean) => {
      const updatedPerms = rolePermissions.map(row => {
          if (row.id === moduleId) {
              return {
                  ...row,
                  roles: {
                      ...row.roles,
                      [role]: {
                          ...row.roles[role],
                          [field]: value
                      }
                  }
              };
          }
          return row;
      });
      setRolePermissions(updatedPerms);
      if (selectedPermCell && selectedPermCell.moduleId === moduleId && selectedPermCell.role === role) {
          setSelectedPermCell({
              ...selectedPermCell,
              perms: { ...selectedPermCell.perms, [field]: value }
          });
      }
  };

  const savePermissions = () => {
      setAuditLogs([{ id: Date.now(), action: 'Permissions Updated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Modified Role Access Matrix`, status: 'Success' }, ...auditLogs]);
      alert("Access Control Matrix Updated & Enforced Successfully.");
      setSelectedPermCell(null);
  };

  const handleAssignCoordinator = () => {
      if (!assignCoordModal.role || !assignTarget.userId || !assignTarget.dept) return;
      
      setUsers(users.map(u => {
          if (u.userId === assignTarget.userId) {
              const newRoles = u.roles.includes('coordinator') ? u.roles : [...u.roles, 'coordinator' as UserRole];
              const newCoords = u.coordinatorRoles.includes(assignCoordModal.role!) ? u.coordinatorRoles : [...u.coordinatorRoles, assignCoordModal.role!];
              const newDepts = u.departments.includes(assignTarget.dept) ? u.departments : [...u.departments, assignTarget.dept];
              return { ...u, roles: newRoles, coordinatorRoles: newCoords, departments: newDepts };
          }
          return u;
      }));
      
      setAuditLogs([{ id: Date.now(), action: 'Role Assigned', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Assigned ${assignCoordModal.role} to ${assignTarget.userId} for ${assignTarget.dept}`, status: 'Success' }, ...auditLogs]);
      setAssignCoordModal({ isOpen: false, role: null });
      setAssignTarget({ dept: '', userId: '' });
  };

  const handleRemoveCoordinator = (userId: string, role: CoordinatorType) => {
      if(!confirm(`Remove ${role} access from this user?`)) return;
      setUsers(users.map(u => {
          if (u.userId === userId) {
              return { ...u, coordinatorRoles: u.coordinatorRoles.filter(r => r !== role) };
          }
          return u;
      }));
      setAuditLogs([{ id: Date.now(), action: 'Role Revoked', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Removed ${role} from ${userId}`, status: 'Success' }, ...auditLogs]);
  };

  // Dept Actions
  const handleAddDepartment = () => {
      if(!newDept.name || !newDept.code || !newDept.degreeLevel || !newDept.branchType) {
          alert("Please fill all required fields: Name, Code, Level, Branch");
          return;
      }
      
      if (editingDeptId) {
          setDepartments(departments.map(d => d.id === editingDeptId ? { ...d, ...newDept } as Department : d));
          setAuditLogs([{ id: Date.now(), action: 'Dept Updated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Updated Department ${newDept.code}`, status: 'Success' }, ...auditLogs]);
      } else {
          setDepartments([...departments, {
              id: `d${Date.now()}`,
              name: newDept.name,
              code: newDept.code,
              degreeLevel: newDept.degreeLevel,
              branchType: newDept.branchType,
              estYear: newDept.estYear || new Date().getFullYear(),
              hod: newDept.hod || 'Unassigned',
              status: newDept.status || 'Active',
              facultyCount: 0,
              studentCount: 0,
              courseCount: 0
          } as Department]);
          setAuditLogs([{ id: Date.now(), action: 'Dept Created', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Created department ${newDept.code}`, status: 'Success' }, ...auditLogs]);
      }
      setShowAddDept(false);
      setEditingDeptId(null);
      setNewDept({ code: '', name: '', hod: '', degreeLevel: 'UG', branchType: 'Engineering', status: 'Active' });
  };

  const handleEditDepartment = (dept: Department) => {
      setEditingDeptId(dept.id);
      setNewDept(dept);
      setShowAddDept(true);
  };

  const handleDeleteDepartment = (dept: Department) => {
      const hasDependencies = dept.facultyCount > 0 || dept.studentCount > 0 || dept.courseCount > 0;
      if (hasDependencies) {
          if (confirm(`Cannot delete ${dept.name} because it has associated data (${dept.studentCount} Students, ${dept.facultyCount} Faculty, ${dept.courseCount} Courses). \n\nDo you want to Deactivate it instead?`)) {
              setDepartments(departments.map(d => d.id === dept.id ? { ...d, status: 'Inactive' } : d));
              setAuditLogs([{ id: Date.now(), action: 'Dept Deactivated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Deactivated Department ${dept.code} due to dependencies`, status: 'Success' }, ...auditLogs]);
          }
      } else {
          if (confirm(`Are you sure you want to permanently delete ${dept.name}?`)) {
              setDepartments(departments.filter(d => d.id !== dept.id));
              setAuditLogs([{ id: Date.now(), action: 'Dept Deleted', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Deleted Department ${dept.code}`, status: 'Success' }, ...auditLogs]);
          }
      }
  };

  // Course Actions
  const handleAddCourse = () => {
      if(!newAdminCourse.name || !newAdminCourse.code) return;
      
      if (editingCourseId) {
          setAdminCourses(adminCourses.map(c => c.id === editingCourseId ? { ...c, ...newAdminCourse } as AdminCourse : c));
      } else {
          setAdminCourses([...adminCourses, {
              id: `ac${Date.now()}`,
              name: newAdminCourse.name!,
              code: newAdminCourse.code!,
              dept: newAdminCourse.dept || 'CSE',
              duration: newAdminCourse.duration || 4,
              regulation: newAdminCourse.regulation || 'R23'
          }]);
      }
      setAuditLogs([{ id: Date.now(), action: 'Course Updated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Modified/Created course ${newAdminCourse.code}`, status: 'Success' }, ...auditLogs]);
      setShowAddCourse(false);
      setEditingCourseId(null);
      setNewAdminCourse({ duration: 4, regulation: 'R23' });
  };

  const handleEditCourse = (course: AdminCourse) => {
      setEditingCourseId(course.id);
      setNewAdminCourse(course);
      setShowAddCourse(true);
  };

  // Subject Actions
  const handleAddSubject = () => {
      if(!newSubject.name || !newSubject.code || !newSubject.courseId) {
          alert("Please fill all required fields including Course mapping");
          return;
      }
      
      if (editingSubjectId) {
          setSubjects(subjects.map(s => s.id === editingSubjectId ? { ...s, ...newSubject } as Subject : s));
      } else {
          setSubjects([...subjects, {
              id: `s${Date.now()}`,
              name: newSubject.name!,
              code: newSubject.code!,
              type: newSubject.type || 'Theory',
              dept: newSubject.dept || 'CSE',
              courseId: newSubject.courseId!,
              semester: newSubject.semester || 1,
              credits: newSubject.credits || 3,
              assignedFaculty: 'Unassigned'
          }]);
      }
      setAuditLogs([{ id: Date.now(), action: 'Subject Modified', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Modified/Created subject ${newSubject.code}`, status: 'Success' }, ...auditLogs]);
      setShowAddSubject(false);
      setEditingSubjectId(null);
      setNewSubject({ type: 'Theory', semester: 1, credits: 3 });
  };

  const handleEditSubject = (sub: Subject) => {
      setEditingSubjectId(sub.id);
      setNewSubject(sub);
      setShowAddSubject(true);
  };

  const handleGenerateSubjectCode = () => {
      if (!newSubject.courseId) return;
      const course = adminCourses.find(c => c.id === newSubject.courseId);
      const code = `${course?.code.split('-')[1] || 'SUB'}-${newSubject.semester || 1}${Math.floor(Math.random() * 90) + 10}`;
      setNewSubject({ ...newSubject, code });
  };

  const handleConfigUpdate = () => {
      setAuditLogs([{ id: Date.now(), action: 'Config Updated', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Updated System Configuration (${activeConfigTab})`, status: 'Success' }, ...auditLogs]);
      alert("System Configuration Saved Successfully! New rules applied instantly.");
  };

  // --- VIEWS ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: users.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Departments', val: departments.length, icon: Building, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Courses', val: adminCourses.length, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'System Health', val: '98%', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-white">{card.val}</h3>
            </div>
            <div className={`p-3 rounded-lg ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex gap-3">
          <button onClick={() => handleBulkUpload('Import Users', 'users')} className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Bulk Import
          </button>
          <button onClick={() => { setNewUser({ roles: [], departments: [], coordinatorRoles: [], status: 'Active', gender: 'Male' }); setEditingUserId(null); setShowAddUser(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
              <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"/>
          </div>
          <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
          </select>
      </div>
      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-slate-200">
            <tr>
              <th className="p-4">User Details</th>
              <th className="p-4">Role & Dept</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.filter(u => 
                (userRoleFilter === 'All Roles' || u.roles.includes(userRoleFilter as UserRole)) &&
                (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.userId.toLowerCase().includes(userSearch.toLowerCase()))
            ).map(user => (
              <tr key={user.id} className="hover:bg-slate-800/30">
                <td className="p-4">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email} • {user.userId}</div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 mb-1">
                      {user.roles.map(r => <span key={r} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-xs capitalize">{r.replace('_', ' ')}</span>)}
                  </div>
                  <div className="text-xs text-slate-500">{user.departments.join(', ')}</div>
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{user.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEditUser(user)} className="p-1 hover:text-indigo-400 transition-colors"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteUser(user)} className="p-1 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6 animate-fadeIn">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Departments</h2>
        <button onClick={() => { setNewDept({status: 'Active', degreeLevel:'UG', branchType:'Engineering'}); setEditingDeptId(null); setShowAddDept(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
              <div key={dept.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold">{dept.code}</div>
                      <div className="flex gap-2">
                          <button onClick={() => handleEditDepartment(dept)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-indigo-400"><Edit className="w-3.5 h-3.5"/></button>
                          <button onClick={() => handleDeleteDepartment(dept)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                  </div>
                  <h3 className="font-bold text-white mb-1">{dept.name}</h3>
                  <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{dept.degreeLevel}</span>
                      <span>•</span>
                      <span>Est. {dept.estYear}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-3">
                      <div className="text-center">
                          <div className="text-xs text-slate-500 uppercase font-bold">Faculty</div>
                          <div className="text-white font-mono">{dept.facultyCount}</div>
                      </div>
                      <div className="text-center border-l border-slate-800">
                          <div className="text-xs text-slate-500 uppercase font-bold">Students</div>
                          <div className="text-white font-mono">{dept.studentCount}</div>
                      </div>
                      <div className="text-center border-l border-slate-800">
                          <div className="text-xs text-slate-500 uppercase font-bold">Courses</div>
                          <div className="text-white font-mono">{dept.courseCount}</div>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );

  const renderCoursesAndSubjects = () => (
      <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
              <div className="flex gap-4">
                  <button onClick={() => setCourseViewTab('courses')} className={`pb-2 text-sm font-bold ${courseViewTab === 'courses' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Programs / Courses</button>
                  <button onClick={() => setCourseViewTab('subjects')} className={`pb-2 text-sm font-bold ${courseViewTab === 'subjects' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Subjects Mapping</button>
              </div>
              <button onClick={() => courseViewTab === 'courses' ? setShowAddCourse(true) : setShowAddSubject(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add {courseViewTab === 'courses' ? 'Course' : 'Subject'}
              </button>
          </div>

          {courseViewTab === 'courses' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-400">
                      <thead className="bg-slate-800/50 text-slate-200">
                          <tr><th className="p-4">Code</th><th className="p-4">Name</th><th className="p-4">Dept</th><th className="p-4">Duration</th><th className="p-4">Regulation</th><th className="p-4 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          {adminCourses.map(c => (
                              <tr key={c.id} className="hover:bg-slate-800/30">
                                  <td className="p-4 font-mono text-white">{c.code}</td>
                                  <td className="p-4">{c.name}</td>
                                  <td className="p-4">{c.dept}</td>
                                  <td className="p-4">{c.duration} Years</td>
                                  <td className="p-4"><span className="px-2 py-0.5 bg-slate-800 rounded text-xs">{c.regulation}</span></td>
                                  <td className="p-4 text-right">
                                      <button onClick={() => handleEditCourse(c)} className="text-slate-500 hover:text-indigo-400"><Edit className="w-4 h-4"/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-400">
                      <thead className="bg-slate-800/50 text-slate-200">
                          <tr><th className="p-4">Code</th><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Course & Sem</th><th className="p-4">Credits</th><th className="p-4 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          {subjects.map(s => (
                              <tr key={s.id} className="hover:bg-slate-800/30">
                                  <td className="p-4 font-mono text-white">{s.code}</td>
                                  <td className="p-4">{s.name}</td>
                                  <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs ${s.type === 'Lab' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-300'}`}>{s.type}</span></td>
                                  <td className="p-4 text-xs">
                                      <div>{adminCourses.find(c=>c.id===s.courseId)?.code}</div>
                                      <div className="text-slate-500">Sem {s.semester}</div>
                                  </td>
                                  <td className="p-4 font-mono">{s.credits}</td>
                                  <td className="p-4 text-right">
                                      <button onClick={() => handleEditSubject(s)} className="text-slate-500 hover:text-indigo-400"><Edit className="w-4 h-4"/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>
  );

  const renderRoles = () => (
      <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Roles & Permissions</h2>
            <button onClick={savePermissions} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" /> Enforce Policy
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-800/50 text-slate-200">
                      <tr>
                          <th className="p-4 min-w-[200px]">Module / Resource</th>
                          {['admin', 'principal', 'hod', 'coordinator', 'faculty', 'student'].map(r => (
                              <th key={r} className="p-4 text-center capitalize">{r}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                      {rolePermissions.map(module => (
                          <tr key={module.id} className="hover:bg-slate-800/30">
                              <td className="p-4 font-medium text-white">{module.moduleName}</td>
                              {['admin', 'principal', 'hod', 'coordinator', 'faculty', 'student'].map(role => {
                                  const perms = module.roles[role] || defaultPerms;
                                  const hasAccess = Object.values(perms).some(v => v);
                                  return (
                                      <td key={role} className="p-4 text-center">
                                          <button 
                                            onClick={() => setSelectedPermCell({moduleId: module.id, moduleName: module.moduleName, role, perms})}
                                            className={`w-8 h-8 rounded flex items-center justify-center mx-auto transition-colors ${hasAccess ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-slate-800 text-slate-600 hover:bg-slate-700'}`}
                                          >
                                              {hasAccess ? <CheckCircle className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                                          </button>
                                      </td>
                                  );
                              })}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Granular Permission Editor Modal */}
          {selectedPermCell && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                          <div>
                              <h3 className="text-white font-bold">{selectedPermCell.moduleName}</h3>
                              <p className="text-xs text-slate-500 capitalize">Permissions for: <span className="text-indigo-400">{selectedPermCell.role}</span></p>
                          </div>
                          <button onClick={() => setSelectedPermCell(null)}><X className="w-5 h-5 text-slate-400"/></button>
                      </div>
                      <div className="space-y-2 mb-6">
                          {Object.keys(defaultPerms).map((key) => (
                              <label key={key} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded cursor-pointer">
                                  <span className="text-sm text-slate-300 capitalize">{key}</span>
                                  <div className={`w-10 h-5 rounded-full relative transition-colors ${selectedPermCell.perms[key as keyof GranularPermission] ? 'bg-indigo-600' : 'bg-slate-700'}`} onClick={(e) => {
                                      e.preventDefault();
                                      updatePermission(selectedPermCell.moduleId, selectedPermCell.role, key as keyof GranularPermission, !selectedPermCell.perms[key as keyof GranularPermission]);
                                  }}>
                                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${selectedPermCell.perms[key as keyof GranularPermission] ? 'left-6' : 'left-1'}`}></div>
                                  </div>
                              </label>
                          ))}
                      </div>
                      <div className="flex justify-end">
                          <button onClick={() => setSelectedPermCell(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-bold">Done</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderAuditLogs = () => (
      <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-white">System Logs</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-800/50 text-slate-200">
                      <tr><th className="p-4">Timestamp</th><th className="p-4">Action</th><th className="p-4">User</th><th className="p-4">Details</th><th className="p-4">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                      {auditLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-800/30">
                              <td className="p-4 font-mono text-xs">{log.timestamp}</td>
                              <td className="p-4 font-bold text-white">{log.action}</td>
                              <td className="p-4">
                                  <div>{log.user}</div>
                                  <div className="text-xs text-slate-500 uppercase">{log.role}</div>
                              </td>
                              <td className="p-4 text-xs">{log.details}</td>
                              <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{log.status}</span></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderConfig = () => (
     <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">System Configuration</h2>
                <p className="text-slate-400 text-sm">Control center for institutional rules, features, and security.</p>
            </div>
            <button onClick={handleConfigUpdate} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                <Save className="w-4 h-4"/> Save Changes
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
            {/* Config Sidebar */}
            <div className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-xl p-2 h-fit">
                {[
                    { id: 'academic', label: 'Academic & Terms', icon: CalendarDays },
                    { id: 'attendance', label: 'Attendance Rules', icon: Clock },
                    { id: 'exam', label: 'Examinations', icon: FileCheck },
                    { id: 'security', label: 'Security & Access', icon: Shield },
                    { id: 'features', label: 'System Features', icon: Sliders },
                    { id: 'notifications', label: 'Notifications', icon: Bell }
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveConfigTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${activeConfigTab === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <item.icon className="w-4 h-4"/> {item.label}
                    </button>
                ))}
            </div>

            {/* Config Content Area */}
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto">
                {activeConfigTab === 'academic' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div>
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-indigo-400"/> Academic Years</h3>
                            <div className="space-y-3">
                                {sysConfig.academic.years.map(y => (
                                    <div key={y.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                                        <span className="text-slate-300 font-mono">{y.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-1 rounded border ${y.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : y.status === 'Locked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{y.status}</span>
                                            {y.status !== 'Active' && <button className="text-indigo-400 text-xs hover:underline">Set Active</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><BookCopy className="w-5 h-5 text-amber-400"/> Regulations</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {sysConfig.academic.regulations.map(r => (
                                    <div key={r.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                                        <span className="text-white font-bold">{r.name}</span>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${r.status === 'Active' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${r.status === 'Active' ? 'left-6' : 'left-1'}`}></div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeConfigTab === 'attendance' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                            <h3 className="text-white font-bold mb-4">Calculation Logic</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Minimum Attendance %</label>
                                    <input type="number" value={sysConfig.attendance.minPercentage} onChange={e => setSysConfig({...sysConfig, attendance: {...sysConfig.attendance, minPercentage: Number(e.target.value)}})} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-bold text-lg text-center" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Grace Period (Minutes)</label>
                                    <input type="number" value={sysConfig.attendance.gracePeriodMinutes} onChange={e => setSysConfig({...sysConfig, attendance: {...sysConfig.attendance, gracePeriodMinutes: Number(e.target.value)}})} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-bold text-lg text-center" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-bold">Faculty Edit Rights</h4>
                                <p className="text-xs text-slate-500">Allow faculty to modify attendance after submission within window.</p>
                            </div>
                            <div onClick={() => setSysConfig({...sysConfig, attendance: {...sysConfig.attendance, allowFacultyEdit: !sysConfig.attendance.allowFacultyEdit}})} className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${sysConfig.attendance.allowFacultyEdit ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sysConfig.attendance.allowFacultyEdit ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeConfigTab === 'exam' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                            <h3 className="text-white font-bold mb-4">Marks Distribution</h3>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 block mb-1">Internal Weightage</label>
                                    <div className="flex items-center gap-2">
                                        <input type="range" min="0" max="100" value={sysConfig.exam.internalWeightage} onChange={e => {
                                            const val = Number(e.target.value);
                                            setSysConfig({...sysConfig, exam: {...sysConfig.exam, internalWeightage: val, externalWeightage: 100 - val}});
                                        }} className="w-full accent-indigo-500" />
                                        <span className="text-indigo-400 font-bold w-12">{sysConfig.exam.internalWeightage}%</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 block mb-1">External Weightage</label>
                                    <div className="flex items-center gap-2">
                                        <input type="range" min="0" max="100" value={sysConfig.exam.externalWeightage} disabled className="w-full accent-slate-600 cursor-not-allowed" />
                                        <span className="text-slate-400 font-bold w-12">{sysConfig.exam.externalWeightage}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                            <h3 className="text-white font-bold mb-4">Exam Security</h3>
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                                <div>
                                    <h4 className="text-sm text-slate-300">Lock Marks Submission</h4>
                                    <p className="text-xs text-slate-500">Days after exam date to auto-lock marks entry.</p>
                                </div>
                                <input type="number" value={sysConfig.exam.lockMarksAfterDays} onChange={e => setSysConfig({...sysConfig, exam: {...sysConfig.exam, lockMarksAfterDays: Number(e.target.value)}})} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-white" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm text-slate-300">Allow Revaluation Requests</h4>
                                    <p className="text-xs text-slate-500">Enable student portal option for rechecking.</p>
                                </div>
                                <div onClick={() => setSysConfig({...sysConfig, exam: {...sysConfig.exam, allowRevaluation: !sysConfig.exam.allowRevaluation}})} className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${sysConfig.exam.allowRevaluation ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${sysConfig.exam.allowRevaluation ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeConfigTab === 'security' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Password Policy</label>
                                <select value={sysConfig.security.passwordPolicy} onChange={e => setSysConfig({...sysConfig, security: {...sysConfig.security, passwordPolicy: e.target.value as any}})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                    <option>Strong</option>
                                    <option>Medium</option>
                                    <option>Weak</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Session Timeout (Mins)</label>
                                <input type="number" value={sysConfig.security.sessionTimeoutMins} onChange={e => setSysConfig({...sysConfig, security: {...sysConfig.security, sessionTimeoutMins: Number(e.target.value)}})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                            </div>
                        </div>
                        
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><LockKeyhole className="w-5 h-5 text-rose-400"/> Authentication Rules</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300">Max Login Attempts</span>
                                    <input type="number" value={sysConfig.security.maxLoginAttempts} onChange={e => setSysConfig({...sysConfig, security: {...sysConfig.security, maxLoginAttempts: Number(e.target.value)}})} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-white" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300">Two-Factor Authentication (2FA)</span>
                                    <div onClick={() => setSysConfig({...sysConfig, security: {...sysConfig.security, mfaEnabled: !sysConfig.security.mfaEnabled}})} className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${sysConfig.security.mfaEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${sysConfig.security.mfaEnabled ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeConfigTab === 'features' && (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-white font-bold mb-2">Module Toggles</h3>
                        <p className="text-xs text-slate-500 mb-6">Enable or disable system-wide modules instantly.</p>
                        
                        {[
                            { key: 'counselling', label: 'Student Counselling', desc: 'Mentoring and issue tracking module.' },
                            { key: 'parentPortal', label: 'Parent Portal Access', desc: 'Allow parents to view attendance/marks.' },
                            { key: 'onlineExams', label: 'Online Examination', desc: 'CBT and Quiz modules.' },
                            { key: 'feedbackModule', label: 'Feedback System', desc: 'Faculty and facility feedback forms.' },
                            { key: 'internships', label: 'Internship Management', desc: 'Track external training and projects.' }
                        ].map((feat) => (
                            <div key={feat.key} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors">
                                <div>
                                    <h4 className="text-white font-bold text-sm">{feat.label}</h4>
                                    <p className="text-xs text-slate-500">{feat.desc}</p>
                                </div>
                                <div 
                                    onClick={() => setSysConfig({...sysConfig, features: {...sysConfig.features, [feat.key]: !sysConfig.features[feat.key as keyof typeof sysConfig.features]}})} 
                                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${sysConfig.features[feat.key as keyof typeof sysConfig.features] ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sysConfig.features[feat.key as keyof typeof sysConfig.features] ? 'left-7' : 'left-1'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeConfigTab === 'notifications' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><BellRing className="w-5 h-5 text-amber-400"/> Alert Channels</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-slate-400"/>
                                        <span className="text-slate-300">Email Notifications</span>
                                    </div>
                                    <input type="checkbox" checked={sysConfig.notifications.emailAlerts} onChange={e => setSysConfig({...sysConfig, notifications: {...sysConfig.notifications, emailAlerts: e.target.checked}})} className="w-5 h-5 accent-indigo-600 bg-slate-900 border-slate-700 rounded" />
                                </div>
                                <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-slate-400"/>
                                        <span className="text-slate-300">SMS Alerts</span>
                                    </div>
                                    <input type="checkbox" checked={sysConfig.notifications.smsAlerts} onChange={e => setSysConfig({...sysConfig, notifications: {...sysConfig.notifications, smsAlerts: e.target.checked}})} className="w-5 h-5 accent-indigo-600 bg-slate-900 border-slate-700 rounded" />
                                </div>
                                <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Laptop className="w-5 h-5 text-slate-400"/>
                                        <span className="text-slate-300">In-App / Push</span>
                                    </div>
                                    <input type="checkbox" checked={sysConfig.notifications.pushNotifications} onChange={e => setSysConfig({...sysConfig, notifications: {...sysConfig.notifications, pushNotifications: e.target.checked}})} className="w-5 h-5 accent-indigo-600 bg-slate-900 border-slate-700 rounded" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                            <strong>Note:</strong> SMS alerts may incur additional carrier charges. Ensure your gateway is configured in Server Settings.
                        </div>
                    </div>
                )}
            </div>
        </div>
     </div>
  );

  return (
    <Layout role="admin" userName="System Admin" sidebarItems={sidebarItems} activeView={activeView} onNavigate={setActiveView} onLogout={onLogout}>
      {activeView === 'dashboard' ? renderDashboard() : 
       activeView === 'users' ? renderUsers() : 
       activeView === 'departments' ? renderDepartments() :
       activeView === 'courses' ? renderCoursesAndSubjects() :
       activeView === 'roles' ? renderRoles() :
       activeView === 'logs' ? renderAuditLogs() :
       activeView === 'config' ? renderConfig() :
       <div className="p-10 text-center text-slate-500">View Placeholder</div>}
      
      {/* ... (Existing Modals remain unchanged) ... */}
      
      <BulkUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        title={uploadContext.title} 
        format={uploadContext.format}
        type={uploadContext.type}
        onSuccess={() => {
            alert("Upload Process Completed");
            setAuditLogs([{ id: Date.now(), action: 'Bulk Import', user: 'Admin User', role: 'admin', timestamp: new Date().toLocaleString(), details: `Completed ${uploadContext.title}`, status: 'Success' }, ...auditLogs]);
        }} 
      />

      {/* Add/Edit User Modal - EXPANDED */}
      {showAddUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                      <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">{editingUserId ? 'Edit User Profile' : 'Add New User'} <UserPlus className="w-5 h-5 text-indigo-400"/></h3>
                          <p className="text-xs text-slate-500">Complete all mandatory fields to create a system user.</p>
                      </div>
                      <button onClick={() => setShowAddUser(false)}><X className="w-5 h-5 text-slate-400"/></button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column: Basic Info */}
                      <div className="space-y-6">
                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">1. Basic Details</h4>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Full Name <span className="text-rose-500">*</span></label>
                                      <input type="text" value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-indigo-500 outline-none" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Email Address <span className="text-rose-500">*</span></label>
                                      <input type="email" value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-indigo-500 outline-none" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                      <div>
                                          <label className="text-xs text-slate-400 block mb-1">Mobile</label>
                                          <input type="tel" value={newUser.mobile || ''} onChange={e => setNewUser({...newUser, mobile: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                                      </div>
                                      <div>
                                          <label className="text-xs text-slate-400 block mb-1">Gender</label>
                                          <select value={newUser.gender} onChange={e => setNewUser({...newUser, gender: e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                              <option>Male</option><option>Female</option><option>Other</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Date of Birth</label>
                                      <input type="date" value={newUser.dob || ''} onChange={e => setNewUser({...newUser, dob: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
                                  </div>
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">2. Authentication</h4>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">User ID <span className="text-rose-500">*</span></label>
                                      <div className="flex gap-2">
                                          <input 
                                            type="text" 
                                            value={newUser.userId || ''} 
                                            onChange={e => setNewUser({...newUser, userId: e.target.value})} 
                                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm"
                                            placeholder="e.g. FAC202401"
                                          />
                                          <button onClick={generateUserId} type="button" className="bg-slate-800 text-slate-300 px-3 rounded border border-slate-700 hover:text-white" title="Auto Generate"><Sparkles className="w-4 h-4"/></button>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Account Status</label>
                                      <div className="flex gap-4 mt-2">
                                          {['Active', 'Inactive', 'Suspended'].map(s => (
                                              <label key={s} className="flex items-center gap-2 cursor-pointer">
                                                  <input type="radio" name="status" checked={newUser.status === s} onChange={() => setNewUser({...newUser, status: s as any})} className="accent-indigo-500"/>
                                                  <span className="text-sm text-slate-300">{s}</span>
                                              </label>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Middle Column: Roles & Scope */}
                      <div className="space-y-6">
                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">3. Role Assignment</h4>
                              
                              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4">
                                  <label className="text-xs text-slate-400 block mb-2">Primary Roles (Multi-select)</label>
                                  <div className="grid grid-cols-2 gap-2">
                                      {['student', 'faculty', 'hod', 'admin', 'principal', 'coordinator', 'tpo', 'librarian'].map(r => (
                                          <label key={r} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${newUser.roles?.includes(r as UserRole) ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                                              <input 
                                                type="checkbox" 
                                                checked={newUser.roles?.includes(r as UserRole)}
                                                onChange={e => {
                                                    const current = newUser.roles || [];
                                                    setNewUser({
                                                        ...newUser,
                                                        roles: e.target.checked 
                                                            ? [...current, r as UserRole]
                                                            : current.filter(cr => cr !== r)
                                                    });
                                                }}
                                                className="hidden"
                                              />
                                              <span className="capitalize text-xs font-bold">{r.replace('_', ' ')}</span>
                                          </label>
                                      ))}
                                  </div>
                              </div>

                              <div>
                                  <label className="text-xs text-slate-400 block mb-1">Mapped Department(s) <span className="text-rose-500">*</span></label>
                                  <select 
                                    multiple 
                                    value={newUser.departments} 
                                    onChange={e => {
                                        const selected = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                                        setNewUser({...newUser, departments: selected});
                                    }} 
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white h-28 text-xs focus:border-indigo-500 outline-none"
                                  >
                                      {departments.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
                                      <optgroup label="Administrative">
                                          <option value="Office">Office Administration</option>
                                          <option value="Exam Section">Exam Section</option>
                                          <option value="TPO">Placement Cell</option>
                                      </optgroup>
                                  </select>
                                  <p className="text-[10px] text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple departments.</p>
                              </div>
                          </div>

                          {/* Conditional Coordinator Section */}
                          {newUser.roles?.includes('coordinator') && (
                              <div className="animate-fadeIn">
                                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1 flex items-center gap-2"><BadgeCheck className="w-3 h-3"/> Coordinator Scopes</h4>
                                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto">
                                      {COORDINATOR_DEFINITIONS.map(def => (
                                          <label key={def.id} className="flex items-center justify-between p-2 hover:bg-slate-900 rounded cursor-pointer group">
                                              <div className="flex items-center gap-2">
                                                  <input 
                                                    type="checkbox"
                                                    checked={newUser.coordinatorRoles?.includes(def.id)}
                                                    onChange={e => {
                                                        const current = newUser.coordinatorRoles || [];
                                                        setNewUser({
                                                            ...newUser,
                                                            coordinatorRoles: e.target.checked 
                                                                ? [...current, def.id]
                                                                : current.filter(r => r !== def.id)
                                                        });
                                                    }}
                                                    className="rounded bg-slate-800 border-slate-600 accent-amber-500"
                                                  />
                                                  <span className="text-xs text-slate-300 group-hover:text-white">{def.label}</span>
                                              </div>
                                              {newUser.coordinatorRoles?.includes(def.id) && (
                                                  <div className="flex gap-1">
                                                      <input type="date" className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-[10px] text-slate-400 w-20" title="Valid From" />
                                                      <input type="date" className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-[10px] text-slate-400 w-20" title="Valid Till" />
                                                  </div>
                                              )}
                                          </label>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Right Column: Specific Details */}
                      <div className="space-y-6">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">4. Specific Details</h4>
                          
                          {newUser.roles?.includes('student') ? (
                              <div className="space-y-4 animate-fadeIn">
                                  <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded text-xs text-blue-300 mb-2">Student Profile Active</div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="text-xs text-slate-400 block mb-1">Roll Number</label>
                                          <input type="text" value={newUser.rollNo || ''} onChange={e => setNewUser({...newUser, rollNo: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                                      </div>
                                      <div>
                                          <label className="text-xs text-slate-400 block mb-1">Regulation</label>
                                          <select value={newUser.regulation} onChange={e => setNewUser({...newUser, regulation: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                              <option value="">Select</option><option>R23</option><option>R20</option><option>R19</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Course & Branch</label>
                                      <input type="text" value={newUser.course || ''} onChange={e => setNewUser({...newUser, course: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" placeholder="e.g. B.Tech CSE" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="text-xs text-slate-400 block mb-1">Section</label>
                                          <input type="text" value={newUser.section || ''} onChange={e => setNewUser({...newUser, section: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                                      </div>
                                      <div>
                                          <label className="text-xs text-slate-400 block mb-1">Admission Type</label>
                                          <select value={newUser.admissionType} onChange={e => setNewUser({...newUser, admissionType: e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                              <option value="Convener">Convener</option><option value="Management">Management</option>
                                          </select>
                                      </div>
                                  </div>
                              </div>
                          ) : (newUser.roles?.includes('faculty') || newUser.roles?.includes('hod')) ? (
                              <div className="space-y-4 animate-fadeIn">
                                  <div className="bg-purple-500/10 border border-purple-500/20 p-2 rounded text-xs text-purple-300 mb-2">Faculty Profile Active</div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Employee ID <span className="text-rose-500">*</span></label>
                                      <input type="text" value={newUser.employeeId || ''} onChange={e => setNewUser({...newUser, employeeId: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Designation</label>
                                      <select value={newUser.designation} onChange={e => setNewUser({...newUser, designation: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                          <option value="">Select Designation</option>
                                          <option>Professor</option>
                                          <option>Associate Professor</option>
                                          <option>Assistant Professor</option>
                                          <option>Lab Assistant</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Date of Joining</label>
                                      <input type="date" value={newUser.doj || ''} onChange={e => setNewUser({...newUser, doj: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-400 block mb-1">Qualification</label>
                                      <input type="text" value={newUser.qualification || ''} onChange={e => setNewUser({...newUser, qualification: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" placeholder="e.g. M.Tech, Ph.D" />
                                  </div>
                              </div>
                          ) : (
                              <div className="h-full flex items-center justify-center text-slate-600 text-sm italic border border-dashed border-slate-800 rounded bg-slate-900/50">
                                  Select a specific role (Student/Faculty) to see extra fields.
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                      <button onClick={() => setShowAddUser(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4"/> {editingUserId ? 'Update User' : 'Create & Activate User'}
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Department Modal */}
      {showAddDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">{editingDeptId ? 'Edit Department' : 'Add Department'} <Building2 className="w-5 h-5 text-indigo-400"/></h3>
                      <button onClick={() => setShowAddDept(false)}><X className="w-5 h-5 text-slate-400"/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-slate-400 block mb-1">Department Name <span className="text-rose-500">*</span></label>
                          <input type="text" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Code (Short) <span className="text-rose-500">*</span></label>
                              <input type="text" value={newDept.code} onChange={e => setNewDept({...newDept, code: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white uppercase font-mono" />
                          </div>
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Established Year</label>
                              <input type="number" value={newDept.estYear} onChange={e => setNewDept({...newDept, estYear: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Degree Level</label>
                              <select value={newDept.degreeLevel} onChange={e => setNewDept({...newDept, degreeLevel: e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                  <option>UG</option><option>PG</option><option>PhD</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Branch Type</label>
                              <select value={newDept.branchType} onChange={e => setNewDept({...newDept, branchType: e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                  <option>Engineering</option><option>Science</option><option>Management</option><option>Arts</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs text-slate-400 block mb-1">Head of Department (HOD)</label>
                          <select value={newDept.hod} onChange={e => setNewDept({...newDept, hod: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                              <option value="">Select Faculty</option>
                              {users.filter(u => u.roles.includes('faculty')).map(u => <option key={u.id}>{u.name}</option>)}
                          </select>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                      <button onClick={() => setShowAddDept(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={handleAddDepartment} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold shadow-lg shadow-indigo-900/20">
                          {editingDeptId ? 'Update' : 'Create'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Course Modal */}
      {showAddCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                      <h3 className="text-xl font-bold text-white">{editingCourseId ? 'Edit Course' : 'Add New Course'}</h3>
                      <button onClick={() => setShowAddCourse(false)}><X className="w-5 h-5 text-slate-400"/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-slate-400 block mb-1">Course Full Name</label>
                          <input type="text" value={newAdminCourse.name || ''} onChange={e => setNewAdminCourse({...newAdminCourse, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Code</label>
                              <input type="text" value={newAdminCourse.code || ''} onChange={e => setNewAdminCourse({...newAdminCourse, code: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white uppercase" />
                          </div>
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Department</label>
                              <select value={newAdminCourse.dept} onChange={e => setNewAdminCourse({...newAdminCourse, dept: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                  {departments.map(d => <option key={d.code} value={d.code}>{d.code}</option>)}
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Duration (Years)</label>
                              <input type="number" value={newAdminCourse.duration} onChange={e => setNewAdminCourse({...newAdminCourse, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                          </div>
                          <div>
                              <label className="text-xs text-slate-400 block mb-1">Regulation</label>
                              <select value={newAdminCourse.regulation} onChange={e => setNewAdminCourse({...newAdminCourse, regulation: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                  <option>R23</option><option>R20</option><option>R19</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                      <button onClick={() => setShowAddCourse(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={handleAddCourse} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold">
                          {editingCourseId ? 'Update' : 'Create'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Subject Modal */}
      {showAddSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                      <h3 className="text-xl font-bold text-white">{editingSubjectId ? 'Edit Subject' : 'Add Subject'}</h3>
                      <button onClick={() => setShowAddSubject(false)}><X className="w-5 h-5 text-slate-400"/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-slate-400 block mb-1">Course / Program</label>
                          <select value={newSubject.courseId || ''} onChange={e => setNewSubject({...newSubject, courseId: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                              <option value="">Select Course</option>
                              {adminCourses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Semester</label>
                              <select value={newSubject.semester} onChange={e => setNewSubject({...newSubject, semester: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>
                           <div className="flex items-end">
                               <button type="button" onClick={handleGenerateSubjectCode} className="w-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded text-xs flex items-center justify-center gap-2">
                                   <Shuffle className="w-3 h-3"/> Generate Code
                               </button>
                           </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Subject Name</label>
                              <input type="text" value={newSubject.name || ''} onChange={e => setNewSubject({...newSubject, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Subject Code</label>
                              <input type="text" value={newSubject.code || ''} onChange={e => setNewSubject({...newSubject, code: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono uppercase" />
                           </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Type</label>
                              <select value={newSubject.type} onChange={e => setNewSubject({...newSubject, type: e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white">
                                  <option>Theory</option><option>Lab</option><option>Elective</option><option>Project</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Credits</label>
                              <input type="number" value={newSubject.credits} onChange={e => setNewSubject({...newSubject, credits: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" />
                           </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                      <button onClick={() => setShowAddSubject(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={handleAddSubject} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold">
                          {editingSubjectId ? 'Update' : 'Create'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  );
};

export const PrincipalDashboard: React.FC<SimpleDashboardProps> = ({ role, onLogout }) => (
    <Layout role={role} userName="Principal" sidebarItems={[{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' }, { id: 'reports', label: 'Reports', icon: FileText, view: 'reports' }]} activeView="dashboard" onNavigate={()=>{}} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">Principal Dashboard</h2>
            <p>Overview of institution metrics coming soon.</p>
        </div>
    </Layout>
);

export const HODDashboard: React.FC<SimpleDashboardProps> = ({ role, onLogout }) => (
    <Layout role={role} userName="Dept. HOD" sidebarItems={[{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' }, { id: 'faculty', label: 'Faculty', icon: Users, view: 'faculty' }]} activeView="dashboard" onNavigate={()=>{}} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Building className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">HOD Dashboard</h2>
            <p>Department management tools coming soon.</p>
        </div>
    </Layout>
);

export const ExamCellDashboard: React.FC<SimpleDashboardProps> = ({ role, onLogout }) => (
    <Layout role={role} userName="Exam Cell" sidebarItems={[{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' }, { id: 'exams', label: 'Exams', icon: FileCheck, view: 'exams' }]} activeView="dashboard" onNavigate={()=>{}} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <FileCheck className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">Examination Cell</h2>
            <p>Exam scheduling and marks management.</p>
        </div>
    </Layout>
);

export const CoordinatorDashboard: React.FC<SimpleDashboardProps> = ({ role, onLogout }) => (
    <Layout role={role} userName="Coordinator" sidebarItems={[{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' }, { id: 'tasks', label: 'Tasks', icon: ListTodo, view: 'tasks' }]} activeView="dashboard" onNavigate={()=>{}} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Network className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">Coordinator Dashboard</h2>
            <p>Coordination tasks and approvals.</p>
        </div>
    </Layout>
);

export const LibraryDashboard: React.FC<SimpleDashboardProps> = ({ role, onLogout }) => (
    <Layout role={role} userName="Librarian" sidebarItems={[{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' }, { id: 'books', label: 'Books', icon: Book, view: 'books' }]} activeView="dashboard" onNavigate={()=>{}} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Library className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">Library Management</h2>
            <p>Book tracking and issuing system.</p>
        </div>
    </Layout>
);

export const TPODashboard: React.FC<SimpleDashboardProps> = ({ role, onLogout }) => (
    <Layout role={role} userName="Placement Officer" sidebarItems={[{ id: 'dash', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' }, { id: 'drives', label: 'Drives', icon: Briefcase, view: 'drives' }]} activeView="dashboard" onNavigate={()=>{}} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Briefcase className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">Placement Cell</h2>
            <p>Recruitment drives and student placement tracking.</p>
        </div>
    </Layout>
);
