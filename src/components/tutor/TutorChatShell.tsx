import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gap, TutorMessage, SupportedLanguage, TutorPhase, TutorSessionSummary, TutorPracticeQuestion } from '@/lib/studentMockData';
import { MessageBubble } from './MessageBubble';
import { QuickReplyChips } from './QuickReplyChips';
import { VoiceRecorderSheet } from './VoiceRecorderSheet';
import { TopicPicker } from './TopicPicker';
import { SessionGoalsPanel } from './SessionGoalsPanel';
import { LanguageSelector } from './LanguageSelector';
import { PracticeQuestionCard } from './PracticeQuestionCard';
import { SessionSummaryCard } from './SessionSummaryCard';
import { useApp } from '@/contexts/AppContext';
import { sendTutorMessage } from '@/lib/api/tutor-chat';
import { toast } from 'sonner';

interface TutorChatShellProps {
  initialTopicId?: string;
}

export function TutorChatShell({ initialTopicId }: TutorChatShellProps) {
  const { studentGaps, addGapToPlan, studentProfile } = useApp();
  
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(initialTopicId || null);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [bilingualMode, setBilingualMode] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TutorPhase>('greeting');
  const [detectedMisconceptions, setDetectedMisconceptions] = useState<string[]>([]);
  const [sessionSummary, setSessionSummary] = useState<TutorSessionSummary | null>(null);
  const [currentPracticeQ, setCurrentPracticeQ] = useState<TutorPracticeQuestion | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected topic details
  const selectedGap = studentGaps.find(g => g.id === selectedTopicId) || studentGaps[0];
  const currentTopic = selectedGap?.topic || 'General Help';
  const currentTopicPath = selectedGap?.topicPath || '';

  // Initial greeting on mount
  useEffect(() => {
    if (messages.length === 0) {
      startSession();
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper to call the Stack AI tutor
  const callTutor = async (message: string, history: TutorMessage[]): Promise<{
    content: string;
    quickReplies?: string[] | null;
    practiceQuestion?: TutorPracticeQuestion | null;
    phase?: string;
  } | null> => {
    try {
      const result = await sendTutorMessage(
        message,
        history.map(m => ({ role: m.role, content: m.content })),
        {
          topic: currentTopic,
          topicPath: currentTopicPath,
          studentName: studentProfile.name,
          grade: studentProfile.grade,
          language,
          bilingualMode,
          misconceptions: detectedMisconceptions,
          gaps: studentGaps,
        }
      );

      if (!result.success) {
        console.error('Tutor error:', result.error);
        toast.error('Failed to get tutor response');
        return null;
      }

      return {
        content: result.response || '',
        quickReplies: result.quickReplies,
        practiceQuestion: result.practiceQuestion,
        phase: result.phase,
      };
    } catch (error) {
      console.error('Tutor call failed:', error);
      toast.error('Failed to connect to tutor');
      return null;
    }
  };

  const startSession = async () => {
    setIsTyping(true);
    
    // Send initial greeting request to Stack AI
    const result = await callTutor(
      `[SYSTEM: Start tutoring session for topic "${currentTopic}". Greet the student and ask if they want help with this topic.]`,
      []
    );
    
    if (result) {
      const greetingMessage: TutorMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        content: result.content,
        timestamp: new Date().toISOString(),
        phase: 'greeting',
        quickReplies: result.quickReplies || ["Yes, let's do it!", "Can we pick another topic?"],
      };
      setMessages([greetingMessage]);
      if (result.phase) {
        setCurrentPhase(result.phase as TutorPhase);
      }
    } else {
      // Fallback greeting if API fails
      const fallbackGreeting: TutorMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        content: `Hi! I'm your AI tutor. I see you're working on ${currentTopic}. Ready to learn together?`,
        timestamp: new Date().toISOString(),
        phase: 'greeting',
        quickReplies: ["Yes, let's do it!", "Can we pick another topic?"],
      };
      setMessages([fallbackGreeting]);
    }
    
    setIsTyping(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Add user message
    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Call Stack AI tutor
    setIsTyping(true);
    
    const result = await callTutor(text, [...messages, userMessage]);
    
    if (result) {
      const tutorMessage: TutorMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        content: result.content,
        timestamp: new Date().toISOString(),
        phase: (result.phase as TutorPhase) || currentPhase,
        quickReplies: result.quickReplies || undefined,
        practiceQuestion: result.practiceQuestion || undefined,
      };
      
      setMessages(prev => [...prev, tutorMessage]);
      
      // Update phase if returned
      if (result.phase) {
        setCurrentPhase(result.phase as TutorPhase);
      }
      
      // Update practice question if returned
      if (result.practiceQuestion) {
        setCurrentPracticeQ(result.practiceQuestion);
      }
      
      // Check for outcome phase to generate summary
      if (result.phase === 'outcome') {
        setSessionSummary({
          sessionId: `session-${Date.now()}`,
          topic: currentTopic,
          struggledWith: detectedMisconceptions,
          recommendedNextSteps: selectedGap?.recommendedNextSteps || ['Practice more problems'],
          linkedTaskIds: [],
          sharedWithTeacher: false,
        });
      }
    } else {
      // Fallback message if API fails
      const fallbackMessage: TutorMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        content: "I'm having trouble connecting right now. Let me try again - what would you like help with?",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
    
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleVoiceTranscript = (transcript: string) => {
    handleSendMessage(transcript);
  };

  const handleFileAttach = () => {
    toast.info('File upload coming soon!');
  };

  const handleAddToPlan = () => {
    addGapToPlan(selectedGap?.id || '');
    toast.success('Added to your study plan!');
  };

  const handleToggleShare = (shared: boolean) => {
    if (sessionSummary) {
      setSessionSummary({ ...sessionSummary, sharedWithTeacher: shared });
      toast.success(shared ? 'Summary will be shared with your teacher' : 'Summary is now private');
    }
  };

  // Get current quick replies
  const lastTutorMessage = [...messages].reverse().find(m => m.role === 'tutor');
  const currentQuickReplies = lastTutorMessage?.quickReplies;
  const currentPracticeQuestion = lastTutorMessage?.practiceQuestion;

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <TopicPicker
              gaps={studentGaps}
              selectedTopicId={selectedTopicId}
              onSelectTopic={setSelectedTopicId}
            />
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector value={language} onChange={setLanguage} />
            <div className="flex items-center gap-2">
              <Switch
                id="bilingual"
                checked={bilingualMode}
                onCheckedChange={setBilingualMode}
              />
              <Label htmlFor="bilingual" className="text-sm">Bilingual</Label>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-2xl mx-auto">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                bilingualMode={bilingualMode}
              />
            ))}

            {/* Practice question card */}
            {currentPracticeQuestion && currentPhase === 'practice' && (
              <div className="mb-4">
                <PracticeQuestionCard
                  question={currentPracticeQuestion}
                  onAnswer={(isCorrect) => {
                    if (isCorrect) {
                      handleSendMessage("I got it correct!");
                    }
                  }}
                />
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Tutor is typing...</span>
              </div>
            )}

            {/* Quick reply chips */}
            {currentQuickReplies && !isTyping && (
              <QuickReplyChips
                replies={currentQuickReplies}
                onSelect={handleQuickReply}
              />
            )}

            {/* Session summary */}
            {sessionSummary && currentPhase === 'outcome' && (
              <div className="mt-4">
                <SessionSummaryCard
                  summary={sessionSummary}
                  onAddToPlan={handleAddToPlan}
                  onToggleShare={handleToggleShare}
                />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileAttach}
              className="flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVoiceSheetOpen(true)}
              className="flex-shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Side Panel */}
      <SessionGoalsPanel
        topic={currentTopic}
        topicPath={currentTopicPath}
        misconceptions={detectedMisconceptions}
        practiceQuestions={currentPracticeQuestion ? [currentPracticeQuestion] : undefined}
      />

      {/* Voice Recorder Sheet */}
      <VoiceRecorderSheet
        open={voiceSheetOpen}
        onClose={() => setVoiceSheetOpen(false)}
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
}
