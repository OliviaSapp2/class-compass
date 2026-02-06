import { TutorSessionSummary } from '@/lib/studentMockData';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Plus, 
  Download 
} from 'lucide-react';

interface SessionSummaryCardProps {
  summary: TutorSessionSummary;
  onAddToPlan: () => void;
  onToggleShare: (shared: boolean) => void;
}

export function SessionSummaryCard({ summary, onAddToPlan, onToggleShare }: SessionSummaryCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Session Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Topic */}
        <div>
          <p className="text-sm font-medium">Topic: {summary.topic}</p>
        </div>
        
        {/* What you struggled with */}
        {summary.struggledWith.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              What we noticed:
            </p>
            <div className="flex flex-wrap gap-1">
              {summary.struggledWith.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommended next steps */}
        {summary.recommendedNextSteps.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Recommended next:</p>
            <ul className="text-sm space-y-1">
              {summary.recommendedNextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Share with teacher toggle */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="share-teacher" className="text-sm">
              Share with teacher
            </Label>
          </div>
          <Switch 
            id="share-teacher" 
            checked={summary.sharedWithTeacher}
            onCheckedChange={onToggleShare}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-0">
        <Button size="sm" onClick={onAddToPlan} className="flex-1">
          <Plus className="h-4 w-4 mr-1" />
          Add to Study Plan
        </Button>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
