import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  TrendingUp, 
  BookOpen,
  Copy,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AnalysisResultsProps {
  result: any;
  onClose?: () => void;
}

/**
 * Formats the analysis result for display
 */
function formatAnalysisResult(result: any): string {
  if (typeof result === 'string') {
    return result;
  }
  
  if (result === null || result === undefined) {
    return 'No results available';
  }

  // Check for common Stack AI response formats
  if (result.outputs && Array.isArray(result.outputs)) {
    return result.outputs.map((output: any) => 
      typeof output === 'string' ? output : JSON.stringify(output, null, 2)
    ).join('\n\n');
  }

  if (result.output) {
    return typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2);
  }

  if (result['out-0']) {
    return typeof result['out-0'] === 'string' ? result['out-0'] : JSON.stringify(result['out-0'], null, 2);
  }

  // If it's an object, try to find text content
  if (typeof result === 'object') {
    // Look for common text fields
    const textFields = ['text', 'content', 'message', 'response', 'answer', 'result'];
    for (const field of textFields) {
      if (result[field] && typeof result[field] === 'string') {
        return result[field];
      }
    }
    
    // If no text field found, stringify the whole object
    return JSON.stringify(result, null, 2);
  }

  return String(result);
}

/**
 * Extracts key insights from the result
 */
function extractInsights(result: any): string[] {
  const insights: string[] = [];
  const formatted = formatAnalysisResult(result);
  
  // Simple extraction: look for bullet points, numbered lists, or key phrases
  const lines = formatted.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    const trimmed = line.trim();
    // Check for bullet points or numbered items
    if ((trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || /^\d+[\.\)]/.test(trimmed)) && trimmed.length > 10) {
      insights.push(trimmed.replace(/^[-•*\d+\.\)]\s*/, ''));
    }
  });

  // If no structured insights found, try to extract sentences
  if (insights.length === 0) {
    const sentences = formatted.split(/[.!?]\s+/).filter(s => s.length > 20 && s.length < 200);
    insights.push(...sentences.slice(0, 5));
  }

  return insights.slice(0, 5);
}

export function AnalysisResults({ result, onClose }: AnalysisResultsProps) {
  const formattedResult = formatAnalysisResult(result);
  const insights = extractInsights(result);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResult);
    toast({
      title: "Copied",
      description: "Analysis results copied to clipboard.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-status-success" />
          <h3 className="text-lg font-semibold">Analysis Results</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Key Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                >
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <p className="text-sm flex-1">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Full Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="whitespace-pre-wrap text-sm font-mono">
              {formattedResult}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Raw JSON View (for debugging) */}
      {typeof result === 'object' && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            View Raw JSON
          </summary>
          <Card className="mt-2">
            <CardContent className="pt-4">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </details>
      )}
    </div>
  );
}
