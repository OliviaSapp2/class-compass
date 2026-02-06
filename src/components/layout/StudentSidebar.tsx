import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Upload, 
  TrendingUp, 
  Settings,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
  { icon: Target, label: 'My Gaps', path: '/student/gaps' },
  { icon: BookOpen, label: 'Study Plan', path: '/student/study-plan' },
  { icon: Upload, label: 'Uploads', path: '/student/uploads' },
  { icon: TrendingUp, label: 'Progress', path: '/student/progress' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/student/settings' },
];

export function StudentSidebar() {
  const location = useLocation();
  const { setIsAuthenticated, studentProfile } = useApp();

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold">AI Learning</h1>
          <p className="text-xs text-muted-foreground">Assistant</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            {studentProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{studentProfile.name}</p>
            <p className="text-xs text-muted-foreground truncate">{studentProfile.className}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'nav-item',
                isActive && 'nav-item-active'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-4 space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'nav-item',
                isActive && 'nav-item-active'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
