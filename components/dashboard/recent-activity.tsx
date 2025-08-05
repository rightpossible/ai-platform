import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Mail,
  DollarSign,
  Users,
  Bot,
  ExternalLink,
  Filter
} from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: 'Marketing Campaign Optimized',
      description: 'AI Marketing Agent improved CTR by 23% for "Q1 Product Launch" campaign',
      timestamp: '2 minutes ago',
      module: 'Marketing AI',
      moduleColor: 'bg-pink-500'
    },
    {
      id: 2,
      type: 'success',
      icon: DollarSign,
      title: 'Invoices Processed',
      description: 'Finance AI automatically processed 15 invoices totaling $47,890',
      timestamp: '5 minutes ago',
      module: 'Finance AI',
      moduleColor: 'bg-green-500'
    },
    {
      id: 3,
      type: 'info',
      icon: Users,
      title: 'New Team Member Added',
      description: 'Sarah Chen joined the Marketing team and gained access to 12 modules',
      timestamp: '10 minutes ago',
      module: 'HR Management',
      moduleColor: 'bg-orange-500'
    },
    {
      id: 4,
      type: 'success',
      icon: Bot,
      title: 'Customer Support Ticket Resolved',
      description: 'Support AI resolved ticket #1247 with 98% customer satisfaction',
      timestamp: '15 minutes ago',
      module: 'Support AI',
      moduleColor: 'bg-blue-500'
    },
    {
      id: 5,
      type: 'warning',
      icon: AlertCircle,
      title: 'API Rate Limit Warning',
      description: 'CRM integration approaching rate limit. Consider upgrading plan.',
      timestamp: '30 minutes ago',
      module: 'CRM',
      moduleColor: 'bg-purple-500'
    },
    {
      id: 6,
      type: 'success',
      icon: TrendingUp,
      title: 'Sales Lead Qualified',
      description: 'Sales AI qualified 3 new leads with high conversion probability',
      timestamp: '45 minutes ago',
      module: 'Sales AI',
      moduleColor: 'bg-cyan-500'
    },
    {
      id: 7,
      type: 'info',
      icon: Mail,
      title: 'Email Campaign Sent',
      description: 'Newsletter sent to 2,847 subscribers with 24% open rate',
      timestamp: '1 hour ago',
      module: 'Email Marketing',
      moduleColor: 'bg-indigo-500'
    },
    {
      id: 8,
      type: 'success',
      icon: CheckCircle,
      title: 'Weekly Report Generated',
      description: 'Executive AI compiled comprehensive business insights for week ending today',
      timestamp: '2 hours ago',
      module: 'Executive AI',
      moduleColor: 'bg-purple-600'
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your modules and AI agents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.slice(0, 6).map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <div className={`p-1.5 rounded-full ${getActivityColor(activity.type)} flex-shrink-0`}>
                <IconComponent className="h-3 w-3" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-xs font-medium text-foreground leading-tight">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-tight mb-1">
                  {activity.description}
                </p>
                <span className={`inline-block px-1.5 py-0.5 text-xs rounded-full text-white ${activity.moduleColor}`}>
                  {activity.module}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">23</p>
            <p className="text-xs text-muted-foreground">Completed Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-xs text-muted-foreground">AI Actions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">2</p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
        </div>
      </div>
    </Card>
  );
}