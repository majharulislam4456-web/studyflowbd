
-- Create parent_share_codes table
CREATE TABLE public.parent_share_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  share_code text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parent_share_codes ENABLE ROW LEVEL SECURITY;

-- Students can manage their own codes
CREATE POLICY "Users can view their own share codes"
  ON public.parent_share_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own share codes"
  ON public.parent_share_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own share codes"
  ON public.parent_share_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own share codes"
  ON public.parent_share_codes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Public can look up active codes (for the edge function validation, but also allows anon select by code)
CREATE POLICY "Anyone can look up active share codes"
  ON public.parent_share_codes FOR SELECT
  TO anon
  USING (is_active = true);
