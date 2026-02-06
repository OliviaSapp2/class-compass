import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gap, TutorMessage, SupportedLanguage, TutorPhase, getTutorResponse, TutorSessionSummary } from '@/lib/studentMockData';
import { MessageBubble } from './MessageBubble';
import { QuickReplyChips } from './QuickReplyChips';
import { VoiceRecorderSheet } from './VoiceRecorderSheet';
import { TopicPicker } from './TopicPicker';
import { SessionGoalsPanel } from './SessionGoalsPanel';
import { LanguageSelector } from './LanguageSelector';
import { PracticeQuestionCard } from './PracticeQuestionCard';
import { SessionSummaryCard } from './SessionSummaryCard';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface TutorChatShellProps {
  initialTopicId?: string;
}

export function TutorChatShell({ initialTopicId }: TutorChatShellProps) {
  const { studentGaps, addGapToPlan } = useApp();
  
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

  const startSession = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const greetingMessage = getTutorResponse(currentTopic, 'greeting');
    setMessages([greetingMessage]);
    setIsTyping(false);
    
    // After greeting, confirm topic
    setTimeout(async () => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const confirmMessage = getTutorResponse(currentTopic, 'topic_confirm');
      setMessages(prev => [...prev, confirmMessage]);
      setCurrentPhase('topic_confirm');
      setIsTyping(false);
    }, 1500);
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

    // Simulate tutor response based on current phase
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    let nextMessage: TutorMessage;
    let nextPhase = currentPhase;

    switch (currentPhase) {
      case 'topic_confirm':
        if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('right')) {
          nextMessage = getTutorResponse(currentTopic, 'find_misconception');
          nextPhase = 'find_misconception';
        } else {
          nextMessage = {
            id: `tutor-${Date.now()}`,
            role: 'tutor',
            content: "No problem! What topic would you like help with? You can pick from your gaps above.",
            timestamp: new Date().toISOString(),
            phase: 'topic_confirm',
          };
        }
        break;

      case 'find_misconception':
        // Detect misconception from user's response
        const misconception = text.length > 20 ? text.slice(0, 30) + '...' : text;
        setDetectedMisconceptions(prev => [...prev, misconception]);
        nextMessage = getTutorResponse(currentTopic, 'micro_lesson');
        nextPhase = 'micro_lesson';
        break;

      case 'micro_lesson':
        nextMessage = getTutorResponse(currentTopic, 'practice');
        nextPhase = 'practice';
        break;

      case 'practice':
        // Check if answer seems correct (mock logic)
        const seemsCorrect = text.includes('1') || text.includes('2') || text.toLowerCase().includes('correct');
        if (seemsCorrect) {
          nextMessage = getTutorResponse(currentTopic, 'outcome');
          nextPhase = 'outcome';
          // Generate session summary
          setSessionSummary({
            sessionId: `session-${Date.now()}`,
            topic: currentTopic,
            struggledWith: detectedMisconceptions,
            recommendedNextSteps: selectedGap?.recommendedNextSteps || ['Practice more problems'],
            linkedTaskIds: [],
            sharedWithTeacher: false,
          });
        } else {
          nextMessage = {
            id: `tutor-${Date.now()}`,
            role: 'tutor',
            content: "Let's think about this a bit more. Remember the key steps we covered. Try again!",
            timestamp: new Date().toISOString(),
            phase: 'practice',
          };
        }
        break;

      case 'outcome':
        if (text.toLowerCase().includes('plan')) {
          addGapToPlan(selectedGap?.id || '');
          toast.success('Added to your study plan!');
          nextMessage = {
            id: `tutor-${Date.now()}`,
            role: 'tutor',
            content: "Great! I've added this topic to your study plan. You're on your way to mastery! 🌟",
            timestamp: new Date().toISOString(),
            phase: 'outcome',
          };
        } else if (text.toLowerCase().includes('another') || text.toLowerCase().includes('more')) {
          nextMessage = getTutorResponse(currentTopic, 'practice');
          nextPhase = 'practice';
        } else {
          nextMessage = {
            id: `tutor-${Date.now()}`,
            role: 'tutor',
            content: "No worries—learning takes time. Would you like me to explain it differently, or should we try an easier example?",
            timestamp: new Date().toISOString(),
            phase: 'outcome',
            quickReplies: ["Explain differently", "Easier example", "I'm done for now"],
          };
        }
        break;

      default:
        nextMessage = {
          id: `tutor-${Date.now()}`,
          role: 'tutor',
          content: "I'm here to help! What would you like to work on?",
          timestamp: new Date().toISOString(),
        };
    }

    setMessages(prev => [...prev, nextMessage]);
    setCurrentPhase(nextPhase);
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
