import { AlertTriangle, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gap } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  gap: Gap;
  onViewDetails: (gap: Gap) => void;
  onAddToPlan: (gapId: string) => void;
  showAddToPlan?: boolean;
}

export function TopicCard({ gap, onViewDetails, onAddToPlan, showAddToPlan = true }: TopicCardProps) {
  const getRiskColor = (level: Gap['riskLevel']) => {
    switch (level) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'low': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    }
  };

  const getConfidenceBadge = (confidence: Gap['confidence']) => {
    switch (confidence) {
      case 'high': return { label: 'High confidence', variant: 'default' as const };
      case 'medium': return { label: 'Medium confidence', variant: 'secondary' as const };
      case 'low': return { label: 'Low confidence', variant: 'outline' as const };
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 70) return 'bg-emerald-500';
    if (mastery >= 50) return 'bg-amber-500';
    return 'bg-destructive';
  };

  const confidenceBadge = getConfidenceBadge(gap.confidence);

  return (
    <Card className={cn(
      'border transition-all hover:shadow-md cursor-pointer group',
      gap.isNewlyIdentified && 'ring-2 ring-primary/20'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Topic Path */}
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <span>{gap.subject}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{gap.unit}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">{gap.topic}</span>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className={getRiskColor(gap.riskLevel)}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {gap.riskLevel} risk
              </Badge>
              <Badge variant={confidenceBadge.variant}>
                {confidenceBadge.label}
              </Badge>
              {gap.isNewlyIdentified && (
                <Badge variant="default" className="bg-primary">
                  New
                </Badge>
              )}
            </div>

            {/* Mastery Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mastery</span>
                <span className="font-semibold">{gap.masteryEstimate}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn('h-full rounded-full transition-all', getMasteryColor(gap.masteryEstimate))}
                  style={{ width: `${gap.masteryEstimate}%` }}
                />
              </div>
            </div>

            {/* Evidence Preview */}
            <p className="mt-3 text-sm text-muted-foreground line-clamp-1">
              Based on {gap.evidence.length} piece{gap.evidence.length !== 1 ? 's' : ''} of evidence
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(gap);
              }}
            >
              Details
              <ChevronRight className="h-4 w-4" />
            </Button>
            {showAddToPlan && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToPlan(gap.id);
                }}
              >
                <Plus className="h-4 w-4" />
                Add to plan
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
