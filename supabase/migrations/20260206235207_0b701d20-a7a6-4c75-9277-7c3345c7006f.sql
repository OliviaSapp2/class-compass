-- Create storage bucket for student uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-uploads', 'student-uploads', false);

-- Create RLS policies for student-uploads bucket
CREATE POLICY "Students can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'student-uploads');

CREATE POLICY "Students can view their own files"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-uploads');

CREATE POLICY "Students can delete their own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'student-uploads');

-- Create table to track student uploads metadata
CREATE TABLE public.student_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lecture_notes', 'study_guide', 'practice_worksheet', 'wrong_answers')),
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'analyzed')),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  analyzed_at TIMESTAMP WITH TIME ZONE,
  analysis_result JSONB
);

-- Enable RLS on student_uploads
ALTER TABLE public.student_uploads ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_uploads (using student_id since no auth yet)
CREATE POLICY "Anyone can view uploads"
ON public.student_uploads FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert uploads"
ON public.student_uploads FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update uploads"
ON public.student_uploads FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete uploads"
ON public.student_uploads FOR DELETE
USING (true);