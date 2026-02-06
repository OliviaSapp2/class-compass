import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { FileText, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisModal({ open, onOpenChange }: AnalysisModalProps) {
  const { 
    isAnalyzing, 
    analysisProgress, 
    runAnalysis, 
    uploads, 
    students,
    selectedClass 
  } = useApp();

  const materialsCount = uploads.filter(u => u.type === 'material').length;
  const studentWorkCount = uploads.filter(u => u.type === 'student_work').length;

  const handleRunAnalysis = async () => {
    try {
      await runAnalysis();
      toast({
        title: 'Analysis Complete',
        description: 'Class analysis has been completed successfully.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to run analysis',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAnalyzing ? 'Running Analysis...' : 'Run Analysis'}
          </DialogTitle>
          <DialogDescription>
            {isAnalyzing 
              ? 'Analyzing student performance against curriculum materials.'
              : `Analyze ${selectedClass.name} performance data.`
            }
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="py-6 space-y-4">
            <Progress value={analysisProgress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {analysisProgress < 30 && 'Processing materials...'}
                {analysisProgress >= 30 && analysisProgress < 60 && 'Analyzing student work...'}
                {analysisProgress >= 60 && analysisProgress < 90 && 'Generating insights...'}
                {analysisProgress >= 90 && 'Finalizing report...'}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h4 className="text-sm font-medium">What will be analyzed:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{materialsCount} class materials</span>
                  <CheckCircle2 className="h-4 w-4 text-status-success ml-auto" />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{studentWorkCount} student work uploads</span>
                  <CheckCircle2 className="h-4 w-4 text-status-success ml-auto" />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{students.length} students</span>
                  <CheckCircle2 className="h-4 w-4 text-status-success ml-auto" />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Analysis typically takes 1-2 minutes depending on the amount of data.
            </p>
          </div>
        )}

        <DialogFooter>
          {!isAnalyzing && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleRunAnalysis}>
                Start Analysis
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
