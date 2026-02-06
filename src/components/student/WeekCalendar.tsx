import { ChevronLeft, ChevronRight, CheckCircle, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudyWeek, StudyDay, StudyTask } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';
import { format, parseISO, isToday, isBefore, isAfter } from 'date-fns';

interface WeekCalendarProps {
  weeks: StudyWeek[];
  currentWeekIndex: number;
  onWeekChange: (index: number) => void;
  onDaySelect: (day: StudyDay) => void;
  onTaskStart: (task: StudyTask) => void;
  selectedDate?: string;
}

export function WeekCalendar({ 
  weeks, 
  currentWeekIndex, 
  onWeekChange, 
  onDaySelect,
  onTaskStart,
  selectedDate 
}: WeekCalendarProps) {
  const currentWeek = weeks[currentWeekIndex];
  
  if (!currentWeek) return null;

  const getDayStatus = (day: StudyDay) => {
    const dayDate = parseISO(day.date);
    const completedTasks = day.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = day.tasks.length;
    
    if (day.isCompleted) return 'completed';
    if (isToday(dayDate)) return 'today';
    if (isBefore(dayDate, new Date()) && completedTasks < totalTasks) return 'missed';
    if (isAfter(dayDate, new Date())) return 'upcoming';
    return 'partial';
  };

  const getDayStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20';
      case 'today':
        return 'bg-primary/10 border-primary ring-2 ring-primary/20';
      case 'missed':
        return 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20';
      case 'upcoming':
        return 'bg-muted/50 border-border hover:bg-muted';
      default:
        return 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Week {currentWeek.weekNumber}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onWeekChange(currentWeekIndex - 1)}
              disabled={currentWeekIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {format(parseISO(currentWeek.startDate), 'MMM d')} - {format(parseISO(currentWeek.endDate), 'MMM d')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onWeekChange(currentWeekIndex + 1)}
              disabled={currentWeekIndex === weeks.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Focus:</span>
          {currentWeek.focusTopics.map((topic, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {currentWeek.days.map((day) => {
            const status = getDayStatus(day);
            const completedTasks = day.tasks.filter(t => t.status === 'completed').length;
            const isSelected = selectedDate === day.date;
            
            return (
              <button
                key={day.date}
                onClick={() => onDaySelect(day)}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  getDayStyles(status),
                  isSelected && 'ring-2 ring-primary'
                )}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {day.dayOfWeek}
                </div>
                <div className="text-lg font-semibold mb-2">
                  {format(parseISO(day.date), 'd')}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  {day.totalMinutes}m
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {day.isCompleted ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600">Done</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      {completedTasks}/{day.tasks.length} tasks
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
