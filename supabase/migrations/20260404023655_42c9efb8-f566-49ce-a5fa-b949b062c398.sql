
-- Add deadline and description to goals
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS deadline date;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS description text;

-- Create milestones table for sub-goals
CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  title_bn text,
  is_completed boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own milestones" ON public.milestones FOR SELECT TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own milestones" ON public.milestones FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own milestones" ON public.milestones FOR UPDATE TO public USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own milestones" ON public.milestones FOR DELETE TO public USING (auth.uid() = user_id);

-- Add updated_at trigger for milestones
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
