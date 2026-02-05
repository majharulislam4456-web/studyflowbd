-- Add priority field to subjects for manual ordering
ALTER TABLE public.subjects ADD COLUMN priority integer NOT NULL DEFAULT 0;

-- Create index for faster priority sorting
CREATE INDEX idx_subjects_priority ON public.subjects (user_id, priority DESC);