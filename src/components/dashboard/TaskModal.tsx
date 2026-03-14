import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task, TaskStatus, TaskPriority } from '@/hooks/useTasks';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (data: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; due_date?: string }) => Promise<void>;
}

export function TaskModal({ open, onOpenChange, task, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status as TaskStatus);
      setPriority((task.priority as TaskPriority) || 'medium');
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ 
        title: title.trim(), 
        description: description.trim() || undefined, 
        status,
        priority,
        due_date: dueDate || undefined
      });
      onOpenChange(false);
    } catch (err) {
      console.error('Task submission error:', err);
      // Error is already handled in the useTasks hook with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="h-10"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details…"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</Label>
            <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</Label>
            <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Saving…' : task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
