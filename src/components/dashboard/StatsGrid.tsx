import { ClipboardList, Clock, Loader2, CheckCircle2 } from 'lucide-react';

interface StatsGridProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const stats = [
  {
    label: 'Total Tasks',
    key: 'total' as const,
    icon: ClipboardList,
    iconColor: 'text-foreground',
    iconBg: 'bg-muted',
  },
  {
    label: 'Pending',
    key: 'pending' as const,
    icon: Clock,
    iconColor: 'text-status-pending',
    iconBg: 'bg-status-pending-bg',
  },
  {
    label: 'In Progress',
    key: 'inProgress' as const,
    icon: Loader2,
    iconColor: 'text-status-in-progress',
    iconBg: 'bg-status-in-progress-bg',
  },
  {
    label: 'Completed',
    key: 'completed' as const,
    icon: CheckCircle2,
    iconColor: 'text-status-completed',
    iconBg: 'bg-status-completed-bg',
  },
];

export function StatsGrid(props: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="bg-card p-4 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {props[stat.key]}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
