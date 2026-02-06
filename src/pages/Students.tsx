import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Student } from '@/lib/mockData';
import { formatAnalysisResult, parseAnalysisText } from '@/lib/analysisParser';
import { mapAnalysisToStudents } from '@/lib/analysisMapper';
import { useMemo } from 'react';

export default function Students() {
  const navigate = useNavigate();
  const { students: baseStudents, analysisResult } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string[]>([]);

  // Map analysis results to students
  const students = useMemo(() => {
    if (!analysisResult) {
      return baseStudents;
    }
    
    try {
      const formattedResult = formatAnalysisResult(analysisResult);
      const parsed = parseAnalysisText(formattedResult);
      return mapAnalysisToStudents(parsed, baseStudents);
    } catch (error) {
      console.error('Error mapping analysis to students:', error);
      return baseStudents;
    }
  }, [analysisResult, baseStudents]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter.length === 0 || riskFilter.includes(student.riskLevel);
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk: Student['riskLevel']) => {
    switch (risk) {
      case 'low':
        return <Badge className="badge-risk-low">Low Risk</Badge>;
      case 'medium':
        return <Badge className="badge-risk-medium">Medium Risk</Badge>;
      case 'high':
        return <Badge className="badge-risk-high">High Risk</Badge>;
    }
  };

  const getTrendIcon = (trend: Student['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-status-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-status-error" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const riskCounts = {
    low: students.filter(s => s.riskLevel === 'low').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    high: students.filter(s => s.riskLevel === 'high').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-muted-foreground">
            View and manage student performance data
            {analysisResult && (
              <Badge variant="secondary" className="ml-2">
                Analysis Active
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className={cn(
            "cursor-pointer transition-colors",
            riskFilter.includes('high') && "border-risk-high"
          )}
          onClick={() => setRiskFilter(prev => 
            prev.includes('high') ? prev.filter(r => r !== 'high') : [...prev, 'high']
          )}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-3xl font-bold text-risk-high">{riskCounts.high}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-risk-high-bg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-risk-high" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-colors",
            riskFilter.includes('medium') && "border-risk-medium"
          )}
          onClick={() => setRiskFilter(prev => 
            prev.includes('medium') ? prev.filter(r => r !== 'medium') : [...prev, 'medium']
          )}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
                <p className="text-3xl font-bold text-risk-medium">{riskCounts.medium}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-risk-medium-bg flex items-center justify-center">
                <Minus className="h-6 w-6 text-risk-medium" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-colors",
            riskFilter.includes('low') && "border-risk-low"
          )}
          onClick={() => setRiskFilter(prev => 
            prev.includes('low') ? prev.filter(r => r !== 'low') : [...prev, 'low']
          )}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
                <p className="text-3xl font-bold text-risk-low">{riskCounts.low}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-risk-low-bg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-risk-low" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {riskFilter.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setRiskFilter([])}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead>Last Analyzed</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow 
                  key={student.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                        student.riskLevel === 'high' && "bg-risk-high-bg text-risk-high",
                        student.riskLevel === 'medium' && "bg-risk-medium-bg text-risk-medium",
                        student.riskLevel === 'low' && "bg-risk-low-bg text-risk-low"
                      )}>
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(student.riskLevel)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="mastery-bar w-24">
                        <div 
                          className={cn(
                            "mastery-fill",
                            student.overallScore >= 80 && "bg-risk-low",
                            student.overallScore >= 60 && student.overallScore < 80 && "bg-risk-medium",
                            student.overallScore < 60 && "bg-risk-high"
                          )}
                          style={{ width: `${student.overallScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{student.overallScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(student.trend)}
                      <span className="text-sm capitalize">{student.trend}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.lastSubmission 
                      ? formatDistanceToNow(new Date(student.lastSubmission), { addSuffix: true })
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.lastAnalyzedAt 
                      ? formatDistanceToNow(new Date(student.lastAnalyzedAt), { addSuffix: true })
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No students match your search criteria</p>
        </div>
      )}
    </div>
  );
}
