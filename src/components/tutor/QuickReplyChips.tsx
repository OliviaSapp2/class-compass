import { Button } from '@/components/ui/button';

interface QuickReplyChipsProps {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export function QuickReplyChips({ replies, onSelect, disabled }: QuickReplyChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 py-3">
      {replies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => onSelect(reply)}
          disabled={disabled}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
