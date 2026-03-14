import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus, TaskPriority, createTask as createTaskUtil, updateTask as updateTaskUtil, deleteTask as deleteTaskUtil, getTasks } from '@/utils/localStorageManager';

export type { Task, TaskStatus, TaskPriority };

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  const fetchTasks = useCallback(() => {
    try {
      setLoading(true);
      const storedTasks = getTasks();
      setTasks(storedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = createTaskUtil(taskData);
      setTasks(prev => [newTask, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Update an existing task
  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      const updatedTask = updateTaskUtil(id, updates);
      if (!updatedTask) {
        throw new Error('Task not found');
      }
      
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      const success = deleteTaskUtil(id);
      if (!success) {
        throw new Error('Task not found');
      }
      
      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Calculate statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return { 
    tasks, 
    loading, 
    stats, 
    createTask, 
    updateTask, 
    deleteTask, 
    fetchTasks 
  };
}
