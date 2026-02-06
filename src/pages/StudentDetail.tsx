import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileDown,
  BookOpen,
  Target,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { mockTopicInsights } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students } = useApp();

  const student = students.find(s => s.id === id);
  const insights = mockTopicInsights.filter(i => i.studentId === id);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Student not found</p>
        <Button variant="ghost" onClick={() => navigate('/students')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTrendIcon = (trend: typeof student.trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-status-success" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-status-error" />;
      case 'stable':
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getMasteryColor = (score: number) => {
    if (score >= 80) return 'bg-risk-low';
    if (score >= 60) return 'bg-risk-medium';
    return 'bg-risk-high';
  };

  const getConfidenceBadge = (confidence: 'low' | 'medium' | 'high') => {
    switch (confidence) {
      case 'high':
        return <Badge variant="secondary">High confidence</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium confidence</Badge>;
      case 'low':
        return <Badge variant="outline">Low confidence</Badge>;
    }
  };

  // Group insights by subject > unit > topic
  const groupedInsights = insights.reduce((acc, insight) => {
    const key = `${insight.subject}`;
    if (!acc[key]) {
      acc[key] = {};
    }
    if (!acc[key][insight.unit]) {
      acc[key][insight.unit] = [];
    }
    acc[key][insight.unit].push(insight);
    return acc;
  }, {} as Record<string, Record<string, typeof insights>>);

  // Get strengths (high mastery topics) - mock data
  const strengths = [
    { topic: 'Adding Fractions (Like Denominators)', score: 92 },
    { topic: 'Understanding Fraction Notation', score: 88 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/students')} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold",
                  student.riskLevel === 'high' && "bg-risk-high-bg text-risk-high",
                  student.riskLevel === 'medium' && "bg-risk-medium-bg text-risk-medium",
                  student.riskLevel === 'low' && "bg-risk-low-bg text-risk-low"
                )}>
                  {getInitials(student.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{student.name}</h1>
                    <Badge className={cn(
                      student.riskLevel === 'high' && "badge-risk-high",
                      student.riskLevel === 'medium' && "badge-risk-medium",
                      student.riskLevel === 'low' && "badge-risk-low"
                    )}>
                      {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)} Risk
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{student.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-3xl font-bold">{student.overallScore}%</span>
                    {getTrendIcon(student.trend)}
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Performance</p>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Performance Trend</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(student.trend)}
                    <span className="font-medium capitalize">{student.trend}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Submission</p>
                  <p className="font-medium mt-1">
                    {student.lastSubmission 
                      ? formatDistanceToNow(new Date(student.lastSubmission), { addSuffix: true })
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Analyzed</p>
                  <p className="font-medium mt-1">
                    {student.lastAnalyzedAt 
                      ? formatDistanceToNow(new Date(student.lastAnalyzedAt), { addSuffix: true })
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-status-success" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-status-success-bg/50">
                    <span className="font-medium text-foreground">{strength.topic}</span>
                    <div className="flex items-center gap-2">
                      <div className="mastery-bar w-20">
                        <div 
                          className="mastery-fill bg-status-success"
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-status-success">{strength.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas Needing Attention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-status-warning" />
                Where They're Falling Behind
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedInsights).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No areas of concern</p>
                  <p className="text-sm mt-1">This student is performing well across all topics</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedInsights).map(([subject, units]) => (
                    <div key={subject} className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        {subject}
                      </h3>
                      
                      {Object.entries(units).map(([unit, topics]) => (
                        <div key={unit} className="ml-4 space-y-3">
                          <h4 className="font-medium text-muted-foreground flex items-center gap-2">
                            <ChevronRight className="h-4 w-4" />
                            {unit}
                          </h4>
                          
                          <div className="ml-6 space-y-3">
                            {topics.map((topic) => (
                              <div 
                                key={topic.id} 
                                className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="font-medium">{topic.topic}</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      {getConfidenceBadge(topic.confidence)}
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(topic.lastSeen), { addSuffix: true })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-2">
                                      <div className="mastery-bar w-16">
                                        <div 
                                          className={cn("mastery-fill", getMasteryColor(topic.masteryScore))}
                                          style={{ width: `${topic.masteryScore}%` }}
                                        />
                                      </div>
                                      <span className={cn(
                                        "text-sm font-bold",
                                        topic.masteryScore < 50 && "text-risk-high",
                                        topic.masteryScore >= 50 && topic.masteryScore < 70 && "text-risk-medium",
                                        topic.masteryScore >= 70 && "text-risk-low"
                                      )}>
                                        {topic.masteryScore}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Mastery</p>
                                  </div>
                                </div>

                                {/* Evidence */}
                                <div className="mb-3">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Evidence</p>
                                  <ul className="space-y-1">
                                    {topic.evidence.map((item, idx) => (
                                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-destructive mt-1">•</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Recommendation */}
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    Recommended Next Steps
                                  </p>
                                  <p className="text-sm">{topic.recommendation}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Rail - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Assign Practice Work
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Message Student
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileDown className="h-4 w-4" />
                Export Report
              </Button>
            </CardContent>
          </Card>

          {/* Performance History - Mock */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Fractions Quiz', score: 65, date: '2 days ago' },
                  { name: 'Homework Week 3', score: 58, date: '4 days ago' },
                  { name: 'Unit 2 Test', score: 52, date: '1 week ago' },
                  { name: 'Classwork 01/10', score: 70, date: '1 week ago' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      item.score < 60 && "text-risk-high",
                      item.score >= 60 && item.score < 75 && "text-risk-medium",
                      item.score >= 75 && "text-risk-low"
                    )}>
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
