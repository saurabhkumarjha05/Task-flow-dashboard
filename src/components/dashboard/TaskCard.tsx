import { motion } from 'framer-motion';
import type { Task } from '@/hooks/useTasks';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: string) => void;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-status-pending-bg text-status-pending',
  'in-progress': 'bg-status-in-progress-bg text-status-in-progress',
  completed: 'bg-status-completed-bg text-status-completed',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const nextStatus: Record<string, string> = {
    pending: 'in-progress',
    'in-progress': 'completed',
    completed: 'pending',
  };

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2 }}
      className="group bg-card p-4 rounded-xl shadow-card transition-shadow hover:shadow-card-hover will-change-transform"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-foreground leading-tight">
          {task.title}
        </h4>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-0.5 ml-2 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onStatusChange(task, nextStatus[task.status] || 'pending')}
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full cursor-pointer transition-colors ${statusStyles[task.status] || statusStyles.pending}`}
        >
          {task.status.replace('-', ' ')}
        </button>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {new Date(task.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
