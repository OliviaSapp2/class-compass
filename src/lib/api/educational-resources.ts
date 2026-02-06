import { supabase } from '@/integrations/supabase/client';

export type ChallengingTopic = {
  subject: string;
  topics: string[];
};

export type EducationalResource = {
  id: string;
  topic: string;
  subject: string;
  grade_level: string;
  title: string;
  content: string | null;
  source_url: string | null;
  difficulty: string | null;
  resource_type: string | null;
  scraped_at: string;
  created_at: string;
};

type ApiResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
  count?: number;
};

export const educationalResourcesApi = {
  // Get list of challenging topics for middle school
  async getChallengingTopics(): Promise<ApiResponse<ChallengingTopic[]>> {
    const { data, error } = await supabase.functions.invoke('scrape-educational-content', {
      body: { action: 'get-topics' },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  // Scrape educational content for a specific topic
  async scrapeContent(
    subject: string,
    topic: string,
    searchQuery?: string
  ): Promise<ApiResponse<EducationalResource[]>> {
    const { data, error } = await supabase.functions.invoke('scrape-educational-content', {
      body: { action: 'scrape', subject, topic, searchQuery },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  // List existing resources from database
  async listResources(
    subject?: string,
    topic?: string
  ): Promise<ApiResponse<EducationalResource[]>> {
    const { data, error } = await supabase.functions.invoke('scrape-educational-content', {
      body: { action: 'list', subject, topic },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
