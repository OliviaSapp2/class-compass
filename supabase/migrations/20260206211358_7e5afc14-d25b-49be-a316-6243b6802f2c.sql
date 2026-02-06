-- Create a table for scraped educational resources
CREATE TABLE public.educational_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL DEFAULT 'middle_school',
  title TEXT NOT NULL,
  content TEXT,
  source_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  resource_type TEXT CHECK (resource_type IN ('article', 'video', 'practice', 'explanation', 'example')),
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read educational resources (public content)
CREATE POLICY "Educational resources are publicly viewable" 
ON public.educational_resources 
FOR SELECT 
USING (true);

-- Only authenticated users can insert resources (teachers)
CREATE POLICY "Authenticated users can add resources" 
ON public.educational_resources 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for faster topic searches
CREATE INDEX idx_educational_resources_topic ON public.educational_resources(topic);
CREATE INDEX idx_educational_resources_subject ON public.educational_resources(subject);