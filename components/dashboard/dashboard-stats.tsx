import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export function DashboardStats() {
  const stats = [
    {
      title: "Active Modules",
      value: "24",
      change: "+3",
      changeType: "increase" as const,
      description: "modules this month",
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "AI Agents Running",
      value: "8",
      change: "+2",
      changeType: "increase" as const,
      description: "new agents deployed",
      icon: Activity,
      color: "text-green-600 bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Team Members",
      value: "12",
      change: "+4",
      changeType: "increase" as const,
      description: "members this month",
      icon: Users,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Cost Savings",
      value: "$1,847",
      change: "+$245",
      changeType: "increase" as const,
      description: "saved this month",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const ChangeIcon = stat.changeType === 'increase' ? ArrowUpRight : ArrowDownRight;
        
        return (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <ChangeIcon className={`h-4 w-4 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}