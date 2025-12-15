import { memo } from 'react';
import { Activity } from '@/types';
import { cn } from '@/lib/utils';
import { UserPlus, Edit, Package, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons = {
  client_created: UserPlus,
  client_updated: Edit,
  product_created: Package,
  sale_made: DollarSign,
};

const activityColors = {
  client_created: 'bg-success/10 text-success',
  client_updated: 'bg-primary/10 text-primary',
  product_created: 'bg-accent/10 text-accent',
  sale_made: 'bg-warning/10 text-warning',
};

/**
 * ActivityFeed: Componente que muestra el feed de actividades recientes
 * Memoizado para evitar re-renders innecesarios
 */
const ActivityFeed = memo(function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn('p-2 rounded-lg', activityColors[activity.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export { ActivityFeed };
