import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <div className="ml-64">
        <StudentHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
