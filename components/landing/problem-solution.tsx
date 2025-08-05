import { CheckCircle, XCircle } from 'lucide-react';

export function ProblemSolutionSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Stop Juggling Multiple Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Most businesses waste time and money managing dozens of disconnected tools. 
            Our AI platform brings everything together.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Problem Side */}
          <div className="mb-12 lg:mb-0">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center">
                <XCircle className="mr-3 h-6 w-6" />
                The Old Way
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <XCircle className="mr-3 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">
                    <strong>$500-2000/month</strong> on multiple SaaS subscriptions
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-3 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">
                    <strong>Hours wasted</strong> switching between 15+ different tools
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-3 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">
                    <strong>Data silos</strong> preventing intelligent automation
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-3 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">
                    <strong>Manual processes</strong> eating up productive time
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-3 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">
                    <strong>No unified reporting</strong> across business functions
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Side */}
          <div>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center">
                <CheckCircle className="mr-3 h-6 w-6" />
                The AI Platform Way
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    <strong>One affordable subscription</strong> replaces 10+ tools
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    <strong>Unified dashboard</strong> for all business operations
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    <strong>AI agents</strong> automate repetitive tasks 24/7
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    <strong>Intelligent insights</strong> from connected data
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    <strong>Real-time analytics</strong> across all business functions
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Save 60% on Tool Costs + 20 Hours/Week
            </h3>
            <p className="text-muted-foreground mb-6">
              Join 1000+ businesses that switched to our all-in-one AI platform
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$89</div>
                <div>vs $500+ before</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">20hrs</div>
                <div>saved per week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">103+</div>
                <div>tools in one</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}