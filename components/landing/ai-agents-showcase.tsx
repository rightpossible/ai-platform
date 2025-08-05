import { 
  Bot, 
  Brain, 
  Target, 
  HeadphonesIcon,
  TrendingUp,
  Users,
  DollarSign,
  Shield
} from 'lucide-react';

export function AIAgentsShowcaseSection() {
  const agents = [
    {
      title: "Executive AI Agent",
      description: "Real-time company monitoring, executive briefings, and strategic insights to keep leadership informed.",
      icon: Brain,
      features: ["Company KPI Monitoring", "Executive Dashboards", "Strategic Alerts", "Performance Reports"],
      status: "Active 24/7",
      color: "bg-purple-500"
    },
    {
      title: "Marketing AI Agent",
      description: "Campaign automation, SEO optimization, content generation, and customer acquisition intelligence.",
      icon: Target,
      features: ["Campaign Optimization", "Content Generation", "SEO Automation", "Lead Attribution"],
      status: "5 Campaigns Running",
      color: "bg-pink-500"
    },
    {
      title: "Sales AI Agent",
      description: "Lead qualification, CRM automation, deal tracking, and revenue forecasting with predictive analytics.",
      icon: TrendingUp,
      features: ["Lead Qualification", "Deal Scoring", "Pipeline Analysis", "Revenue Forecasting"],
      status: "15 Leads Qualified",
      color: "bg-blue-500"
    },
    {
      title: "Customer Service AI",
      description: "AI chatbots, sentiment analysis, ticket routing, and 24/7 customer support automation.",
      icon: HeadphonesIcon,
      features: ["Smart Chatbots", "Sentiment Analysis", "Ticket Routing", "Response Automation"],
      status: "98% Satisfaction",
      color: "bg-green-500"
    },
    {
      title: "HR & Recruitment AI",
      description: "Resume screening, employee onboarding, performance tracking, and workforce analytics.",
      icon: Users,
      features: ["Resume Screening", "Onboarding Automation", "Performance Tracking", "Workforce Analytics"],
      status: "12 Candidates Screened",
      color: "bg-orange-500"
    },
    {
      title: "Finance AI Agent",
      description: "Invoice processing, expense management, financial reporting, and compliance monitoring.",
      icon: DollarSign,
      features: ["Invoice Processing", "Expense Automation", "Financial Reports", "Compliance Checks"],
      status: "100% Accurate",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section className="py-16 bg-muted/30" id="ai-agents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-primary mr-3" />
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              AI-Powered Automation
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Meet Your AI Business Agents
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Intelligent agents working 24/7 to automate your business processes, 
            provide insights, and optimize operations across every department.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => {
            const IconComponent = agent.icon;
            return (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${agent.color} text-white`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex items-center text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    {agent.status}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {agent.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {agent.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {agent.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Interaction Hint */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Enterprise-grade security & privacy
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Your Personal AI Workforce
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              These AI agents learn from your business patterns and continuously improve. 
              They handle routine tasks so your team can focus on growth and innovation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Always Working</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Task Automation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">60%</div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10x</div>
                <div className="text-sm text-muted-foreground">Faster Processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}