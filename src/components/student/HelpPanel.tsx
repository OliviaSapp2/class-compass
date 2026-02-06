import { useState } from 'react';
import { X, Send, Bot, User, Lightbulb, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Gap } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';

interface HelpPanelProps {
  gap: Gap | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function HelpPanel({ gap, open, onOpenChange }: HelpPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: getMockResponse(input, gap),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const getMockResponse = (question: string, gap: Gap | null): string => {
    if (!gap) return "I'm here to help! What would you like to learn about?";

    const responses: Record<string, string> = {
      default: `Great question about ${gap.topic}! Let me explain...\n\nWhen working with ${gap.topic.toLowerCase()}, the key concept to remember is that you need to approach it step by step. Many students find this challenging at first, but with practice, it becomes second nature.\n\n**Key Tips:**\n1. Start with simpler examples\n2. Write out each step\n3. Check your work by reversing the process\n\nWould you like me to walk through a specific example?`,
      example: `Here's an example for ${gap.topic}:\n\n**Problem:** ${gap.topic === 'Multiplying Fractions' ? 'What is 2/3 × 3/4?' : 'What is 1/2 ÷ 1/4?'}\n\n**Solution:**\n${gap.topic === 'Multiplying Fractions' 
        ? '1. Multiply the numerators: 2 × 3 = 6\n2. Multiply the denominators: 3 × 4 = 12\n3. Result: 6/12\n4. Simplify: 6/12 = 1/2' 
        : '1. Keep the first fraction: 1/2\n2. Change ÷ to ×\n3. Flip the second fraction: 1/4 → 4/1\n4. Multiply: 1/2 × 4/1 = 4/2 = 2'}\n\nWould you like to try a similar problem?`,
    };

    if (question.toLowerCase().includes('example') || question.toLowerCase().includes('show')) {
      return responses.example;
    }
    return responses.default;
  };

  const suggestedQuestions = gap ? [
    `Can you explain ${gap.topic} in simple terms?`,
    `Show me an example problem`,
    `What's the most common mistake?`,
    `Give me a practice problem to try`,
  ] : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Ask for Help
          </SheetTitle>
          {gap && (
            <p className="text-sm text-muted-foreground">
              Topic: {gap.topic}
            </p>
          )}
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Ask me anything about {gap?.topic || 'your studies'}!
                </p>
                <div className="space-y-2">
                  {suggestedQuestions.map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => setInput(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2 pt-4 border-t">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
