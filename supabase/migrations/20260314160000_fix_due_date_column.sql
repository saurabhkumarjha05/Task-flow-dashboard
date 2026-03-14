-- Fix due_date column and ensure it's properly added
-- This migration ensures the due_date column exists with correct type

DO $$
BEGIN
    -- Check if due_date column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'due_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tasks 
        ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
        
        -- Create index for due_date queries
        CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
    END IF;

    -- Ensure priority column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'priority'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tasks 
        ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';
        
        -- Create index for priority queries
        CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
    END IF;
END $$;

-- Update the table comment to reflect the new schema
COMMENT ON TABLE public.tasks IS 'Tasks table with priority and due_date support';

-- Verify the schema
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;
