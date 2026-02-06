import { useState } from 'react';
import { TutorPracticeQuestion } from '@/lib/studentMockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeQuestionCardProps {
  question: TutorPracticeQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export function PracticeQuestionCard({ question, onAnswer }: PracticeQuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === question.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 2000);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className="bg-muted/50 border-dashed">
      <CardContent className="p-4 space-y-4">
        <p className="font-medium">{question.question}</p>
        
        {question.options && (
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option, i) => (
              <Button
                key={i}
                variant={selectedAnswer === option 
                  ? (isCorrect ? 'default' : 'destructive') 
                  : 'outline'}
                className={cn(
                  'justify-start h-auto py-3 px-4',
                  showResult && option === question.correctAnswer && 'border-2 border-primary'
                )}
                onClick={() => handleSelect(option)}
                disabled={showResult}
              >
                {showResult && option === question.correctAnswer && (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                )}
                {showResult && selectedAnswer === option && !isCorrect && (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                <span>{option}</span>
              </Button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={cn(
            'p-3 rounded-lg flex items-start gap-2',
            isCorrect ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
          )}>
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : (
              <Lightbulb className="h-5 w-5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium text-sm">
                {isCorrect ? 'Correct!' : 'Not quite...'}
              </p>
              <p className="text-sm mt-1 text-foreground/80">
                {question.explanation}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
