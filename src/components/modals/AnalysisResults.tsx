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
import { formatAnalysisResult, parseAnalysisText } from '@/lib/analysisParser';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  result: any;
  onClose?: () => void;
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
  const parsed = parseAnalysisText(formattedResult);
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
            Analysis Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] max-h-[600px] w-full">
            <div className="prose prose-sm max-w-none pr-4">
              <div className="text-sm leading-relaxed space-y-2">
                {(() => {
                  const lines = formattedResult.split('\n');
                  const processedLines: JSX.Element[] = [];
                  let inTable = false;
                  let tableRows: string[] = [];
                  let tableIdx = 0;

                  const formatText = (text: string) => {
                    const parts = text.split(/(\*\*.*?\*\*)/g);
                    return parts.map((part, pIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={pIdx} className="font-bold text-foreground">
                            {part.replace(/\*\*/g, '')}
                          </strong>
                        );
                      }
                      return <span key={pIdx}>{part}</span>;
                    });
                  };

                  const renderTable = (rows: string[]) => {
                    if (rows.length < 2) return null;
                    
                    const headers = rows[0].split('|').map(h => h.trim()).filter(h => h);
                    const dataRows = rows.slice(2).map(row => 
                      row.split('|').map(cell => cell.trim()).filter((_, i) => i > 0 && i <= headers.length)
                    );

                    return (
                      <div key={`table-${tableIdx++}`} className="my-4 overflow-x-auto">
                        <table className="min-w-full border-collapse border border-border text-xs">
                          <thead>
                            <tr className="bg-muted">
                              {headers.map((header, hIdx) => (
                                <th key={hIdx} className="border border-border px-3 py-2 text-left font-semibold">
                                  {formatText(header)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-border px-3 py-2">
                                    {formatText(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  };

                  for (let idx = 0; idx < lines.length; idx++) {
                    const line = lines[idx];
                    const trimmed = line.trim();
                    
                    // Handle markdown tables
                    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                      if (!inTable) {
                        inTable = true;
                        tableRows = [];
                      }
                      tableRows.push(trimmed);
                      continue;
                    } else if (inTable && trimmed.match(/^[-|:\s]+$/)) {
                      // Table separator row, continue collecting
                      continue;
                    } else if (inTable) {
                      // End of table
                      const tableElement = renderTable(tableRows);
                      if (tableElement) {
                        processedLines.push(tableElement);
                      }
                      inTable = false;
                      tableRows = [];
                    }
                    
                    // Skip empty lines but keep spacing
                    if (!trimmed) {
                      processedLines.push(<div key={idx} className="h-2" />);
                      continue;
                    }
                  
                    // Detect section headers (markdown headers)
                    if (trimmed.startsWith('#')) {
                      const level = trimmed.match(/^#+/)?.[0].length || 1;
                      const text = trimmed.replace(/^#+\s*/, '');
                      const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                      processedLines.push(
                        <HeaderTag key={idx} className={`font-semibold mt-4 mb-2 text-foreground border-b pb-2 ${
                          level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : 'text-base'
                        }`}>
                          {formatText(text)}
                        </HeaderTag>
                      );
                      continue;
                    }
                    
                    // Detect section headers (other patterns)
                    if ((trimmed.length < 100 && trimmed === trimmed.toUpperCase() && trimmed.match(/[A-Z]/) && !trimmed.match(/[0-9]/)) ||
                        trimmed.match(/^[A-Z][^:]*:$/) ||
                        trimmed.match(/^(Class Overview|Students|Analysis|Report|Summary|Priority|Executive Summary|Performance|Remediation)/i)) {
                      processedLines.push(
                        <h3 key={idx} className="text-base font-semibold mt-4 mb-2 text-foreground border-b pb-2">
                          {formatText(trimmed.replace(/[:]$/, ''))}
                        </h3>
                      );
                      continue;
                    }
                    
                    // Format bullet points
                    if (trimmed.match(/^[-•*]\s/)) {
                      processedLines.push(
                        <div key={idx} className="flex items-start gap-2 ml-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="flex-1">{formatText(trimmed.replace(/^[-•*]\s*/, ''))}</span>
                        </div>
                      );
                      continue;
                    }
                    
                    // Format numbered lists
                    if (trimmed.match(/^\d+[\.\)]\s/)) {
                      const match = trimmed.match(/^(\d+)[\.\)]\s*(.+)/);
                      if (match) {
                        processedLines.push(
                          <div key={idx} className="flex items-start gap-2 ml-2">
                            <span className="font-semibold text-primary mt-0.5">{match[1]}.</span>
                            <span className="flex-1">{formatText(match[2])}</span>
                          </div>
                        );
                      }
                      continue;
                    }
                    
                    // Format lines with colons (key-value pairs)
                    if (trimmed.includes(':') && trimmed.length < 200) {
                      const [key, ...valueParts] = trimmed.split(':');
                      const value = valueParts.join(':').trim();
                      if (key.length < 60 && value) {
                        processedLines.push(
                          <div key={idx} className="mb-2">
                            <span className="font-semibold text-foreground">{key}:</span>{' '}
                            <span>{formatText(value)}</span>
                          </div>
                        );
                        continue;
                      }
                    }
                    
                    // Format evidence lines (Q: patterns)
                    if (trimmed.match(/Q\d+:/i)) {
                      processedLines.push(
                        <div key={idx} className="ml-4 mb-2 p-2 bg-muted/50 rounded border-l-2 border-l-primary">
                          {formatText(trimmed)}
                        </div>
                      );
                      continue;
                    }
                    
                    // Regular paragraph
                    processedLines.push(
                      <p key={idx} className="mb-2 text-foreground">
                        {formatText(trimmed)}
                      </p>
                    );
                  }

                  // Render any remaining table
                  if (inTable && tableRows.length > 0) {
                    const tableElement = renderTable(tableRows);
                    if (tableElement) {
                      processedLines.push(tableElement);
                    }
                  }

                  return processedLines;
                })()}
              </div>
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
