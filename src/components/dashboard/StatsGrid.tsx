interface StatsGridProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const stats = [
  { label: 'Total Tasks', key: 'total' as const, color: 'text-foreground' },
  { label: 'Pending', key: 'pending' as const, color: 'text-status-pending' },
  { label: 'In Progress', key: 'inProgress' as const, color: 'text-status-in-progress' },
  { label: 'Completed', key: 'completed' as const, color: 'text-status-completed' },
];

export function StatsGrid(props: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(stat => (
        <div key={stat.key} className="bg-card p-4 rounded-xl shadow-card">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            {stat.label}
          </p>
          <p className={`text-2xl font-semibold tabular-nums ${stat.color}`}>
            {props[stat.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
