import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { 
  Class, 
  Student, 
  Upload, 
  mockClasses, 
  mockStudents, 
  mockUploads,
  dashboardStats as initialStats,
  todoItems as initialTodos
} from '@/lib/mockData';
import {
  StudentProfile,
  Gap,
  StudyPlan,
  StudentProgress,
  StudentUpload,
  Assessment,
  StudyTask,
  mockStudentProfile,
  mockGaps,
  mockProgress,
  mockStudentUploads,
  mockUpcomingAssessments,
} from '@/lib/studentMockData';
import { generateAIStudyPlan } from '@/lib/api/study-plan';

export type UserRole = 'teacher' | 'student';

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  
  // Role management
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Class selection
  selectedClass: Class;
  setSelectedClass: (classItem: Class) => void;
  classes: Class[];
  
  // Students (teacher view)
  students: Student[];
  
  // Uploads (teacher view)
  uploads: Upload[];
  addUpload: (upload: Upload) => void;
  
  // Dashboard stats
  stats: typeof initialStats;
  
  // Todos
  todos: typeof initialTodos;
  
  // Analysis state
  isAnalyzing: boolean;
  analysisProgress: number;
  runAnalysis: () => Promise<void>;
  lastAnalysisRun: string | null;
  
  // Student-specific state
  studentProfile: StudentProfile;
  studentGaps: Gap[];
  studyPlan: StudyPlan | null;
  setStudyPlan: (plan: StudyPlan | null) => void;
  studentProgress: StudentProgress;
  updateStudentProgress: (updates: Partial<StudentProgress>) => void;
  studentUploads: StudentUpload[];
  addStudentUpload: (upload: StudentUpload) => void;
  setStudentUploads: (uploads: StudentUpload[]) => void;
  upcomingAssessments: Assessment[];
  
  // Study plan actions
  generateStudyPlan: (settings: StudyPlan['settings']) => Promise<void>;
  completeTask: (taskId: string, reflection?: string) => void;
  addGapToPlan: (gapId: string) => void;
  toggleShareWithTeacher: () => void;
  
  // Generation state
  isGeneratingPlan: boolean;
  planGenerationProgress: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [selectedClass, setSelectedClass] = useState<Class>(mockClasses[0]);
  const [uploads, setUploads] = useState<Upload[]>(mockUploads);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [lastAnalysisRun, setLastAnalysisRun] = useState<string | null>(initialStats.lastAnalysisRun);

  // Student state
  const [studentProfile] = useState<StudentProfile>(mockStudentProfile);
  const [studentGaps] = useState<Gap[]>(mockGaps);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress>(mockProgress);
  const [studentUploads, setStudentUploads] = useState<StudentUpload[]>(mockStudentUploads);
  const [upcomingAssessments] = useState<Assessment[]>(mockUpcomingAssessments);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planGenerationProgress, setPlanGenerationProgress] = useState(0);

  const addUpload = (upload: Upload) => {
    setUploads(prev => [upload, ...prev]);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Import dynamically to avoid circular dependencies
      const { runAnalyze } = await import('@/lib/agents');
      
      // Progress simulation while waiting for API
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 5, 90));
      }, 500);
      
      const result = await runAnalyze({
        class_id: selectedClass.id,
        student_ids: mockStudents.map(s => s.id),
        upload_refs: uploads.map(u => u.id),
      });
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      console.log('Analysis result:', result);
      setLastAnalysisRun(new Date().toISOString());
    } catch (error) {
      console.error('Analysis failed:', error);
      // Still update last run time even on error for UX
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const addStudentUpload = (upload: StudentUpload) => {
    setStudentUploads(prev => [upload, ...prev]);
  };

  const updateStudentUploads = (uploads: StudentUpload[]) => {
    setStudentUploads(uploads);
  };

  const updateStudentProgress = (updates: Partial<StudentProgress>) => {
    setStudentProgress(prev => ({ ...prev, ...updates }));
  };

  const generateStudyPlan = async (settings: StudyPlan['settings']) => {
    setIsGeneratingPlan(true);
    setPlanGenerationProgress(0);
    
    // Start progress animation
    const progressInterval = setInterval(() => {
      setPlanGenerationProgress(prev => Math.min(prev + 3, 90));
    }, 300);
    
    try {
      // Include uploaded assessment files and upcoming assessments in the generation
      const result = await generateAIStudyPlan({
        gaps: studentGaps,
        settings,
        studentProfile: {
          name: studentProfile.name,
          grade: studentProfile.grade,
          goals: studentProfile.goals,
        },
        uploads: studentUploads,
        assessments: upcomingAssessments,
      });
      
      clearInterval(progressInterval);
      setPlanGenerationProgress(100);
      
      if (result.success && result.studyPlan) {
        setStudyPlan(result.studyPlan);
        toast.success('Study plan generated successfully!');
      } else {
        console.error('Failed to generate plan:', result.error);
        toast.error(result.error || 'Failed to generate study plan');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating study plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
      setPlanGenerationProgress(0);
    }
  };

  const completeTask = (taskId: string, reflection?: string) => {
    if (!studyPlan) return;
    
    const updatedWeeks = studyPlan.weeks.map(week => ({
      ...week,
      days: week.days.map(day => ({
        ...day,
        tasks: day.tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString(), reflection } 
            : task
        ),
        isCompleted: day.tasks.every(t => t.id === taskId || t.status === 'completed'),
      })),
    }));
    
    setStudyPlan({ ...studyPlan, weeks: updatedWeeks });
    setStudentProgress(prev => ({
      ...prev,
      completedTasks: prev.completedTasks + 1,
    }));
  };

  const addGapToPlan = (gapId: string) => {
    // Mock: In real app, this would add the gap topic to the study plan
    console.log('Adding gap to plan:', gapId);
  };

  const toggleShareWithTeacher = () => {
    if (!studyPlan) return;
    setStudyPlan({ ...studyPlan, shareWithTeacher: !studyPlan.shareWithTeacher });
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      userRole,
      setUserRole,
      selectedClass,
      setSelectedClass,
      classes: mockClasses,
      students: mockStudents,
      uploads,
      addUpload,
      stats: initialStats,
      todos: initialTodos,
      isAnalyzing,
      analysisProgress,
      runAnalysis,
      lastAnalysisRun,
      studentProfile,
      studentGaps,
      studyPlan,
      setStudyPlan,
      studentProgress,
      updateStudentProgress,
      studentUploads,
      addStudentUpload,
      setStudentUploads: updateStudentUploads,
      upcomingAssessments,
      generateStudyPlan,
      completeTask,
      addGapToPlan,
      toggleShareWithTeacher,
      isGeneratingPlan,
      planGenerationProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
