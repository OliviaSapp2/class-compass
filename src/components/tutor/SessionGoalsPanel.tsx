import { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, AlertCircle, HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TutorPracticeQuestion } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';

interface SessionGoalsPanelProps {
  topic: string;
  topicPath: string;
  misconceptions: string[];
  practiceQuestions?: TutorPracticeQuestion[];
}

export function SessionGoalsPanel({ 
  topic, 
  topicPath, 
  misconceptions, 
  practiceQuestions 
}: SessionGoalsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div 
      className={cn(
        'border-l border-border bg-card transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-12' : 'w-80'
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="self-start m-2"
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Panel Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Session Goals */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Session Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Understand the core concept</li>
                <li>• Identify your misconception</li>
                <li>• Practice with guided examples</li>
              </ul>
            </CardContent>
          </Card>

          {/* Current Topic */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Working On
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-sm">{topic}</p>
              <p className="text-xs text-muted-foreground mt-1">{topicPath}</p>
            </CardContent>
          </Card>

          {/* Common Mistakes Detected */}
          {misconceptions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Common Mistakes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {misconceptions.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {m}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Practice */}
          {practiceQuestions && practiceQuestions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Quick Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {practiceQuestions.slice(0, 2).map((q, i) => (
                  <div key={i} className="p-2 bg-muted rounded-lg">
                    <p className="text-xs font-medium">{q.question}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
