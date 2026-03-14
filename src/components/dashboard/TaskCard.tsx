import { motion } from 'framer-motion';
import type { Task } from '@/hooks/useTasks';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-status-pending-bg text-status-pending border-transparent hover:bg-status-pending-bg/80',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-in-progress-bg text-status-in-progress border-transparent hover:bg-status-in-progress-bg/80',
  },
  completed: {
    label: 'Completed',
    className: 'bg-status-completed-bg text-status-completed border-transparent hover:bg-status-completed-bg/80',
  },
};

const nextStatus: Record<string, string> = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const config = statusConfig[task.status] || statusConfig.pending;

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="group bg-card p-4 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-foreground leading-tight pr-2">
          {task.title}
        </h4>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-0.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
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
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <Badge
          onClick={() => onStatusChange(task, nextStatus[task.status] || 'pending')}
          className={`cursor-pointer text-[10px] font-bold uppercase tracking-wider ${config.className}`}
        >
          {config.label}
        </Badge>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground tabular-nums">
          <Calendar className="h-3 w-3" />
          {new Date(task.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
