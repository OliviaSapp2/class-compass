import { useState } from 'react';
import { 
  PlayCircle, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Target,
  BookOpen,
  Flame,
  ChevronRight,
  Plus,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { getNextTask, getTopGaps } from '@/lib/studentMockData';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { SessionView } from '@/components/student/SessionView';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
  const { 
    studentProfile, 
    studentGaps, 
    studyPlan, 
    studentProgress, 
    upcomingAssessments,
    completeTask,
    addGapToPlan
  } = useApp();
  const navigate = useNavigate();
  const [activeTask, setActiveTask] = useState<any>(null);

  const nextTask = studyPlan ? getNextTask(studyPlan) : null;
  const topGaps = getTopGaps(studentGaps, 3);

  // Calculate weekly study data for chart
  const weeklyData = studentProgress.weeklyStudyMinutes;
  const maxMinutes = Math.max(...weeklyData.map(w => w.minutes));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome back, {studentProfile.name.split(' ')[0]}! 👋</h1>
        <p className="text-muted-foreground">
          You're close—let's tighten up fractions this week.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentProfile.streakDays}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Clock className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentProfile.totalStudyMinutes}</p>
              <p className="text-sm text-muted-foreground">Minutes This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Target className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentProgress.completedTasks}/{studentProgress.totalTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Complete</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <TrendingUp className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentGaps.length}</p>
              <p className="text-sm text-muted-foreground">Topics to Improve</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Focus */}
          {nextTask && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    Today's Focus
                  </CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {nextTask.estimatedMinutes} min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium mb-1">{nextTask.microGoal}</p>
                    <p className="text-sm text-muted-foreground">{nextTask.topicPath}</p>
                  </div>
                  <Button onClick={() => setActiveTask(nextTask)}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 3 Topics to Improve */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Topics to Improve</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student/gaps')}>
                  See all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {topGaps.map((gap) => (
                <div 
                  key={gap.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{gap.topic}</p>
                    <p className="text-xs text-muted-foreground">{gap.subject} → {gap.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={cn(
                        'font-semibold text-sm',
                        gap.masteryEstimate < 50 ? 'text-destructive' : 'text-amber-600'
                      )}>
                        {gap.masteryEstimate}%
                      </p>
                      <p className="text-xs text-muted-foreground">mastery</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addGapToPlan(gap.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to plan
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Study Time Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Weekly Study Time</CardTitle>
              <CardDescription>Your study minutes over the past 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-2">
                {weeklyData.map((week, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/20 rounded-t-sm relative group"
                      style={{ height: `${(week.minutes / maxMinutes) * 100}%`, minHeight: '8px' }}
                    >
                      <div 
                        className="absolute inset-0 bg-primary rounded-t-sm transition-all"
                        style={{ height: '100%' }}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                        {week.minutes}m
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{week.week.replace('Week ', 'W')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Assessments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Upcoming Assessments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAssessments.slice(0, 3).map((assessment) => (
                <div key={assessment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{assessment.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assessment.topics.slice(0, 2).join(', ')}
                      {assessment.topics.length > 2 && ` +${assessment.topics.length - 2} more`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {format(new Date(assessment.date), 'MMM d')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Messages/Notes Placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new messages</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/gaps')}
              >
                <Target className="h-4 w-4 mr-2" />
                View my gaps
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/study-plan')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My study plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/progress')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Track progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <SessionView
        task={activeTask}
        open={!!activeTask}
        onOpenChange={(open) => !open && setActiveTask(null)}
        onComplete={completeTask}
      />
    </div>
  );
}
