
-- Create syllabuses table
CREATE TABLE public.syllabuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  name_bn TEXT,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'hsl(168 65% 35%)',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add syllabus_id to subjects (nullable for backward compatibility)
ALTER TABLE public.subjects ADD COLUMN syllabus_id UUID REFERENCES public.syllabuses(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.syllabuses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own syllabuses" ON public.syllabuses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own syllabuses" ON public.syllabuses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own syllabuses" ON public.syllabuses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own syllabuses" ON public.syllabuses FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_syllabuses_updated_at BEFORE UPDATE ON public.syllabuses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
