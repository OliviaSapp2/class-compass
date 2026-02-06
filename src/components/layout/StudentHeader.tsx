import { Bell, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export function StudentHeader() {
  const { studentProfile, setUserRole } = useApp();
  const navigate = useNavigate();

  const handleSwitchToTeacher = () => {
    setUserRole('teacher');
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Left: Class Info */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-medium">{studentProfile.className}</h2>
          <p className="text-sm text-muted-foreground">{studentProfile.grade} Grade</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {studentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{studentProfile.name}</p>
                <p className="text-xs text-muted-foreground">{studentProfile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/student/settings')}>
              <User className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Role
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={handleSwitchToTeacher}>
              Switch to Teacher View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
