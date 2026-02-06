import { Clock, PlayCircle, CheckCircle, Book, FileText, Video, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { StudyTask } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';

interface StudyPlanTaskProps {
  task: StudyTask;
  onStart: (task: StudyTask) => void;
  onComplete: (taskId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function StudyPlanTask({ task, onStart, onComplete, showActions = true, compact = false }: StudyPlanTaskProps) {
  const getStatusColor = (status: StudyTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 border-emerald-500/30';
      case 'in_progress': return 'bg-primary/10 border-primary/30';
      case 'pending': return 'bg-muted border-border';
      case 'skipped': return 'bg-muted/50 border-border opacity-60';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-3.5 w-3.5" />;
      case 'article': return <FileText className="h-3.5 w-3.5" />;
      case 'practice': return <Book className="h-3.5 w-3.5" />;
      default: return <FileText className="h-3.5 w-3.5" />;
    }
  };

  if (compact) {
    return (
      <div 
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-colors',
          getStatusColor(task.status)
        )}
      >
        <Checkbox 
          checked={task.status === 'completed'}
          onCheckedChange={() => onComplete(task.id)}
          disabled={task.status === 'completed'}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium truncate',
            task.status === 'completed' && 'line-through text-muted-foreground'
          )}>
            {task.microGoal}
          </p>
          <p className="text-xs text-muted-foreground">{task.topic}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {task.estimatedMinutes}m
        </div>
        {task.status !== 'completed' && (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onStart(task)}
          >
            <PlayCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      'transition-all',
      getStatusColor(task.status),
      task.status === 'in_progress' && 'ring-2 ring-primary/20'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox 
            checked={task.status === 'completed'}
            onCheckedChange={() => onComplete(task.id)}
            disabled={task.status === 'completed'}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            {/* Topic Path */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              {task.topicPath.split(' → ').map((part, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  {part}
                  {i < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
                </span>
              ))}
            </div>
            
            {/* Micro Goal */}
            <h4 className={cn(
              'font-medium mb-2',
              task.status === 'completed' && 'line-through text-muted-foreground'
            )}>
              {task.microGoal}
            </h4>

            {/* Meta info */}
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedMinutes} min
              </Badge>
              {task.status === 'completed' && (
                <Badge variant="default" className="bg-emerald-500 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </Badge>
              )}
              {task.status === 'in_progress' && (
                <Badge variant="default" className="gap-1">
                  In Progress
                </Badge>
              )}
            </div>

            {/* Resources */}
            {task.resources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.resources.map((resource) => (
                  <span 
                    key={resource.id}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                  >
                    {getResourceIcon(resource.type)}
                    {resource.title}
                  </span>
                ))}
              </div>
            )}

            {/* Reflection */}
            {task.reflection && (
              <div className="mt-3 p-2 bg-muted/50 rounded text-sm text-muted-foreground italic">
                "{task.reflection}"
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && task.status !== 'completed' && (
            <Button 
              onClick={() => onStart(task)}
              className="gap-2 flex-shrink-0"
            >
              <PlayCircle className="h-4 w-4" />
              {task.status === 'in_progress' ? 'Continue' : 'Start'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
