import { supabase } from '@/integrations/supabase/client';
import { Gap, TutorPracticeQuestion } from '@/lib/studentMockData';

interface ChatMessage {
  role: 'user' | 'tutor';
  content: string;
}

interface TutorContext {
  topic: string;
  topicPath: string;
  studentName: string;
  grade: string;
  language: string;
  bilingualMode: boolean;
  misconceptions: string[];
  gaps: Gap[];
}

interface TutorChatResponse {
  success: boolean;
  response?: string;
  quickReplies?: string[] | null;
  practiceQuestion?: TutorPracticeQuestion | null;
  phase?: string;
  error?: string;
}

export async function sendTutorMessage(
  message: string,
  conversationHistory: ChatMessage[],
  context: TutorContext
): Promise<TutorChatResponse> {
  console.log('Sending message to AI tutor...');
  
  const { data, error } = await supabase.functions.invoke('tutor-chat', {
    body: {
      message,
      conversationHistory,
      context: {
        topic: context.topic,
        topicPath: context.topicPath,
        studentName: context.studentName,
        grade: context.grade,
        language: context.language,
        bilingualMode: context.bilingualMode,
        misconceptions: context.misconceptions,
        gaps: context.gaps.map(g => ({
          topic: g.topic,
          masteryEstimate: g.masteryEstimate,
          commonMisconceptions: g.commonMisconceptions,
        })),
      },
    },
  });

  if (error) {
    console.error('Tutor chat error:', error);
    return { success: false, error: error.message };
  }

  if (!data.success) {
    console.error('Tutor response error:', data.error);
    return { success: false, error: data.error };
  }

  return {
    success: true,
    response: data.response,
    quickReplies: data.quickReplies,
    practiceQuestion: data.practiceQuestion,
    phase: data.phase,
  };
}
