import { useState } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  ChevronDown,
  Sparkles,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { TopicCard } from '@/components/student/TopicCard';
import { EvidenceDrawer } from '@/components/student/EvidenceDrawer';
import { HelpPanel } from '@/components/student/HelpPanel';
import { Gap } from '@/lib/studentMockData';

type SortOption = 'most_urgent' | 'newly_identified' | 'lowest_mastery' | 'highest_risk';
type RiskFilter = 'all' | 'high' | 'medium' | 'low';

export default function StudentGaps() {
  const { studentGaps, addGapToPlan } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('most_urgent');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [selectedGap, setSelectedGap] = useState<Gap | null>(null);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [helpGap, setHelpGap] = useState<Gap | null>(null);

  // Get unique subjects
  const subjects = Array.from(new Set(studentGaps.map(g => g.subject)));

  // Filter and sort gaps
  const filteredGaps = studentGaps
    .filter(gap => {
      if (searchQuery && !gap.topic.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !gap.unit.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (riskFilter !== 'all' && gap.riskLevel !== riskFilter) {
        return false;
      }
      if (subjectFilter !== 'all' && gap.subject !== subjectFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newly_identified':
          return (b.isNewlyIdentified ? 1 : 0) - (a.isNewlyIdentified ? 1 : 0);
        case 'lowest_mastery':
          return a.masteryEstimate - b.masteryEstimate;
        case 'highest_risk':
          const riskOrder = { high: 0, medium: 1, low: 2 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        case 'most_urgent':
        default:
          // Combine risk and mastery for urgency
          const urgencyA = (3 - ['low', 'medium', 'high'].indexOf(a.riskLevel)) * (100 - a.masteryEstimate);
          const urgencyB = (3 - ['low', 'medium', 'high'].indexOf(b.riskLevel)) * (100 - b.masteryEstimate);
          return urgencyB - urgencyA;
      }
    });

  // Group gaps by subject and unit
  const groupedGaps = filteredGaps.reduce((acc, gap) => {
    const key = `${gap.subject} → ${gap.unit}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(gap);
    return acc;
  }, {} as Record<string, Gap[]>);

  const handleViewDetails = (gap: Gap) => {
    setSelectedGap(gap);
    setShowEvidenceDrawer(true);
  };

  const handleAskForHelp = (gap: Gap) => {
    setHelpGap(gap);
    setShowEvidenceDrawer(false);
    setShowHelpPanel(true);
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'most_urgent': return 'Most Urgent';
      case 'newly_identified': return 'Newly Identified';
      case 'lowest_mastery': return 'Lowest Mastery';
      case 'highest_risk': return 'Highest Risk';
    }
  };

  // Stats
  const highRiskCount = studentGaps.filter(g => g.riskLevel === 'high').length;
  const newCount = studentGaps.filter(g => g.isNewlyIdentified).length;
  const avgMastery = Math.round(studentGaps.reduce((acc, g) => acc + g.masteryEstimate, 0) / studentGaps.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Where I'm Falling Behind
        </h1>
        <p className="text-muted-foreground">
          These are the topics where you need the most improvement. Let's tackle them together!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highRiskCount}</p>
              <p className="text-sm text-muted-foreground">High Risk Topics</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{newCount}</p>
              <p className="text-sm text-muted-foreground">Newly Identified</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Target className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgMastery}%</p>
              <p className="text-sm text-muted-foreground">Avg Mastery</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Subject Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {subjectFilter === 'all' ? 'All Subjects' : subjectFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSubjectFilter('all')}>
                  All Subjects
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {subjects.map(subject => (
                  <DropdownMenuItem key={subject} onClick={() => setSubjectFilter(subject)}>
                    {subject}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Risk Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {riskFilter === 'all' ? 'All Risks' : `${riskFilter} Risk`}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRiskFilter('all')}>All Risks</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRiskFilter('high')}>High Risk</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRiskFilter('medium')}>Medium Risk</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRiskFilter('low')}>Low Risk</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Sort: {getSortLabel(sortBy)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('most_urgent')}>Most Urgent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('newly_identified')}>Newly Identified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('lowest_mastery')}>Lowest Mastery</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('highest_risk')}>Highest Risk</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Gaps List - Grouped */}
      <div className="space-y-6">
        {Object.entries(groupedGaps).map(([groupKey, gaps]) => (
          <div key={groupKey}>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {groupKey}
              <Badge variant="secondary">{gaps.length}</Badge>
            </h2>
            <div className="space-y-3">
              {gaps.map(gap => (
                <TopicCard
                  key={gap.id}
                  gap={gap}
                  onViewDetails={handleViewDetails}
                  onAddToPlan={addGapToPlan}
                />
              ))}
            </div>
          </div>
        ))}

        {filteredGaps.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No gaps found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || riskFilter !== 'all' || subjectFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : "Great job! You're on track with all topics."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <EvidenceDrawer
        gap={selectedGap}
        open={showEvidenceDrawer}
        onOpenChange={setShowEvidenceDrawer}
        onAddToPlan={addGapToPlan}
        onAskForHelp={handleAskForHelp}
      />

      <HelpPanel
        gap={helpGap}
        open={showHelpPanel}
        onOpenChange={setShowHelpPanel}
      />
    </div>
  );
}
