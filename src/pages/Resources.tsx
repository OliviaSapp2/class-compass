import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Loader2, 
  Sparkles,
  GraduationCap,
  Calculator,
  FlaskConical,
  BookText,
  Clock
} from 'lucide-react';
import { educationalResourcesApi, ChallengingTopic, EducationalResource } from '@/lib/api/educational-resources';

const subjectIcons: Record<string, React.ReactNode> = {
  Math: <Calculator className="h-4 w-4" />,
  Science: <FlaskConical className="h-4 w-4" />,
  English: <BookText className="h-4 w-4" />,
  History: <Clock className="h-4 w-4" />,
};

const Resources = () => {
  const { toast } = useToast();
  const [challengingTopics, setChallengingTopics] = useState<ChallengingTopic[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  // Load challenging topics on mount
  useEffect(() => {
    loadTopics();
    loadResources();
  }, []);

  const loadTopics = async () => {
    const response = await educationalResourcesApi.getChallengingTopics();
    if (response.success && response.data) {
      setChallengingTopics(response.data);
    }
  };

  const loadResources = async (subject?: string, topic?: string) => {
    setIsLoading(true);
    const response = await educationalResourcesApi.listResources(subject, topic);
    if (response.success && response.data) {
      setResources(response.data);
    } else {
      toast({
        title: 'Error loading resources',
        description: response.error || 'Failed to load resources',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleScrape = async (subject: string, topic: string) => {
    setIsScraping(true);
    toast({
      title: 'Scraping content...',
      description: `Finding educational resources for ${topic} in ${subject}`,
    });

    const response = await educationalResourcesApi.scrapeContent(
      subject,
      topic,
      customQuery || undefined
    );

    if (response.success) {
      toast({
        title: 'Content scraped!',
        description: `Found ${response.count || 0} new resources`,
      });
      loadResources();
    } else {
      toast({
        title: 'Scraping failed',
        description: response.error || 'Failed to scrape content',
        variant: 'destructive',
      });
    }
    setIsScraping(false);
  };

  const currentTopics = challengingTopics.find(t => t.subject === selectedSubject)?.topics || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Educational Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered content for challenging middle school topics
          </p>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Resources</TabsTrigger>
          <TabsTrigger value="scrape">Scrape New Content</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedSubject} onValueChange={(val) => {
                  setSelectedSubject(val);
                  setSelectedTopic('');
                  loadResources(val === 'all' ? undefined : val);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {challengingTopics.map(t => (
                      <SelectItem key={t.subject} value={t.subject}>
                        <span className="flex items-center gap-2">
                          {subjectIcons[t.subject]}
                          {t.subject}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      className="pl-10"
                      onChange={(e) => {
                        // Could implement local filtering here
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : resources.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by scraping educational content for challenging topics
                </p>
                <Button asChild>
                  <a href="#scrape-tab">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Scrape Content
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="mb-2">
                        {subjectIcons[resource.subject]}
                        <span className="ml-1">{resource.subject}</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {resource.difficulty || 'medium'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Topic: {resource.topic}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {resource.content || 'No description available'}
                    </p>
                    {resource.source_url && (
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a href={resource.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          View Source
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Scrape Tab */}
        <TabsContent value="scrape" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Scrape Educational Content
              </CardTitle>
              <CardDescription>
                Use Apify to find quality educational resources for topics students struggle with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject & Topic Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={(val) => {
                    setSelectedSubject(val);
                    setSelectedTopic('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {challengingTopics.map(t => (
                        <SelectItem key={t.subject} value={t.subject}>
                          <span className="flex items-center gap-2">
                            {subjectIcons[t.subject]}
                            {t.subject}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Select 
                    value={selectedTopic} 
                    onValueChange={setSelectedTopic}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Search Query */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Search Query (optional)</label>
                <Input
                  placeholder="e.g., 'how to multiply fractions step by step'"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use default search terms based on subject and topic
                </p>
              </div>

              <Button 
                onClick={() => handleScrape(selectedSubject, selectedTopic)}
                disabled={!selectedSubject || !selectedTopic || isScraping}
                className="w-full md:w-auto"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Scrape Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Topic Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Challenging Topics by Subject</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {challengingTopics.map((subject) => (
                <Card key={subject.subject}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {subjectIcons[subject.subject]}
                      {subject.subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic) => (
                        <Badge 
                          key={topic} 
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => {
                            setSelectedSubject(subject.subject);
                            setSelectedTopic(topic);
                          }}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
