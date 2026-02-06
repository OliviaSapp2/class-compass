import React, { createContext, useContext, useState, ReactNode } from 'react';
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

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  
  // Class selection
  selectedClass: Class;
  setSelectedClass: (classItem: Class) => void;
  classes: Class[];
  
  // Students
  students: Student[];
  
  // Uploads
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class>(mockClasses[0]);
  const [uploads, setUploads] = useState<Upload[]>(mockUploads);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [lastAnalysisRun, setLastAnalysisRun] = useState<string | null>(initialStats.lastAnalysisRun);

  const addUpload = (upload: Upload) => {
    setUploads(prev => [upload, ...prev]);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisProgress(i);
    }
    
    setLastAnalysisRun(new Date().toISOString());
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
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
