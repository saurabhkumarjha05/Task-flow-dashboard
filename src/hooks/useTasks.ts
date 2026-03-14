import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getSchemaErrorMessage } from '@/lib/db-schema-check';

export type Task = Tables<'tasks'>;
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskInsert = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        setTasks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch tasks',
          variant: 'destructive',
        });
        setTasks([]);
        return;
      }
      setTasks(data || []);
    } catch (error) {
      console.error('Unexpected error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const createTask = async (task: TaskInsert) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Prepare the task data with proper null handling
      const taskData = {
        title: task.title,
        description: task.description || null,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString() : null,
        user_id: user.id,
      };

      const { error } = await supabase.from('tasks').insert(taskData);
      if (error) {
        console.error('Error creating task:', error);
        toast({
          title: 'Error',
          description: getSchemaErrorMessage(error),
          variant: 'destructive',
        });
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: getSchemaErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskInsert>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Prepare the update data with proper null handling
      const updateData = {
        ...updates,
        due_date: updates.due_date ? new Date(updates.due_date).toISOString() : null,
      };

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: 'Error',
          description: getSchemaErrorMessage(error),
          variant: 'destructive',
        });
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: getSchemaErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return { tasks, loading, stats, createTask, updateTask, deleteTask, fetchTasks };
}
