const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ChatMessage {
  role: 'user' | 'tutor';
  content: string;
}

interface TutorRequest {
  message: string;
  conversationHistory: ChatMessage[];
  context: {
    topic: string;
    topicPath: string;
    studentName: string;
    grade: string;
    language: string;
    bilingualMode: boolean;
    misconceptions: string[];
    gaps: Array<{
      topic: string;
      masteryEstimate: number;
      commonMisconceptions: string[];
    }>;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const STACKAI_TUTOR_FLOW_URL = Deno.env.get('STACKAI_TUTOR_FLOW_URL');
    const STACKAI_API_KEY = Deno.env.get('STACKAI_API_KEY');

    if (!STACKAI_TUTOR_FLOW_URL) {
      console.error('STACKAI_TUTOR_FLOW_URL not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Tutor service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationHistory, context } = await req.json() as TutorRequest;

    console.log('Tutor chat request received');
    console.log('Topic:', context.topic);
    console.log('Message:', message.substring(0, 100));
    console.log('History length:', conversationHistory.length);

    // Build the payload for Stack AI
    // Stack AI typically expects an "in-0" input field or similar
    const stackPayload = {
      "in-0": message,
      "conversation_history": conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n'),
      "topic": context.topic,
      "topic_path": context.topicPath,
      "student_name": context.studentName,
      "grade": context.grade,
      "language": context.language,
      "bilingual_mode": context.bilingualMode,
      "misconceptions": context.misconceptions.join(', '),
      "learning_gaps": context.gaps.map(g => 
        `${g.topic} (${g.masteryEstimate}% mastery): ${g.commonMisconceptions.join(', ')}`
      ).join('\n'),
    };

    console.log('Calling Stack AI tutor...');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if available
    if (STACKAI_API_KEY) {
      headers['Authorization'] = `Bearer ${STACKAI_API_KEY}`;
    }

    const response = await fetch(STACKAI_TUTOR_FLOW_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(stackPayload),
    });

    // Get response as text first to check if it's valid JSON
    const responseText = await response.text();
    console.log('Stack AI response status:', response.status);
    console.log('Stack AI response preview:', responseText.substring(0, 200));

    if (!response.ok) {
      console.error('Stack AI error:', response.status, responseText.substring(0, 500));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Tutor service error (${response.status}). Please verify your Stack AI flow URL is correct.` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if response is HTML (error page) instead of JSON
    if (responseText.trim().startsWith('<') || responseText.trim().startsWith('<!DOCTYPE')) {
      console.error('Stack AI returned HTML instead of JSON. URL may be incorrect.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Stack AI returned an error page. Please verify your STACKAI_TUTOR_FLOW_URL is correct.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Stack AI response:', parseError);
      console.error('Response was:', responseText.substring(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid response from Stack AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Stack AI tutor response received');

    // Stack AI typically returns response in "out-0" or similar field
    // Adjust based on your actual Stack AI workflow output
    const tutorResponse = data['out-0'] || data.output || data.response || data.message || JSON.stringify(data);

    // Parse any structured data from the response
    let parsedResponse = {
      content: tutorResponse,
      quickReplies: null as string[] | null,
      practiceQuestion: null as { question: string; options?: string[]; answer: string; explanation: string } | null,
      phase: 'conversation' as string,
    };

    // Try to extract structured data if the response is JSON
    try {
      if (typeof tutorResponse === 'string' && tutorResponse.startsWith('{')) {
        const structured = JSON.parse(tutorResponse);
        parsedResponse = {
          content: structured.message || structured.content || tutorResponse,
          quickReplies: structured.quickReplies || structured.quick_replies || null,
          practiceQuestion: structured.practiceQuestion || structured.practice_question || null,
          phase: structured.phase || 'conversation',
        };
      }
    } catch {
      // Not JSON, use as plain text
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: parsedResponse.content,
        quickReplies: parsedResponse.quickReplies,
        practiceQuestion: parsedResponse.practiceQuestion,
        phase: parsedResponse.phase,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in tutor chat:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
