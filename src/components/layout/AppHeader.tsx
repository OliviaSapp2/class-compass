import { Bell, Search, ChevronDown, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { AnalysisModal } from '@/components/modals/AnalysisModal';

export function AppHeader() {
  const { selectedClass, setSelectedClass, classes, isAnalyzing } = useApp();
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

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

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            MJ
          </div>
        </div>
      </header>

      <AnalysisModal 
        open={showAnalysisModal} 
        onOpenChange={setShowAnalysisModal} 
      />
    </>
  );
}
