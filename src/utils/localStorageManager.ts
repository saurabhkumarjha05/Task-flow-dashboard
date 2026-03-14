export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

const STORAGE_KEY = 'taskflow_tasks';

// Get all tasks from localStorage
export const getTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    if (!tasksJson) return [];
    
    const tasks = JSON.parse(tasksJson);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
    return [];
  }
};

// Save all tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Create a new task
export const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    ...taskData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

// Update an existing task
export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = { ...tasks[taskIndex], ...updates };
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

// Delete a task
export const deleteTask = (id: string): boolean => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};

// Clear all tasks
export const clearTasks = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
