import { Gap } from '@/lib/studentMockData';
import { Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TopicPickerProps {
  gaps: Gap[];
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
}

export function TopicPicker({ gaps, selectedTopicId, onSelectTopic }: TopicPickerProps) {
  return (
    <Select 
      value={selectedTopicId || 'auto'} 
      onValueChange={(value) => onSelectTopic(value === 'auto' ? null : value)}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Auto: pick from my gaps</span>
          </div>
        </SelectItem>
        {gaps.map((gap) => (
          <SelectItem key={gap.id} value={gap.id}>
            <div className="flex items-center gap-2">
              <span 
                className={`w-2 h-2 rounded-full ${
                  gap.riskLevel === 'high' ? 'bg-destructive' : 
                  gap.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} 
              />
              <span>{gap.topic}</span>
              <span className="text-muted-foreground text-xs">({gap.masteryEstimate}%)</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
