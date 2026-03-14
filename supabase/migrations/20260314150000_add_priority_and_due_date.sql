-- Add priority column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';

-- Add due_date column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;

-- Create index for priority queries
CREATE INDEX idx_tasks_priority ON public.tasks(priority);

-- Create index for due_date queries
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
