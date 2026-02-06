import { useState } from 'react';
import { 
  BarChart3, 
  Filter,
  Users,
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { mockClassInsights } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { formatAnalysisResult, parseAnalysisText } from '@/lib/analysisParser';
import { mapAnalysisToClassInsights } from '@/lib/analysisMapper';
import { useMemo } from 'react';

export default function ClassInsights() {
  const { students, analysisResult } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  // Get insights from analysis or fallback to mock data
  const insights = useMemo(() => {
    if (!analysisResult) {
      return mockClassInsights;
    }
    
    try {
      const formattedResult = formatAnalysisResult(analysisResult);
      const parsed = parseAnalysisText(formattedResult);
      const analysisInsights = mapAnalysisToClassInsights(parsed, students.length);
      
      // Use analysis insights if available, otherwise fallback to mock
      return analysisInsights.length > 0 ? analysisInsights : mockClassInsights;
    } catch (error) {
      console.error('Error mapping analysis to insights:', error);
      return mockClassInsights;
    }
  }, [analysisResult, students.length]);

  const filteredInsights = selectedUnit === 'all' 
    ? insights 
    : insights.filter(i => i.unit === selectedUnit);

  const units = [...new Set(insights.map(i => i.unit))];

  const getMasteryColor = (score: number) => {
    if (score >= 80) return 'bg-risk-low';
    if (score >= 60) return 'bg-risk-medium';
    return 'bg-risk-high';
  };

  const getMasteryTextColor = (score: number) => {
    if (score >= 80) return 'text-risk-low';
    if (score >= 60) return 'text-risk-medium';
    return 'text-risk-high';
  };

  // Sort by mastery score (lowest first = most concerning)
  const sortedInsights = [...filteredInsights].sort((a, b) => a.avgMastery - b.avgMastery);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Class Insights</h1>
          <p className="text-muted-foreground">
            Topic mastery analysis across your class
            {analysisResult && (
              <Badge variant="secondary" className="ml-2">
                From Latest Analysis
              </Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              {units.map(unit => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Topics Below 70%</p>
                <p className="text-3xl font-bold text-risk-high">
                  {sortedInsights.filter(i => i.avgMastery < 70).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-risk-high-bg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-risk-high" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Class Mastery</p>
                <p className="text-3xl font-bold">
                  {Math.round(sortedInsights.reduce((acc, i) => acc + i.avgMastery, 0) / sortedInsights.length)}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Struggling</p>
                <p className="text-3xl font-bold text-risk-medium">
                  {students.filter(s => s.riskLevel !== 'low').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-risk-medium-bg flex items-center justify-center">
                <Users className="h-6 w-6 text-risk-medium" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Mastery Heatmap/List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-status-warning" />
            Most Common Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedInsights.map((insight, index) => (
              <div 
                key={insight.topic}
                className="p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {insight.subject}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline" className="text-xs">
                        {insight.unit}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{insight.topic}</h3>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-2xl font-bold", getMasteryTextColor(insight.avgMastery))}>
                      {insight.avgMastery}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Mastery</p>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="mb-3">
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", getMasteryColor(insight.avgMastery))}
                      style={{ width: `${insight.avgMastery}%` }}
                    />
                  </div>
                </div>

                {/* Students Affected */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{insight.studentsAffected}</span>
                      <span className="text-muted-foreground"> of {insight.totalStudents} students affected</span>
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(5, insight.studentsAffected) }).map((_, i) => (
                      <div 
                        key={i}
                        className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {insight.studentsAffected > 5 && (
                      <div className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        +{insight.studentsAffected - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Mastery Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedInsights.map((insight) => (
              <div
                key={insight.topic}
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  insight.avgMastery < 60 && "bg-risk-high-bg/30 border-risk-high/30",
                  insight.avgMastery >= 60 && insight.avgMastery < 75 && "bg-risk-medium-bg/30 border-risk-medium/30",
                  insight.avgMastery >= 75 && "bg-risk-low-bg/30 border-risk-low/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{insight.unit}</span>
                  <span className={cn("text-lg font-bold", getMasteryTextColor(insight.avgMastery))}>
                    {insight.avgMastery}%
                  </span>
                </div>
                <p className="font-medium text-sm">{insight.topic}</p>
                <div className="mastery-bar mt-2">
                  <div 
                    className={cn("mastery-fill", getMasteryColor(insight.avgMastery))}
                    style={{ width: `${insight.avgMastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
