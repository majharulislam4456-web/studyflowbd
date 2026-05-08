-- App-wide settings (single row, admin-controlled)
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_theme TEXT NOT NULL DEFAULT 'default',
  announcement_title TEXT,
  announcement_content TEXT,
  announcement_link TEXT,
  announcement_active BOOLEAN NOT NULL DEFAULT false,
  announcement_expires_at TIMESTAMPTZ,
  features JSONB NOT NULL DEFAULT '{"quotes":true,"tips":true,"ai":true,"pomodoro":true,"flashcards":false,"studyWithMe":true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone (even anon) can read settings — themes/announcements are public
CREATE POLICY "Anyone can view app settings"
ON public.app_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert app settings"
ON public.app_settings FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update app settings"
ON public.app_settings FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete app settings"
ON public.app_settings FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed single row
INSERT INTO public.app_settings (active_theme) VALUES ('default');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;