import { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PlayAudioButtonProps {
  messageId: string;
}

export function PlayAudioButton({ messageId }: PlayAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    
    setIsLoading(true);
    // Simulate audio loading
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    setIsPlaying(true);
    
    // Simulate audio duration
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handlePlay}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="h-3 w-3" />
          ) : (
            <Volume2 className="h-3 w-3" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isPlaying ? 'Stop' : 'Play audio'}
      </TooltipContent>
    </Tooltip>
  );
}
