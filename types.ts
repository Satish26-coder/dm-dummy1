
export type Language = 'python' | 'javascript' | 'cpp' | 'java' | 'c' | 'html' | 'css' | 'sql' | 'json';
export type LabType = 'single-file' | 'frontend' | 'backend' | 'database';
export type SubmissionStatus = 'pending' | 'submitted' | 'reviewed';
export type UserRole = 'admin' | 'principal' | 'hod' | 'exam_cell' | 'faculty' | 'student' | 'coordinator' | 'librarian' | 'tpo';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any; // Lucide icon component
  view: string;
}

export interface ProjectFile {
  name: string;
  language: Language;
  content: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isPrivate: boolean;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  progress: number; // percentage
  totalLabs: number;
}

export interface LabSession {
  id: string;
  courseId?: string; // Optional because independent projects don't belong to a course
  title: string;
  type: LabType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string; 
  aim: string;
  description: string;
  definitions?: string; // Key definitions/concepts
  procedure: string[];
  logicHint: string;
  
  files: ProjectFile[]; // The student's working files (starts as template)
  solutionFiles?: ProjectFile[]; // The correct solution (hidden initially)
  languageTemplates?: Record<string, string>; 
  testCases: TestCase[];
  
  // Student Progress & Faculty Review
  status: SubmissionStatus;
  submittedAt?: string;
  marks?: number;
  maxMarks?: number;
  facultyFeedback?: string;
  failedAttempts?: number; // Track failures to unlock solution
}

export interface ExecutionResult {
  passed: boolean;
  actualOutput: string;
  error?: string;
  testCaseId: string;
}

export interface CompilationResponse {
  success: boolean;
  compileError?: string;
  debugInstructions?: string; 
  results: ExecutionResult[];
}

// --- New Faculty Types ---

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'image' | 'video' | 'link';
  courseId: string;
  uploadDate: string;
  downloads: number;
  url?: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'written' | 'lab' | 'programming' | 'case-study' | 'presentation';
  courseId: string;
  dueDate: string;
  status: 'active' | 'closed';
  submissionCount: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questionsCount: number;
  duration: number; // minutes
  status: 'draft' | 'published';
  questions?: QuizQuestion[];
}

// --- Counselling Module Types ---

export interface Mentee {
  id: string;
  name: string;
  rollNo: string;
  batch: string;
  attendance: number; // percentage
  cgpa: number;
  backlogs: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  contact: string;
  parentContact: string;
}

export interface CounsellingSession {
  id: string;
  studentId: string;
  date: string;
  type: 'Academic' | 'Behavioural' | 'Personal' | 'Attendance' | 'Career';
  discussionSummary: string;
  actionPlan: string;
  parentContacted: boolean;
  status: 'Open' | 'Closed' | 'Escalated';
}

export interface ParentLog {
  id: string;
  studentId: string;
  date: string;
  type: 'Phone' | 'Meeting' | 'Email';
  summary: string;
}
