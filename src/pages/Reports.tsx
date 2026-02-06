import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Report {
  id: string;
  studentName: string;
  studentId: string;
  type: 'individual' | 'class';
  generatedAt: string;
  status: 'ready' | 'generating';
}

export default function Reports() {
  const { students, selectedClass } = useApp();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  // Mock reports
  const [reports, setReports] = useState<Report[]>([
    { id: '1', studentName: 'Liam Chen', studentId: '4', type: 'individual', generatedAt: '2024-01-15T10:30:00Z', status: 'ready' },
    { id: '2', studentName: 'Ava Johnson', studentId: '7', type: 'individual', generatedAt: '2024-01-15T10:30:00Z', status: 'ready' },
    { id: '3', studentName: 'Class Summary', studentId: '', type: 'class', generatedAt: '2024-01-15T10:30:00Z', status: 'ready' },
  ]);

  const handleGenerateReport = async (studentId: string, studentName: string) => {
    setGeneratingReport(studentId);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: Report = {
      id: Date.now().toString(),
      studentName,
      studentId,
      type: 'individual',
      generatedAt: new Date().toISOString(),
      status: 'ready',
    };
    
    setReports(prev => [newReport, ...prev]);
    setGeneratingReport(null);
    
    toast({
      title: "Report Generated",
      description: `Performance report for ${studentName} is ready to download.`,
    });
  };

  const handleDownload = (format: 'pdf' | 'csv', reportId: string) => {
    toast({
      title: "Download Started",
      description: `Your ${format.toUpperCase()} file will download shortly.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and export student performance reports
          </p>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">PDF Report</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Formatted report with charts, insights, and recommendations. Best for sharing with parents.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 gap-2"
                  onClick={() => handleDownload('pdf', 'class')}
                >
                  <Download className="h-4 w-4" />
                  Download Class Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <FileSpreadsheet className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">CSV Export</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Raw data export with all mastery scores and metrics. Best for further analysis.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 gap-2"
                  onClick={() => handleDownload('csv', 'class')}
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Individual Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Individual Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map(student => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium
                    ${student.riskLevel === 'high' ? 'bg-risk-high-bg text-risk-high' : ''}
                    ${student.riskLevel === 'medium' ? 'bg-risk-medium-bg text-risk-medium' : ''}
                    ${student.riskLevel === 'low' ? 'bg-risk-low-bg text-risk-low' : ''}
                  `}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium text-sm">{student.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={generatingReport === student.id}
                  onClick={() => handleGenerateReport(student.id, student.name)}
                >
                  {generatingReport === student.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No reports generated yet</p>
              <p className="text-sm mt-1">Generate a report to see it here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{report.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {report.type === 'class' ? 'Class Report' : 'Individual'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {report.status === 'ready' ? (
                        <Badge className="badge-status-success gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge className="badge-status-processing gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={report.status !== 'ready'}
                          onClick={() => handleDownload('pdf', report.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={report.status !== 'ready'}
                          onClick={() => handleDownload('csv', report.id)}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
