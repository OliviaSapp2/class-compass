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
import { AnalysisResults } from './AnalysisResults';
import { useEffect, useState } from 'react';

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
    selectedClass,
    analysisResult
  } = useApp();

  const [showResults, setShowResults] = useState(false);
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(false);

  const materialsCount = uploads.filter(u => u.type === 'material').length;
  const studentWorkCount = uploads.filter(u => u.type === 'student_work').length;

  // Track when analysis completes
  useEffect(() => {
    if (!isAnalyzing && analysisResult && hasCompletedAnalysis) {
      setShowResults(true);
    }
  }, [isAnalyzing, analysisResult, hasCompletedAnalysis]);

  // Reset showResults when modal opens/closes
  useEffect(() => {
    if (!open) {
      setShowResults(false);
      setHasCompletedAnalysis(false);
    }
  }, [open]);

  const handleRunAnalysis = async () => {
    setHasCompletedAnalysis(true);
    try {
      await runAnalysis();
      // Don't close modal - show results instead
      setShowResults(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      // On error, still close modal or show error state
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setShowResults(false);
    setHasCompletedAnalysis(false);
    onOpenChange(false);
  };

  // Determine modal size based on state
  const getDialogSize = () => {
    if (showResults && analysisResult) {
      return 'sm:max-w-4xl max-h-[90vh]';
    }
    return 'sm:max-w-md';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={getDialogSize()}>
        <DialogHeader>
          <DialogTitle>
            {showResults && analysisResult 
              ? 'Analysis Complete' 
              : isAnalyzing 
                ? 'Running Analysis...' 
                : 'Run Analysis'}
          </DialogTitle>
          <DialogDescription>
            {showResults && analysisResult
              ? 'Review the analysis results below.'
              : isAnalyzing 
                ? 'Analyzing student performance against curriculum materials.'
                : `Analyze ${selectedClass.name} performance data.`
            }
          </DialogDescription>
        </DialogHeader>

        {showResults && analysisResult ? (
          <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
            <AnalysisResults 
              result={analysisResult} 
              onClose={handleClose}
            />
          </div>
        ) : isAnalyzing ? (
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
          {showResults && analysisResult ? (
            <Button onClick={handleClose}>
              Close
            </Button>
          ) : !isAnalyzing && (
            <>
              <Button variant="outline" onClick={handleClose}>
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
