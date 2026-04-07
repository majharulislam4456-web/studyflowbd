
ALTER TABLE public.parent_share_codes
  ADD COLUMN whatsapp_number text,
  ADD COLUMN send_time text NOT NULL DEFAULT '20:00';
