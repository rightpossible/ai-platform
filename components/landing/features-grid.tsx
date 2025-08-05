import { 
  TrendingUp, 
  CreditCard, 
  Users, 
  Code2,
  MessageSquare,
  BarChart3,
  Calendar,
  Building2
} from 'lucide-react';

export function FeaturesGridSection() {
  const features = [
    {
      title: "Sales & Marketing AI",
      description: "CRM automation, lead qualification, campaign optimization, and customer journey mapping powered by intelligent agents.",
      icon: TrendingUp,
      items: ["Smart CRM", "Lead Scoring", "Email Campaigns", "Sales Analytics"],
      color: "bg-blue-500"
    },
    {
      title: "Finance & Operations",
      description: "Automated accounting, payroll processing, inventory management, and financial reporting with real-time insights.",
      icon: CreditCard,
      items: ["Automated Books", "Smart Payroll", "Inventory AI", "Financial Reports"],
      color: "bg-green-500"
    },
    {
      title: "Collaboration Suite",
      description: "Unified communication, document management, video meetings, and team workspace with AI-powered productivity.",
      icon: Users,
      items: ["Team Chat", "File Sharing", "Video Meetings", "Smart Calendar"],
      color: "bg-purple-500"
    },
    {
      title: "Developer & Analytics",
      description: "API management, workflow automation, business intelligence, and custom app creation with low-code tools.",
      icon: Code2,
      items: ["API Builder", "Workflow AI", "Custom Reports", "App Creator"],
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-16 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Everything Your Business Needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Replace dozens of expensive tools with one intelligent platform. 
            Each module works seamlessly together, powered by AI agents.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${feature.color} text-white flex-shrink-0`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex}
                          className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="bg-muted/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Plus 95+ More Specialized Modules
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "HR & Recruiting", icon: Building2 },
              { name: "Customer Support", icon: MessageSquare },
              { name: "Project Management", icon: Calendar },
              { name: "Business Intelligence", icon: BarChart3 },
              { name: "E-commerce", icon: TrendingUp },
              { name: "Legal & Compliance", icon: Building2 }
            ].map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors duration-200"
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium text-foreground">
                    {module.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              And many more modules covering every aspect of your business operations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}