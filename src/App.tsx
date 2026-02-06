import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Uploads from "./pages/Uploads";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import ClassInsights from "./pages/ClassInsights";
import Resources from "./pages/Resources";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentGaps from "./pages/student/StudentGaps";
import StudentStudyPlan from "./pages/student/StudentStudyPlan";
import StudentUploads from "./pages/student/StudentUploads";
import StudentProgress from "./pages/student/StudentProgress";
import StudentSettings from "./pages/student/StudentSettings";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, userRole } = useApp();
  
  // Determine default redirect based on role
  const defaultRoute = userRole === 'student' ? '/student/dashboard' : '/dashboard';
  
  return (
    <Routes>
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to={defaultRoute} replace /> : <Auth />} 
      />
      
      {/* Teacher Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={defaultRoute} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="uploads" element={<Uploads />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="insights" element={<ClassInsights />} />
        <Route path="resources" element={<Resources />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Student Routes */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="gaps" element={<StudentGaps />} />
        <Route path="study-plan" element={<StudentStudyPlan />} />
        <Route path="uploads" element={<StudentUploads />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
