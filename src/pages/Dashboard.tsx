import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ClipboardList, Search } from 'lucide-react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { TaskModal } from '@/components/dashboard/TaskModal';
import { DeleteDialog } from '@/components/dashboard/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks/useTasks';
import type { Task, TaskStatus, TaskPriority } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { tasks, loading, stats, createTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data: { title: string; description: string; status: TaskStatus; priority: TaskPriority }) => {
    await createTask(data);
  };

  const handleUpdate = async (data: { title: string; description: string; status: TaskStatus; priority: TaskPriority }) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, data);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    await deleteTask(deletingTask.id);
    setDeletingTask(null);
  };

  const handleStatusChange = async (task: Task, status: string) => {
    await updateTask(task.id, { status: status as TaskStatus });
  };

  const greeting = "there";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {greeting} 👋
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Here's an overview of your tasks
              </p>
            </div>
            <Button
              onClick={() => { setEditingTask(null); setModalOpen(true); }}
              size="lg"
              className="gap-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Stats */}
          <StatsGrid {...stats} />

          {/* Tasks Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-foreground">Your Tasks</h2>
              {tasks.length > 0 && (
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ClipboardList className="h-16 w-16 text-muted-foreground/30 mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {search ? 'No tasks match your search' : 'No tasks yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {search ? 'Try a different search term' : 'Click "New Task" to get started'}
                </p>
                {!search && (
                  <Button
                    onClick={() => { setEditingTask(null); setModalOpen(true); }}
                    size="lg"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Task
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={t => { setEditingTask(t); setModalOpen(true); }}
                      onDelete={t => setDeletingTask(t)}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editingTask}
        onSubmit={editingTask ? handleUpdate : handleCreate}
      />
      <DeleteDialog
        open={!!deletingTask}
        onOpenChange={open => !open && setDeletingTask(null)}
        taskTitle={deletingTask?.title || ''}
        onConfirm={handleDelete}
      />
    </div>
  );
}
