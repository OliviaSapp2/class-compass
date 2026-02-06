import { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Share2, 
  RefreshCw,
  ChevronRight,
  GripVertical,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { WeekCalendar } from '@/components/student/WeekCalendar';
import { StudyPlanTask } from '@/components/student/StudyPlanTask';
import { SessionView } from '@/components/student/SessionView';
import { PlanGenerationModal } from '@/components/student/PlanGenerationModal';
import { StudyDay, StudyTask } from '@/lib/studentMockData';
import { format, parseISO } from 'date-fns';

export default function StudentStudyPlan() {
  const { 
    studyPlan, 
    studentGaps,
    generateStudyPlan,
    completeTask,
    toggleShareWithTeacher,
    isGeneratingPlan,
    planGenerationProgress
  } = useApp();
  
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);
  const [activeTask, setActiveTask] = useState<StudyTask | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');

  const handleDaySelect = (day: StudyDay) => {
    setSelectedDay(day);
  };

  const handleTaskStart = (task: StudyTask) => {
    setActiveTask(task);
  };

  // No plan state
  if (!studyPlan) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Study Plan Builder
          </h1>
          <p className="text-muted-foreground">
            Create a personalized study plan to catch up on your learning gaps
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Study Plan Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Let's create a personalized plan based on your {studentGaps.length} learning gaps.
              We'll break it down into small, daily tasks.
            </p>
            <Button size="lg" onClick={() => setShowGenerateModal(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate a Catch-Up Plan
            </Button>
          </CardContent>
        </Card>

        <PlanGenerationModal
          open={showGenerateModal}
          onOpenChange={setShowGenerateModal}
          onGenerate={generateStudyPlan}
          isGenerating={isGeneratingPlan}
          progress={planGenerationProgress}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            My Study Plan
          </h1>
          <p className="text-muted-foreground">
            Created {format(parseISO(studyPlan.generatedAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="share-teacher"
              checked={studyPlan.shareWithTeacher}
              onCheckedChange={toggleShareWithTeacher}
            />
            <Label htmlFor="share-teacher" className="text-sm cursor-pointer">
              Share with teacher
            </Label>
          </div>
          <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Plan Settings Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
              <Clock className="h-3.5 w-3.5" />
              {studyPlan.settings.minutesPerDay} min/day
            </Badge>
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
              <Calendar className="h-3.5 w-3.5" />
              {studyPlan.settings.daysPerWeek} days/week
            </Badge>
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 capitalize">
              Priority: {studyPlan.settings.priority.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 capitalize">
              Pace: {studyPlan.settings.difficulty}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Quick Plan vs Custom */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'quick' | 'custom')}>
        <TabsList>
          <TabsTrigger value="quick">Week View</TabsTrigger>
          <TabsTrigger value="custom">Custom Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6 mt-6">
          {/* Week Calendar */}
          <WeekCalendar
            weeks={studyPlan.weeks}
            currentWeekIndex={currentWeekIndex}
            onWeekChange={setCurrentWeekIndex}
            onDaySelect={handleDaySelect}
            onTaskStart={handleTaskStart}
            selectedDate={selectedDay?.date}
          />

          {/* Day Tasks */}
          {selectedDay ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedDay.dayOfWeek}, {format(parseISO(selectedDay.date), 'MMMM d')}
                    </CardTitle>
                    <CardDescription>
                      {selectedDay.tasks.filter(t => t.status === 'completed').length} of {selectedDay.tasks.length} tasks completed
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedDay.totalMinutes} min total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDay.tasks.map((task) => (
                  <StudyPlanTask
                    key={task.id}
                    task={task}
                    onStart={handleTaskStart}
                    onComplete={completeTask}
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">Select a Day</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a day above to see your tasks
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Plan Builder</CardTitle>
              <CardDescription>
                Select topics from your gaps and reorder them by priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentGaps.slice(0, 4).map((gap, index) => (
                  <div 
                    key={gap.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-grab"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{gap.topic}</p>
                      <p className="text-xs text-muted-foreground">{gap.topicPath}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        gap.masteryEstimate < 50 ? 'text-destructive border-destructive/30' : 
                        'text-amber-600 border-amber-500/30'
                      }
                    >
                      {gap.masteryEstimate}%
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add more topics
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {studentGaps.length} topics selected
                </div>
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Custom Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SessionView
        task={activeTask}
        open={!!activeTask}
        onOpenChange={(open) => !open && setActiveTask(null)}
        onComplete={completeTask}
      />

      <PlanGenerationModal
        open={showGenerateModal}
        onOpenChange={setShowGenerateModal}
        onGenerate={generateStudyPlan}
        isGenerating={isGeneratingPlan}
        progress={planGenerationProgress}
      />
    </div>
  );
}
