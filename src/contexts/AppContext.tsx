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
import { queryAnalysis } from '@/lib/api';
import { sampleAnalysisResult } from '@/lib/sampleAnalysisResult';

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
  analysisResult: any | null;
  setAnalysisResult: (result: any) => void;
  clearAnalysisResult: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class>(mockClasses[0]);
  const [uploads, setUploads] = useState<Upload[]>(mockUploads);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [lastAnalysisRun, setLastAnalysisRun] = useState<string | null>(initialStats.lastAnalysisRun);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const addUpload = (upload: Upload) => {
    setUploads(prev => [upload, ...prev]);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Update progress: Starting analysis
      setAnalysisProgress(10);
      
      // Prepare analysis query based on current context
      const materialsCount = uploads.filter(u => u.type === 'material').length;
      const studentWorkCount = uploads.filter(u => u.type === 'student_work').length;
      
      // Construct a comprehensive query for analysis
      const analysisQuery = `Analyze student performance for ${selectedClass.name}. 
        There are students, ${materialsCount} class materials, 
        and ${studentWorkCount} student work submissions. 
        Find the lower grade of students, provide insights on student performance, 
        identify lower performing students, and suggest areas for improvement.`;
      
      setAnalysisProgress(30);
      
      // Call the Stack AI API
      const response = await queryAnalysis({
        query: analysisQuery,
        userId: isAuthenticated ? 'user' : '' // You can replace with actual user ID if available
      });
      
      setAnalysisProgress(80);
      
      // Store the analysis result
      setAnalysisResult(response);
      
      // Log the response for debugging
      console.log('Analysis response:', JSON.stringify(response, null, 2));
      
      setAnalysisProgress(100);
      
      // Update last analysis run timestamp
      setLastAnalysisRun(new Date().toISOString());
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error; // Re-throw to allow error handling in components
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const clearAnalysisResult = () => {
    setAnalysisResult(null);
  };

  // Initialize with sample analysis result if needed (for development/testing)
  React.useEffect(() => {
    // Check if we should load a sample result from localStorage or initialize with provided data
    const savedResult = localStorage.getItem('class-compass-analysis-result');
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setAnalysisResult(parsed);
        if (parsed.run_id && !lastAnalysisRun) {
          setLastAnalysisRun(new Date().toISOString());
        }
      } catch (e) {
        console.error('Failed to load saved analysis result:', e);
      }
    } else {
      // Initialize with sample result for demonstration
      // In production, remove this and only load from API/localStorage
      setAnalysisResult(sampleAnalysisResult);
      setLastAnalysisRun(new Date().toISOString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

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
      analysisResult,
      setAnalysisResult,
      clearAnalysisResult,
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
