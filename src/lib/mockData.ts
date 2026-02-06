// Mock data for the AI Teaching Assistant

export interface Class {
  id: string;
  name: string;
  grade: string;
  subject: string;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastAnalyzedAt: string | null;
  lastSubmission: string | null;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Upload {
  id: string;
  type: 'material' | 'student_work';
  category: 'textbook' | 'lesson_plan' | 'lecture_notes' | 'homework' | 'quiz' | 'test' | 'classwork';
  fileName: string;
  fileSize: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'error';
  uploadedAt: string;
  uploadedBy: string;
}

export interface TopicInsight {
  id: string;
  studentId: string;
  subject: string;
  unit: string;
  topic: string;
  masteryScore: number;
  confidence: 'low' | 'medium' | 'high';
  evidence: string[];
  recommendation: string;
  lastSeen: string;
}

export interface ClassInsight {
  topic: string;
  unit: string;
  subject: string;
  avgMastery: number;
  studentsAffected: number;
  totalStudents: number;
}

export const mockClasses: Class[] = [
  { id: '1', name: 'Period 2 – 7th Grade Math', grade: '7th', subject: 'Math', studentCount: 28 },
  { id: '2', name: 'Period 3 – 7th Grade Math', grade: '7th', subject: 'Math', studentCount: 26 },
  { id: '3', name: 'Period 5 – 8th Grade Math', grade: '8th', subject: 'Math', studentCount: 30 },
];

export const mockStudents: Student[] = [
  { id: '1', name: 'Emma Thompson', email: 'emma.t@school.edu', riskLevel: 'low', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-14T15:00:00Z', overallScore: 92, trend: 'up' },
  { id: '2', name: 'James Wilson', email: 'james.w@school.edu', riskLevel: 'medium', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-13T12:00:00Z', overallScore: 74, trend: 'down' },
  { id: '3', name: 'Sofia Garcia', email: 'sofia.g@school.edu', riskLevel: 'low', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-14T16:30:00Z', overallScore: 88, trend: 'stable' },
  { id: '4', name: 'Liam Chen', email: 'liam.c@school.edu', riskLevel: 'high', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-10T09:00:00Z', overallScore: 58, trend: 'down' },
  { id: '5', name: 'Olivia Brown', email: 'olivia.b@school.edu', riskLevel: 'low', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-14T14:00:00Z', overallScore: 95, trend: 'up' },
  { id: '6', name: 'Noah Martinez', email: 'noah.m@school.edu', riskLevel: 'medium', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-12T11:00:00Z', overallScore: 71, trend: 'stable' },
  { id: '7', name: 'Ava Johnson', email: 'ava.j@school.edu', riskLevel: 'high', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-08T10:00:00Z', overallScore: 52, trend: 'down' },
  { id: '8', name: 'Ethan Davis', email: 'ethan.d@school.edu', riskLevel: 'low', lastAnalyzedAt: '2024-01-15T10:30:00Z', lastSubmission: '2024-01-14T15:30:00Z', overallScore: 85, trend: 'up' },
];

export const mockUploads: Upload[] = [
  { id: '1', type: 'material', category: 'textbook', fileName: 'Math_Grade7_Textbook_Ch1-5.pdf', fileSize: '24.5 MB', status: 'analyzed', uploadedAt: '2024-01-10T09:00:00Z', uploadedBy: 'Ms. Johnson' },
  { id: '2', type: 'material', category: 'lesson_plan', fileName: 'Fractions_Unit_LessonPlan.pdf', fileSize: '2.1 MB', status: 'analyzed', uploadedAt: '2024-01-11T10:30:00Z', uploadedBy: 'Ms. Johnson' },
  { id: '3', type: 'material', category: 'lecture_notes', fileName: 'Multiplying_Fractions_Notes.docx', fileSize: '856 KB', status: 'analyzed', uploadedAt: '2024-01-12T08:00:00Z', uploadedBy: 'Ms. Johnson' },
  { id: '4', type: 'student_work', category: 'homework', fileName: 'HW_Week3_Fractions.pdf', fileSize: '15.2 MB', status: 'analyzed', uploadedAt: '2024-01-13T16:00:00Z', uploadedBy: 'Ms. Johnson' },
  { id: '5', type: 'student_work', category: 'quiz', fileName: 'Quiz_Fractions_Basics.pdf', fileSize: '8.7 MB', status: 'analyzed', uploadedAt: '2024-01-14T11:00:00Z', uploadedBy: 'Ms. Johnson' },
  { id: '6', type: 'student_work', category: 'test', fileName: 'Unit2_Test_Fractions.pdf', fileSize: '12.3 MB', status: 'processing', uploadedAt: '2024-01-15T09:00:00Z', uploadedBy: 'Ms. Johnson' },
];

export const mockTopicInsights: TopicInsight[] = [
  {
    id: '1',
    studentId: '4',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Multiplying Fractions',
    masteryScore: 35,
    confidence: 'high',
    evidence: ['Quiz 3: 2/8 correct on multiplication problems', 'Homework 5: Skipped 4 multiplication questions', 'Test 2: 1/5 on fraction multiplication section'],
    recommendation: 'Review visual models for fraction multiplication. Start with unit fractions before moving to mixed numbers.',
    lastSeen: '2024-01-14T11:00:00Z'
  },
  {
    id: '2',
    studentId: '4',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Dividing Fractions',
    masteryScore: 42,
    confidence: 'medium',
    evidence: ['Quiz 3: 3/7 correct on division problems', 'Homework 6: Incorrect "flip and multiply" steps'],
    recommendation: 'Practice "keep-change-flip" method with concrete examples before abstract problems.',
    lastSeen: '2024-01-13T15:00:00Z'
  },
  {
    id: '3',
    studentId: '4',
    subject: 'Math',
    unit: 'Decimals',
    topic: 'Converting Fractions to Decimals',
    masteryScore: 55,
    confidence: 'medium',
    evidence: ['Quiz 2: Confusion between terminating and repeating decimals', 'Homework 4: 5/10 correct'],
    recommendation: 'Use number line to visualize fraction-decimal equivalence.',
    lastSeen: '2024-01-12T10:00:00Z'
  },
  {
    id: '4',
    studentId: '7',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Adding Fractions with Unlike Denominators',
    masteryScore: 28,
    confidence: 'high',
    evidence: ['Test 1: 0/4 on unlike denominator problems', 'Homework 3: Adding numerators without finding common denominator'],
    recommendation: 'Return to finding LCM before attempting addition. Use visual fraction strips.',
    lastSeen: '2024-01-14T11:00:00Z'
  },
  {
    id: '5',
    studentId: '7',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Simplifying Fractions',
    masteryScore: 38,
    confidence: 'high',
    evidence: ['Quiz 2: Did not recognize equivalent fractions', 'Homework 2: Left answers unsimplified'],
    recommendation: 'Practice finding GCF. Use factor trees to identify common factors.',
    lastSeen: '2024-01-13T12:00:00Z'
  },
  {
    id: '6',
    studentId: '2',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Word Problems with Fractions',
    masteryScore: 58,
    confidence: 'medium',
    evidence: ['Test 2: Struggled to identify operation needed', 'Homework 7: 4/8 correct on word problems'],
    recommendation: 'Practice identifying key words that indicate operations. Use drawing diagrams strategy.',
    lastSeen: '2024-01-14T11:00:00Z'
  },
];

export const mockClassInsights: ClassInsight[] = [
  { topic: 'Multiplying Fractions', unit: 'Fractions', subject: 'Math', avgMastery: 62, studentsAffected: 12, totalStudents: 28 },
  { topic: 'Dividing Fractions', unit: 'Fractions', subject: 'Math', avgMastery: 58, studentsAffected: 15, totalStudents: 28 },
  { topic: 'Adding Unlike Denominators', unit: 'Fractions', subject: 'Math', avgMastery: 71, studentsAffected: 8, totalStudents: 28 },
  { topic: 'Converting to Decimals', unit: 'Decimals', subject: 'Math', avgMastery: 75, studentsAffected: 6, totalStudents: 28 },
  { topic: 'Simplifying Fractions', unit: 'Fractions', subject: 'Math', avgMastery: 78, studentsAffected: 5, totalStudents: 28 },
  { topic: 'Fraction Word Problems', unit: 'Fractions', subject: 'Math', avgMastery: 65, studentsAffected: 10, totalStudents: 28 },
];

export const dashboardStats = {
  materialsUploaded: 12,
  studentWorkUploaded: 45,
  studentsCount: 28,
  lastAnalysisRun: '2024-01-15T10:30:00Z',
};

export const todoItems = [
  { id: '1', text: 'Upload Week 4 homework submissions', type: 'upload' as const },
  { id: '2', text: 'Run analysis on recent quiz results', type: 'analysis' as const },
  { id: '3', text: 'Review 3 high-risk student reports', type: 'review' as const },
];
