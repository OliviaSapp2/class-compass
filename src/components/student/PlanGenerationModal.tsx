import { useState } from 'react';
import { Loader2, CheckCircle, Sparkles, Calendar, Clock, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { StudyPlan } from '@/lib/studentMockData';

interface PlanGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (settings: StudyPlan['settings']) => Promise<void>;
  isGenerating: boolean;
  progress: number;
}

export function PlanGenerationModal({ 
  open, 
  onOpenChange, 
  onGenerate,
  isGenerating,
  progress 
}: PlanGenerationModalProps) {
  const [minutesPerDay, setMinutesPerDay] = useState(30);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [priority, setPriority] = useState<'grades' | 'mastery' | 'upcoming_test'>('mastery');
  const [difficulty, setDifficulty] = useState<'gentle' | 'normal' | 'intensive'>('normal');

  const handleGenerate = async () => {
    await onGenerate({
      minutesPerDay,
      daysPerWeek,
      priority,
      difficulty,
    });
  };

  if (isGenerating) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Creating Your Plan...</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Analyzing your gaps and building a personalized study schedule
            </p>
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Study Plan
          </DialogTitle>
          <DialogDescription>
            Tell us about your schedule and we'll create a personalized plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Time per day */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Time per day
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <Button
                  key={mins}
                  variant={minutesPerDay === mins ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMinutesPerDay(mins)}
                >
                  {mins} min
                </Button>
              ))}
            </div>
          </div>

          {/* Days per week */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Days per week
            </Label>
            <Select value={daysPerWeek.toString()} onValueChange={(v) => setDaysPerWeek(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} days per week
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              What's your priority?
            </Label>
            <RadioGroup value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mastery" id="mastery" />
                <Label htmlFor="mastery" className="font-normal cursor-pointer">
                  Deep understanding (recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grades" id="grades" />
                <Label htmlFor="grades" className="font-normal cursor-pointer">
                  Improve grades quickly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upcoming_test" id="upcoming_test" />
                <Label htmlFor="upcoming_test" className="font-normal cursor-pointer">
                  Prepare for upcoming test
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <Label>Pace</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['gentle', 'normal', 'intensive'] as const).map((d) => (
                <Button
                  key={d}
                  variant={difficulty === d ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(d)}
                  className="capitalize"
                >
                  {d}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {difficulty === 'gentle' && 'More time per topic, slower pace'}
              {difficulty === 'normal' && 'Balanced approach for steady progress'}
              {difficulty === 'intensive' && 'Faster pace, more practice per day'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
