
CREATE TABLE public.exam_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  title_bn TEXT,
  exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_minutes_before INTEGER NOT NULL DEFAULT 60,
  reminder_type TEXT NOT NULL DEFAULT 'exam',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" ON public.exam_reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reminders" ON public.exam_reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reminders" ON public.exam_reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reminders" ON public.exam_reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_exam_reminders_updated_at BEFORE UPDATE ON public.exam_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
