import { X, FileText, CheckCircle, HelpCircle, Lightbulb, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gap, Evidence } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface EvidenceDrawerProps {
  gap: Gap | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToPlan: (gapId: string) => void;
  onAskForHelp: (gap: Gap) => void;
}

export function EvidenceDrawer({ gap, open, onOpenChange, onAddToPlan, onAskForHelp }: EvidenceDrawerProps) {
  if (!gap) return null;

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'quiz': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'homework': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'test': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'classwork': return <FileText className="h-4 w-4 text-green-500" />;
    }
  };

  const getEvidenceColor = (type: Evidence['type']) => {
    switch (type) {
      case 'quiz': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'homework': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'test': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'classwork': return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 70) return 'text-emerald-600';
    if (mastery >= 50) return 'text-amber-600';
    return 'text-destructive';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">{gap.topic}</SheetTitle>
          <SheetDescription className="text-sm">
            {gap.subject} → {gap.unit}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          {/* Mastery Overview */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Mastery</span>
              <span className={cn('text-2xl font-bold', getMasteryColor(gap.masteryEstimate))}>
                {gap.masteryEstimate}%
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all',
                  gap.masteryEstimate >= 70 ? 'bg-emerald-500' :
                  gap.masteryEstimate >= 50 ? 'bg-amber-500' : 'bg-destructive'
                )}
                style={{ width: `${gap.masteryEstimate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Confidence: {gap.confidence}
            </p>
          </div>

          {/* Evidence Section */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Why We Think This
            </h3>
            <div className="space-y-3">
              {gap.evidence.map((evidence) => (
                <div 
                  key={evidence.id}
                  className="bg-card border rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    {getEvidenceIcon(evidence.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{evidence.name}</span>
                        <Badge variant="outline" className={cn('text-xs', getEvidenceColor(evidence.type))}>
                          {evidence.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{evidence.detail}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{format(new Date(evidence.date), 'MMM d, yyyy')}</span>
                        {evidence.score && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{evidence.score}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Common Misconceptions */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              Common Misconceptions
            </h3>
            <ul className="space-y-2">
              {gap.commonMisconceptions.map((misconception, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-destructive mt-0.5">•</span>
                  {misconception}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Next Steps */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Recommended Next Steps
            </h3>
            <ul className="space-y-2">
              {gap.recommendedNextSteps.map((step, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onAskForHelp(gap)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Ask for Help
          </Button>
          <Button 
            className="flex-1"
            onClick={() => {
              onAddToPlan(gap.id);
              onOpenChange(false);
            }}
          >
            Add to Study Plan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
