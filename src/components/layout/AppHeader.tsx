import { Bell, Search, ChevronDown, Play, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisModal } from '@/components/modals/AnalysisModal';

export function AppHeader() {
  const { selectedClass, setSelectedClass, classes, isAnalyzing, setUserRole } = useApp();
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const navigate = useNavigate();

  const handleSwitchToStudent = () => {
    setUserRole('student');
    navigate('/student/dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        {/* Left: Class Selector */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 px-4">
                <span className="font-medium">{selectedClass.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {classes.map((classItem) => (
                <DropdownMenuItem
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem)}
                  className="flex flex-col items-start gap-0.5 py-2"
                >
                  <span className="font-medium">{classItem.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {classItem.studentCount} students
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students, uploads, topics..."
              className="h-10 pl-10 bg-muted/50 border-0"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAnalysisModal(true)}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run Analysis
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  MJ
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Ms. Johnson</p>
                  <p className="text-xs text-muted-foreground">teacher@school.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch Role
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={handleSwitchToStudent}>
                Switch to Student View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AnalysisModal 
        open={showAnalysisModal} 
        onOpenChange={setShowAnalysisModal} 
      />
    </>
  );
}
