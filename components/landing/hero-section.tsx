import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32" id="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-3xl md:mx-auto lg:col-span-7 lg:text-left">
            <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              All Your Business Tools.
              <span className="block text-primary">One AI Platform.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:mt-8 sm:text-xl lg:text-xl">
              Combine 103+ business modules with AI-powered agents in one unified platform. 
              From CRM to finance, marketing to HR - everything your business needs, 
              intelligently automated.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg rounded-full px-8 py-6 h-auto"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg rounded-full px-8 py-6 h-auto"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Book a Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                99.9% Uptime
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                1000+ Businesses
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                SOC 2 Compliant
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-5 lg:flex lg:items-center">
            <div className="relative w-full">
              {/* Dashboard Preview */}
              <div className="bg-card border border-border rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">AI Platform Dashboard</div>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded mb-2"></div>
                      <div className="text-xs font-medium">CRM</div>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded mb-2"></div>
                      <div className="text-xs font-medium">Finance</div>
                    </div>
                    <div className="bg-accent p-3 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded mb-2"></div>
                      <div className="text-xs font-medium">Marketing</div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">AI Agent Activity</div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">✓ Lead qualification completed</div>
                      <div className="text-xs text-muted-foreground">✓ Invoice processed automatically</div>
                      <div className="text-xs text-muted-foreground">⚡ Marketing campaign optimized</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium animate-bounce">
                AI Powered
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                103+ Modules
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}