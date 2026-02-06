import { supabase } from '@/integrations/supabase/client';

interface AnalyzeParams {
  prompt?: string;
  class_id: string;
  student_ids?: string[];
  upload_refs?: string[];
}

interface AnalyzeResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

export async function runAnalyze(params: AnalyzeParams): Promise<AnalyzeResult> {
  const { data, error } = await supabase.functions.invoke('agent-analyze', {
    body: params,
  });

  if (error) {
    throw new Error(error.message || 'Failed to run analysis');
  }

  if (!data.ok) {
    throw new Error(data.error || 'Analysis failed');
  }

  return data;
}
