import { 
  FileText, 
  Users, 
  ClipboardList, 
  Clock, 
  ArrowUpRight,
  AlertCircle,
  Upload,
  BarChart3,
  TrendingUp,
  X,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { formatAnalysisResult, parseAnalysisText } from '@/lib/analysisParser';
import { getAnalysisSummary } from '@/lib/analysisMapper';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, todos, students, lastAnalysisRun, analysisResult, clearAnalysisResult } = useApp();

  // Get analysis summary
  const analysisSummary = useMemo(() => {
    if (!analysisResult) return null;
    
    try {
      const formattedResult = formatAnalysisResult(analysisResult);
      const parsed = parseAnalysisText(formattedResult);
      return getAnalysisSummary(parsed);
    } catch (error) {
      console.error('Error getting analysis summary:', error);
      return null;
    }
  }, [analysisResult]);

  // Use analysis summary for risk counts if available
  const highRiskStudents = analysisSummary 
    ? analysisSummary.highPriority 
    : students.filter(s => s.riskLevel === 'high').length;

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

      {/* Analysis Summary Card */}
      {analysisSummary && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Analysis Summary
              {lastAnalysisRun && (
                <Badge variant="secondary" className="ml-auto">
                  {formatDistanceToNow(new Date(lastAnalysisRun), { addSuffix: true })}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Students Analyzed</p>
                <p className="text-2xl font-bold">{analysisSummary.totalAnalyzed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-500">{analysisSummary.highPriority}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{analysisSummary.avgScore}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Struggling</p>
                <p className="text-2xl font-bold text-orange-500">{analysisSummary.strugglingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Latest Analysis Results */}
      {analysisResult && (() => {
        const formattedResult = formatAnalysisResult(analysisResult);
        const parsed = parseAnalysisText(formattedResult);
        const hasStructuredData = parsed.students.length > 0;

        const getPriorityColor = (priority: number | null) => {
          if (priority === null) return 'bg-muted';
          if (priority === 1) return 'bg-red-500';
          if (priority === 2) return 'bg-orange-500';
          return 'bg-yellow-500';
        };

        const getScoreColor = (percentage?: number) => {
          if (!percentage) return 'text-foreground';
          if (percentage < 50) return 'text-red-500';
          if (percentage < 70) return 'text-orange-500';
          return 'text-green-500';
        };

        const formatText = (text: string) => {
          const parts = text.split(/(\*\*.*?\*\*|\|.*?\|)/g);
          return parts.map((part, pIdx) => {
            if ((part.startsWith('**') && part.endsWith('**')) ||
                (part.startsWith('|') && part.endsWith('|'))) {
              return (
                <strong key={pIdx} className="font-bold text-foreground">
                  {part.replace(/[*|]/g, '')}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          });
        };

        return (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Latest Analysis Results
                  {lastAnalysisRun && (
                    <Badge variant="secondary" className="ml-2">
                      {formatDistanceToNow(new Date(lastAnalysisRun), { addSuffix: true })}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAnalysisResult}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full">
                <div className="space-y-6 pr-4">
                  {/* Title and Description */}
                  {(parsed.title || parsed.description) && (
                    <div>
                      {parsed.title && (
                        <h2 className="text-lg font-semibold mb-2">{parsed.title}</h2>
                      )}
                      {parsed.description && (
                        <p className="text-sm text-muted-foreground">{parsed.description}</p>
                      )}
                    </div>
                  )}

                  {/* Structured Student Display */}
                  {hasStructuredData ? (
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-status-warning" />
                        Students with Lowest Grades
                      </h3>
                      
                      {parsed.students.slice(0, 3).map((student, index) => (
                        <Card key={index} className="border-l-4 border-l-red-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {student.priority !== null && (
                                  <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                                    getPriorityColor(student.priority)
                                  )}>
                                    {student.priority}
                                  </div>
                                )}
                                <div>
                                  <CardTitle className="text-base">{student.name}</CardTitle>
                                  {student.score && (
                                    <p className={cn(
                                      "text-sm font-semibold mt-1",
                                      getScoreColor(student.percentage)
                                    )}>
                                      <span className="font-medium">Score:</span> {student.score}
                                      {student.percentage && student.percentage < 50 && (
                                        <Badge variant="destructive" className="ml-2 text-xs">Lowest</Badge>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-0">
                            {/* Weak Areas */}
                            {student.weakAreas.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold mb-1.5 text-muted-foreground uppercase">
                                  Weak Areas
                                </h4>
                                <div className="space-y-1 pl-2">
                                  {student.weakAreas.slice(0, 2).map((area, idx) => (
                                    <div key={idx} className="text-xs">
                                      {area.split('→').map((part, pIdx) => (
                                        <span key={pIdx}>
                                          <span className="font-medium">{part.trim()}</span>
                                          {pIdx < area.split('→').length - 1 && (
                                            <span className="mx-1 text-muted-foreground">→</span>
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Key Evidence */}
                            {student.evidence.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold mb-1.5 text-muted-foreground uppercase">
                                  Evidence
                                </h4>
                                <div className="text-xs pl-2">
                                  {formatText(student.evidence[0])}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      
                      {parsed.students.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          + {parsed.students.length - 3} more students
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Fallback: Formatted Text Display */
                    <div className="prose prose-sm max-w-none">
                      <div className="text-sm leading-relaxed space-y-2">
                        {formattedResult.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return <div key={idx} className="h-2" />;
                          
                          // Detect section headers
                          if ((trimmed.length < 100 && trimmed === trimmed.toUpperCase() && trimmed.match(/[A-Z]/) && !trimmed.match(/[0-9]/)) ||
                              trimmed.match(/^[A-Z][^:]*:$/) ||
                              trimmed.match(/^(Class Overview|Students|Analysis|Report|Summary|Priority)/i)) {
                            return (
                              <h3 key={idx} className="text-base font-semibold mt-4 mb-2 text-foreground border-b pb-2">
                                {formatText(trimmed.replace(/[:]$/, ''))}
                              </h3>
                            );
                          }
                          
                          // Format bullet points
                          if (trimmed.match(/^[-•*]\s/)) {
                            return (
                              <div key={idx} className="flex items-start gap-2 ml-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="flex-1">{formatText(trimmed.replace(/^[-•*]\s*/, ''))}</span>
                              </div>
                            );
                          }
                          
                          // Format key-value pairs
                          if (trimmed.includes(':') && trimmed.length < 200) {
                            const [key, ...valueParts] = trimmed.split(':');
                            const value = valueParts.join(':').trim();
                            if (key.length < 60 && value) {
                              return (
                                <div key={idx} className="mb-2">
                                  <span className="font-semibold text-foreground">{key}:</span>{' '}
                                  <span>{formatText(value)}</span>
                                </div>
                              );
                            }
                          }
                          
                          return (
                            <p key={idx} className="mb-2 text-foreground">
                              {formatText(trimmed)}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(formattedResult);
                  }}
                >
                  Copy Results
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/insights')}
                >
                  View Full Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })()}

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
