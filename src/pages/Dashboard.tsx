import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ClipboardList } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { TaskModal } from '@/components/dashboard/TaskModal';
import { DeleteDialog } from '@/components/dashboard/DeleteDialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import type { Task, TaskStatus } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading, stats, createTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleCreate = async (data: { title: string; description?: string; status?: TaskStatus }) => {
    await createTask(data);
    toast({ title: 'Task created' });
  };

  const handleUpdate = async (data: { title: string; description?: string; status?: TaskStatus }) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, data);
    toast({ title: 'Task updated' });
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    await deleteTask(deletingTask.id);
    setDeletingTask(null);
    toast({ title: 'Task deleted' });
  };

  const handleStatusChange = async (task: Task, status: string) => {
    await updateTask(task.id, { status: status as TaskStatus });
  };

  const greeting = user?.email?.split('@')[0] || 'there';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b px-4 shrink-0">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Greeting */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Hello, {greeting}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Here's your task overview
                  </p>
                </div>
                <Button
                  onClick={() => { setEditingTask(null); setModalOpen(true); }}
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </div>

              {/* Stats */}
              <StatsGrid {...stats} />

              {/* Tasks */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ClipboardList className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Create your first task to get started</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {tasks.map(task => (
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
          </main>
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
    </SidebarProvider>
  );
}
