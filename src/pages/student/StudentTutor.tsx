import { useSearchParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { TutorChatShell } from '@/components/tutor/TutorChatShell';

export default function StudentTutor() {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topic');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-background">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">AI Tutor</h1>
      </div>
      
      {/* Chat Shell */}
      <div className="flex-1 overflow-hidden">
        <TutorChatShell initialTopicId={topicId || undefined} />
      </div>
    </div>
  );
}
