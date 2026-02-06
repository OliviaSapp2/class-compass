import { 
  FileText, 
  Users, 
  ClipboardList, 
  Clock, 
  ArrowUpRight,
  AlertCircle,
  Upload,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, todos, students, lastAnalysisRun } = useApp();

  const highRiskStudents = students.filter(s => s.riskLevel === 'high').length;

  const statCards = [
    {
      title: 'Materials Uploaded',
      value: stats.materialsUploaded,
      icon: FileText,
      subtitle: 'Textbooks, lessons, notes',
      onClick: () => navigate('/uploads'),
    },
    {
      title: 'Student Work Uploaded',
      value: stats.studentWorkUploaded,
      icon: ClipboardList,
      subtitle: 'Homework, quizzes, tests',
      onClick: () => navigate('/uploads'),
    },
    {
      title: 'Students',
      value: stats.studentsCount,
      icon: Users,
      subtitle: `${highRiskStudents} need attention`,
      highlight: highRiskStudents > 0,
      onClick: () => navigate('/students'),
    },
    {
      title: 'Last Analysis Run',
      value: lastAnalysisRun 
        ? formatDistanceToNow(new Date(lastAnalysisRun), { addSuffix: true })
        : 'Never',
      icon: Clock,
      subtitle: 'Performance analysis',
      onClick: () => navigate('/insights'),
    },
  ];

  const getTodoIcon = (type: string) => {
    switch (type) {
      case 'upload': return Upload;
      case 'analysis': return BarChart3;
      case 'review': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your class materials and student performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className="card-stat cursor-pointer group"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.highlight ? 'text-status-warning font-medium' : 'text-muted-foreground'}`}>
                {stat.subtitle}
              </p>
              <ArrowUpRight className="h-4 w-4 mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* To Do Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-status-warning" />
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos.map((todo) => {
              const Icon = getTodoIcon(todo.type);
              return (
                <div 
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{todo.text}</span>
                </div>
              );
            })}
            {todos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">All caught up! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity / Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate('/uploads')}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Upload Materials</p>
                  <p className="text-xs text-muted-foreground">Add textbooks, lessons, or student work</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate('/students')}
              >
                <Users className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">View Students</p>
                  <p className="text-xs text-muted-foreground">Check individual performance reports</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate('/insights')}
              >
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Class Insights</p>
                  <p className="text-xs text-muted-foreground">View topic mastery across class</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate('/reports')}
              >
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Export Reports</p>
                  <p className="text-xs text-muted-foreground">Download PDF or CSV reports</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Needing Attention */}
      {highRiskStudents > 0 && (
        <Card className="border-status-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-warning">
              <AlertCircle className="h-5 w-5" />
              Students Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {students
                .filter(s => s.riskLevel === 'high')
                .map(student => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-risk-high-bg text-sm font-medium text-risk-high">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Score: {student.overallScore}% • Declining
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
