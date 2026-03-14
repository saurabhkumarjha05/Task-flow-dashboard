import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  Zap, 
  ArrowRight,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: CheckCircle2,
    title: 'Smart Task Management',
    description: 'Organize your tasks with priority levels and status tracking.',
  },
  {
    icon: Clock,
    title: 'Local Storage',
    description: 'Your tasks are stored locally in your browser for instant access.',
  },
  {
    icon: Target,
    title: 'Priority-based Workflow',
    description: 'Focus on what matters most with intelligent priority sorting.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Blazing fast performance with no backend dependencies.',
  },
  {
    icon: Calendar,
    title: 'Task Creation',
    description: 'Create, edit, and delete tasks with a beautiful, intuitive interface.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track your productivity with comprehensive task statistics and insights.',
  },
];

const stats = [
  { label: 'Tasks Managed', value: 'Local' },
  { label: 'Data Privacy', value: '100%' },
  { label: 'Offline Access', value: 'Always' },
  { label: 'Speed', value: 'Instant' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                TaskFlow
                <span className="block text-primary">Smart Task Management</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Transform your productivity with intelligent task organization and powerful analytics. 
                The modern way to manage your work and achieve your goals - all stored locally in your browser.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
              <div className="relative mx-auto max-w-4xl">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      className="bg-card p-4 rounded-lg shadow-lg border"
                    >
                      <div className="h-2 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-2 bg-muted rounded w-full mb-2" />
                      <div className="h-2 bg-muted rounded w-2/3" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-foreground lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful Features for Modern Task Management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to manage tasks efficiently and boost productivity - all in your browser.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 text-center"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Transform Your Productivity?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/90">
                Join thousands of users who have already streamlined their workflow with TaskFlow's local task management.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-6">
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <Link to="/dashboard">
                    Start Using TaskFlow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made by Saurabh Kumar Jha | BTech CSE 2nd Year
          </p>
        </div>
      </footer>
    </div>
  );
}
