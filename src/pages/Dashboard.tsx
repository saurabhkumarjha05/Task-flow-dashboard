import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ClipboardList, Search } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { TaskModal } from '@/components/dashboard/TaskModal';
import { DeleteDialog } from '@/components/dashboard/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

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
          <header className="h-14 flex items-center border-b border-border bg-card px-4 shrink-0">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Greeting + New Task */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Welcome back, {greeting} 👋
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Here's an overview of your tasks
                  </p>
                </div>
                <Button
                  onClick={() => { setEditingTask(null); setModalOpen(true); }}
                  size="sm"
                  className="gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </div>

              {/* Stats */}
              <StatsGrid {...stats} />

              {/* Tasks Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">Your Tasks</h3>
                  {tasks.length > 0 && (
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl shadow-card">
                    <ClipboardList className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {search ? 'No tasks match your search' : 'No tasks yet'}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {search ? 'Try a different search term' : 'Click "New Task" to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
