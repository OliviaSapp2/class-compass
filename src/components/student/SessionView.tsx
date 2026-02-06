import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Clock, CheckCircle, HelpCircle, Lightbulb, Play, Pause } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { StudyTask, PracticeQuestion } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';

interface SessionViewProps {
  task: StudyTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (taskId: string, reflection?: string) => void;
}

type SessionStep = 'intro' | 'resources' | 'practice' | 'self-check' | 'reflection';

export function SessionView({ task, open, onOpenChange, onComplete }: SessionViewProps) {
  const [currentStep, setCurrentStep] = useState<SessionStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<'got_it' | 'unsure' | null>(null);
  const [reflection, setReflection] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  if (!task) return null;

  const steps: SessionStep[] = ['intro', 'resources', 'practice', 'self-check', 'reflection'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 'practice' && currentQuestionIndex < task.practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex]);
        setShowAnswer(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep === 'practice' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(false);
    } else {
      const prevIndex = currentStepIndex - 1;
      if (prevIndex >= 0) {
        setCurrentStep(steps[prevIndex]);
      }
    }
  };

  const handleComplete = () => {
    onComplete(task.id, reflection || undefined);
    // Reset state
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setSelfAssessment(null);
    setReflection('');
    onOpenChange(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = task.practiceQuestions[currentQuestionIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">{task.topic}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedMinutes} min
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{task.microGoal}</p>
          <Progress value={progress} className="mt-3" />
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Let's Get Started!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  In this session, you'll focus on: <strong>{task.microGoal}</strong>
                </p>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">What you'll do:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Review key concepts and resources
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Practice with {task.practiceQuestions.length} question{task.practiceQuestions.length !== 1 ? 's' : ''}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Self-assess your understanding
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resources Step */}
          {currentStep === 'resources' && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Study Materials</h3>
              <div className="space-y-3">
                {task.resources.map((resource) => (
                  <Card key={resource.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {resource.type === 'video' ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <Lightbulb className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.type} • {resource.estimatedMinutes} min
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Take your time reviewing these materials before moving to practice.
              </p>
            </div>
          )}

          {/* Practice Step */}
          {currentStep === 'practice' && currentQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Practice Question</h3>
                <Badge variant="secondary">
                  {currentQuestionIndex + 1} of {task.practiceQuestions.length}
                </Badge>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <p className="text-lg mb-4">{currentQuestion.question}</p>
                  
                  {currentQuestion.hint && !showAnswer && (
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg mb-4">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-700">{currentQuestion.hint}</p>
                    </div>
                  )}
                  
                  {showAnswer ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="font-semibold text-emerald-700 mb-1">Answer:</p>
                        <p>{currentQuestion.answer}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-medium mb-1">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAnswer(true)}
                    >
                      Show Answer
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Self-Check Step */}
          {currentStep === 'self-check' && (
            <div className="space-y-4 text-center py-8">
              <h3 className="text-xl font-semibold mb-4">How do you feel about this topic?</h3>
              <div className="flex justify-center gap-4">
                <Button
                  variant={selfAssessment === 'got_it' ? 'default' : 'outline'}
                  size="lg"
                  className="flex-col h-auto py-6 px-8 gap-2"
                  onClick={() => setSelfAssessment('got_it')}
                >
                  <CheckCircle className={cn(
                    'h-8 w-8',
                    selfAssessment === 'got_it' ? 'text-primary-foreground' : 'text-emerald-500'
                  )} />
                  <span>I get it!</span>
                </Button>
                <Button
                  variant={selfAssessment === 'unsure' ? 'default' : 'outline'}
                  size="lg"
                  className="flex-col h-auto py-6 px-8 gap-2"
                  onClick={() => setSelfAssessment('unsure')}
                >
                  <HelpCircle className={cn(
                    'h-8 w-8',
                    selfAssessment === 'unsure' ? 'text-primary-foreground' : 'text-amber-500'
                  )} />
                  <span>I'm unsure</span>
                </Button>
              </div>
              {selfAssessment === 'unsure' && (
                <p className="text-sm text-muted-foreground mt-4">
                  That's okay! We'll add more practice on this topic to your plan.
                </p>
              )}
            </div>
          )}

          {/* Reflection Step */}
          {currentStep === 'reflection' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-center mb-4">Quick Reflection</h3>
              <Textarea
                placeholder="What felt hardest? What clicked for you? (Optional)"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground text-center">
                Reflecting helps reinforce what you learned!
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div 
                key={step}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i === currentStepIndex ? 'bg-primary' : 
                  i < currentStepIndex ? 'bg-primary/50' : 'bg-muted'
                )}
              />
            ))}
          </div>

          {currentStep === 'reflection' ? (
            <Button onClick={handleComplete}>
              Complete Session
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentStep === 'self-check' && !selfAssessment ? 'Skip' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
