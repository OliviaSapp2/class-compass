import { TutorMessage } from '@/lib/studentMockData';
import { cn } from '@/lib/utils';
import { PlayAudioButton } from './PlayAudioButton';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: TutorMessage;
  bilingualMode: boolean;
}

export function MessageBubble({ message, bilingualMode }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      {/* Message Content */}
      <div className={cn('flex flex-col max-w-[75%]', isUser && 'items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-3',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted rounded-bl-md'
        )}>
          <div className={cn('prose prose-sm max-w-none', isUser && 'prose-invert')}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
          {/* Bilingual Translation */}
          {bilingualMode && message.translatedContent && message.role === 'tutor' && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground italic">
                {message.translatedContent}
              </p>
            </div>
          )}
        </div>
        
        {/* Audio playback for tutor messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1">
            <PlayAudioButton messageId={message.id} />
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
        
        {isUser && (
          <span className="text-xs text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
