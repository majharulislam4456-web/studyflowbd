-- Add Keep-style columns to notes
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS color text DEFAULT null;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS labels text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_checklist boolean NOT NULL DEFAULT false;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS checklist_items jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Add chapter to flashcards
ALTER TABLE public.flashcards ADD COLUMN IF NOT EXISTS chapter text DEFAULT null;