-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    inputs JSONB NOT NULL,
    ai_analysis TEXT
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON public.assessments(user_id);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS assessments_updated_at_idx ON public.assessments(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only SELECT their own assessments
CREATE POLICY "Users can view own assessments"
    ON public.assessments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can only INSERT their own assessments
CREATE POLICY "Users can insert own assessments"
    ON public.assessments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own assessments
CREATE POLICY "Users can update own assessments"
    ON public.assessments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own assessments
CREATE POLICY "Users can delete own assessments"
    ON public.assessments
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE public.assessments IS 'Stores AI ROI assessment projects for users';
