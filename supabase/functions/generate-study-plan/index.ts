const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface Gap {
  id: string;
  subject: string;
  unit: string;
  topic: string;
  topicPath: string;
  masteryEstimate: number;
  confidence: string;
  commonMisconceptions: string[];
  recommendedNextSteps: string[];
  riskLevel: string;
  evidence: { type: string; name: string; date: string; score?: string; detail: string }[];
}

interface StudyPlanSettings {
  minutesPerDay: number;
  daysPerWeek: number;
  priority: 'grades' | 'mastery' | 'upcoming_test';
  difficulty: 'gentle' | 'normal' | 'intensive';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { gaps, settings, studentProfile } = await req.json() as {
      gaps: Gap[];
      settings: StudyPlanSettings;
      studentProfile: { name: string; grade: string; goals: string[] };
    };

    console.log('Generating study plan for:', studentProfile.name);
    console.log('Gaps count:', gaps.length);
    console.log('Settings:', settings);

    // Build a detailed prompt for the AI
    const systemPrompt = `You are an expert educational tutor AI specializing in creating personalized study plans for middle school students. 
You analyze learning gaps, test scores, and historical performance to create actionable, age-appropriate study schedules.
Your plans should be encouraging, realistic, and break complex topics into small digestible chunks.
Focus on addressing misconceptions and building foundational understanding before advancing.`;

    const gapsDescription = gaps.map(g => `
- Topic: ${g.topic} (${g.topicPath})
  Mastery: ${g.masteryEstimate}%
  Risk Level: ${g.riskLevel}
  Evidence: ${g.evidence.map(e => `${e.type}: ${e.name} - ${e.detail}`).join('; ')}
  Common Misconceptions: ${g.commonMisconceptions.join(', ')}
  Recommended Steps: ${g.recommendedNextSteps.join(', ')}
`).join('\n');

    const userPrompt = `Create a personalized study plan for ${studentProfile.name}, a ${studentProfile.grade} grade student.

Student's Goals: ${studentProfile.goals.join(', ')}

LEARNING GAPS TO ADDRESS:
${gapsDescription}

STUDY PLAN SETTINGS:
- Time available: ${settings.minutesPerDay} minutes per day
- Days per week: ${settings.daysPerWeek}
- Priority: ${settings.priority === 'grades' ? 'Improve grades quickly' : settings.priority === 'mastery' ? 'Deep understanding' : 'Prepare for upcoming test'}
- Pace: ${settings.difficulty}

Create a 2-week study plan with daily tasks. Each task should:
1. Have a clear, specific micro-goal
2. Include estimated time (fitting within daily limit)
3. Suggest specific resources (videos, articles, practice problems)
4. Include 2-3 practice questions with hints and explanations

IMPORTANT: Respond with a valid JSON object following this exact structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "2024-01-15",
      "endDate": "2024-01-19",
      "focusTopics": ["Topic 1", "Topic 2"],
      "days": [
        {
          "date": "2024-01-15",
          "dayOfWeek": "Monday",
          "totalMinutes": 30,
          "isCompleted": false,
          "tasks": [
            {
              "id": "task-1",
              "topic": "Topic Name",
              "topicPath": "Subject → Unit → Topic",
              "microGoal": "Specific learning objective",
              "estimatedMinutes": 15,
              "status": "pending",
              "resources": [
                {"id": "r1", "title": "Resource Name", "type": "video", "estimatedMinutes": 5}
              ],
              "practiceQuestions": [
                {"id": "q1", "question": "Question text?", "hint": "Helpful hint", "answer": "Answer", "explanation": "Why this is correct"}
              ]
            }
          ]
        }
      ]
    }
  ]
}`;

    console.log('Calling Lovable AI...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: `AI service error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    console.log('AI response received');

    const content = aiData.choices?.[0]?.message?.content;
    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ success: false, error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON from the AI response
    let studyPlanData;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      studyPlanData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw content:', content.substring(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse study plan' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct the complete study plan
    const studyPlan = {
      id: `plan-${Date.now()}`,
      studentId: 'student-1',
      generatedAt: new Date().toISOString(),
      settings,
      weeks: studyPlanData.weeks || [],
      status: 'active',
      shareWithTeacher: false,
    };

    console.log('Study plan generated successfully');

    return new Response(
      JSON.stringify({ success: true, studyPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating study plan:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
