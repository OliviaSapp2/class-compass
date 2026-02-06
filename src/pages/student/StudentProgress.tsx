import { 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  Clock,
  Target,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function StudentProgress() {
  const { studentProgress, studentGaps, studentProfile } = useApp();

  // Format mastery history for chart
  const masteryChartData = studentProgress.masteryHistory[0]?.history.map(h => ({
    date: h.date.slice(5), // MM-DD format
    mastery: h.mastery,
  })) || [];

  // Calculate improvement
  const firstMastery = masteryChartData[0]?.mastery || 0;
  const lastMastery = masteryChartData[masteryChartData.length - 1]?.mastery || 0;
  const improvement = lastMastery - firstMastery;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          My Progress
        </h1>
        <p className="text-muted-foreground">
          Track your improvement and celebrate your wins!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentProgress.completedTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentProfile.totalStudyMinutes}</p>
              <p className="text-sm text-muted-foreground">Minutes Studied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Target className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentProgress.sessions.length}</p>
              <p className="text-sm text-muted-foreground">Study Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card className={improvement > 0 ? 'bg-emerald-500/5 border-emerald-500/20' : ''}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-lg',
              improvement > 0 ? 'bg-emerald-500/10' : 'bg-muted'
            )}>
              {improvement > 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className={cn(
                'text-2xl font-bold',
                improvement > 0 ? 'text-emerald-600' : 'text-muted-foreground'
              )}>
                {improvement > 0 ? '+' : ''}{improvement}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Improvement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mastery Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mastery Trend</CardTitle>
          <CardDescription>
            Your progress on {studentProgress.masteryHistory[0]?.topic || 'focus topics'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={masteryChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mastery" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Areas Improving */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Areas Improving
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentProgress.areasImproving.length > 0 ? (
              studentProgress.areasImproving.map((area, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div className="p-2 rounded-full bg-emerald-500/10">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="font-medium">{area}</span>
                  <Badge variant="outline" className="ml-auto text-emerald-600 border-emerald-500/30">
                    Improving
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Keep studying to see your improvements!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Still Needs Work */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              Still Needs Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentProgress.stillNeedsWork.map((area, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
              >
                <div className="p-2 rounded-full bg-amber-500/10">
                  <Target className="h-4 w-4 text-amber-500" />
                </div>
                <span className="font-medium">{area}</span>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentProgress.sessions.slice(0, 5).map((session) => (
              <div 
                key={session.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card"
              >
                <div className={cn(
                  'p-2 rounded-full',
                  session.selfAssessment === 'got_it' 
                    ? 'bg-emerald-500/10' 
                    : 'bg-amber-500/10'
                )}>
                  {session.selfAssessment === 'got_it' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Target className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Study Session</p>
                  <p className="text-xs text-muted-foreground">
                    {session.duration} minutes • {session.selfAssessment === 'got_it' ? 'Understood' : 'Needs review'}
                  </p>
                </div>
                {session.reflection && (
                  <p className="text-xs text-muted-foreground italic max-w-xs truncate">
                    "{session.reflection}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement (subtle celebration) */}
      {studentProgress.completedTasks >= 3 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Great Progress! 🎉</h3>
              <p className="text-muted-foreground">
                You've completed {studentProgress.completedTasks} tasks this week. Keep up the momentum!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
