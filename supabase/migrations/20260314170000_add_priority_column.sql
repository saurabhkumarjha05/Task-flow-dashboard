-- Add priority column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';

-- Create index for priority queries
CREATE INDEX idx_tasks_priority ON public.tasks(priority);

-- Verify the schema
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;
