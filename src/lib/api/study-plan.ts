import { supabase } from '@/integrations/supabase/client';
import { Gap, StudyPlan, StudyPlanSettings } from '@/lib/studentMockData';

interface GenerateStudyPlanParams {
  gaps: Gap[];
  settings: StudyPlanSettings;
  studentProfile: {
    name: string;
    grade: string;
    goals: string[];
  };
}

interface GenerateStudyPlanResponse {
  success: boolean;
  studyPlan?: StudyPlan;
  error?: string;
}

export async function generateAIStudyPlan(
  params: GenerateStudyPlanParams
): Promise<GenerateStudyPlanResponse> {
  console.log('Calling generate-study-plan edge function...');
  
  const { data, error } = await supabase.functions.invoke('generate-study-plan', {
    body: params,
  });

  if (error) {
    console.error('Edge function error:', error);
    return { success: false, error: error.message };
  }

  if (!data.success) {
    console.error('Study plan generation failed:', data.error);
    return { success: false, error: data.error };
  }

  return { success: true, studyPlan: data.studyPlan };
}
