import { useState, useEffect } from 'react';
import { Mic, Square, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface VoiceRecorderSheetProps {
  open: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

type RecordingState = 'idle' | 'listening' | 'transcribing';

export function VoiceRecorderSheet({ open, onClose, onTranscript }: VoiceRecorderSheetProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);

  // Reset state when sheet opens
  useEffect(() => {
    if (open) {
      setState('idle');
      setRecordingTime(0);
    }
  }, [open]);

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === 'listening') {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleStartRecording = () => {
    setState('listening');
    setRecordingTime(0);
  };

  const handleStopRecording = async () => {
    setState('transcribing');
    
    // Simulate transcription delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock transcribed text based on common student questions
    const mockTranscripts = [
      "Can you explain how to multiply fractions again?",
      "I'm confused about when to flip the fraction",
      "Why do we need to simplify at the end?",
      "Can you give me an easier example?",
      "I think I understand now, can we try another problem?",
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    onTranscript(randomTranscript);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="h-[300px] rounded-t-2xl">
        <SheetHeader className="text-center">
          <SheetTitle>
            {state === 'idle' && 'Tap to speak'}
            {state === 'listening' && 'Listening...'}
            {state === 'transcribing' && 'Transcribing...'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col items-center justify-center h-full gap-6 -mt-4">
          {/* Recording visualization */}
          <div className="relative">
            {state === 'listening' && (
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: '1.5s' }} />
            )}
            <Button
              size="icon"
              variant={state === 'listening' ? 'destructive' : 'default'}
              className={cn(
                'h-20 w-20 rounded-full transition-all',
                state === 'listening' && 'scale-110'
              )}
              onClick={state === 'idle' ? handleStartRecording : state === 'listening' ? handleStopRecording : undefined}
              disabled={state === 'transcribing'}
            >
              {state === 'idle' && <Mic className="h-8 w-8" />}
              {state === 'listening' && <Square className="h-8 w-8" />}
              {state === 'transcribing' && <Loader2 className="h-8 w-8 animate-spin" />}
            </Button>
          </div>

          {/* Recording time */}
          {state === 'listening' && (
            <p className="text-2xl font-mono text-muted-foreground">
              {formatTime(recordingTime)}
            </p>
          )}

          {/* Helper text */}
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {state === 'idle' && "Voice is optional. You can type anytime."}
            {state === 'listening' && "Speak clearly and tap stop when done."}
            {state === 'transcribing' && "Converting your speech to text..."}
          </p>

          {/* Cancel button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
