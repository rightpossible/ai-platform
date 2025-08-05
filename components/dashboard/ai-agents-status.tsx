import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Brain, 
  Target, 
  HeadphonesIcon,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Play,
  Pause,
  Settings,
  Activity
} from 'lucide-react';

export function AIAgentsStatus() {
  const agents = [
    {
      id: 'executive',
      name: 'Executive AI',
      description: 'Company monitoring & insights',
      icon: Brain,
      status: 'active',
      color: 'bg-purple-500',
      lastAction: 'Generated weekly report',
      lastActionTime: '5 minutes ago',
      tasksCompleted: 47,
      efficiency: 98
    },
    {
      id: 'marketing',
      name: 'Marketing AI',
      description: 'Campaign optimization',
      icon: Target,
      status: 'active',
      color: 'bg-pink-500',
      lastAction: 'Optimized ad campaign',
      lastActionTime: '2 minutes ago',
      tasksCompleted: 23,
      efficiency: 94
    },
    {
      id: 'sales',
      name: 'Sales AI',
      description: 'Lead qualification & CRM',
      icon: TrendingUp,
      status: 'active',
      color: 'bg-blue-500',
      lastAction: 'Qualified 3 new leads',
      lastActionTime: '1 minute ago',
      tasksCompleted: 156,
      efficiency: 96
    },
    {
      id: 'support',
      name: 'Customer Support AI',
      description: '24/7 customer assistance',
      icon: HeadphonesIcon,
      status: 'active',
      color: 'bg-green-500',
      lastAction: 'Resolved ticket #1247',
      lastActionTime: 'Just now',
      tasksCompleted: 89,
      efficiency: 97
    },
    {
      id: 'hr',
      name: 'HR AI',
      description: 'Recruitment & onboarding',
      icon: Users,
      status: 'paused',
      color: 'bg-orange-500',
      lastAction: 'Screened resumes',
      lastActionTime: '2 hours ago',
      tasksCompleted: 12,
      efficiency: 92
    },
    {
      id: 'finance',
      name: 'Finance AI',
      description: 'Automated accounting',
      icon: DollarSign,
      status: 'active',
      color: 'bg-emerald-500',
      lastAction: 'Processed 15 invoices',
      lastActionTime: '10 minutes ago',
      tasksCompleted: 234,
      efficiency: 99
    }
  ];

  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const avgEfficiency = Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-xs text-muted-foreground">Active Agents</p>
          <p className="text-xl font-bold text-foreground">{activeAgents}/6</p>
        </div>
        
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-xs text-muted-foreground">Tasks Completed</p>
          <p className="text-xl font-bold text-foreground">{totalTasks}</p>
        </div>
        
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-xs text-muted-foreground">Avg Efficiency</p>
          <p className="text-xl font-bold text-foreground">{avgEfficiency}%</p>
        </div>
      </div>

      {/* AI Agents List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">AI Agents Status</h3>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Manage All
          </Button>
        </div>
        
        <div className="space-y-3">
          {agents.map((agent) => {
            const IconComponent = agent.icon;
            
            return (
              <div 
                key={agent.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${agent.color} text-white flex-shrink-0`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground text-sm truncate">{agent.name}</h4>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full flex items-center space-x-1 flex-shrink-0 ${
                        agent.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                        }`}></div>
                        <span>{agent.status}</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {agent.lastAction} • {agent.lastActionTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{agent.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{agent.efficiency}%</p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 py-1 h-auto text-xs"
                    onClick={() => {}}
                  >
                    {agent.status === 'active' ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}