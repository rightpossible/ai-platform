import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export function FooterSection() {
  const productLinks = [
    { name: "Sales & CRM", href: "#" },
    { name: "Marketing Tools", href: "#" },
    { name: "Finance & Accounting", href: "#" },
    { name: "HR & Recruitment", href: "#" },
    { name: "Project Management", href: "#" },
    { name: "Customer Support", href: "#" }
  ];

  const aiAgentLinks = [
    { name: "Executive AI Agent", href: "#" },
    { name: "Marketing AI Agent", href: "#" },
    { name: "Sales AI Agent", href: "#" },
    { name: "Customer Service AI", href: "#" },
    { name: "Finance AI Agent", href: "#" },
    { name: "HR AI Agent", href: "#" }
  ];

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Partner Program", href: "#" }
  ];

  const resourceLinks = [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Video Tutorials", href: "#" },
    { name: "Webinars", href: "#" },
    { name: "Case Studies", href: "#" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR Compliance", href: "#" },
    { name: "Security", href: "#" },
    { name: "SLA", href: "#" }
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  AI Platform
                </h3>
                <p className="text-muted-foreground mb-4">
                  The complete business automation platform with 103+ modules 
                  and intelligent AI agents working 24/7 for your success.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">hello@aiplatform.com</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Business Modules
              </h4>
              <ul className="space-y-2">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Agents Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                AI Agents
              </h4>
              <ul className="space-y-2">
                {aiAgentLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-border">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-xl">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Stay Updated with AI Platform
              </h3>
              <p className="text-muted-foreground">
                Get the latest updates on new features, AI improvements, and business automation tips.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[250px]"
                />
                <Button>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 AI Platform. All rights reserved.
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <ul className="flex flex-wrap justify-center lg:justify-end space-x-6">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4 lg:space-y-0">
            <div className="flex items-center text-muted-foreground">
              <div className="w-6 h-6 bg-green-500 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-6 h-6 bg-blue-500 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs">🛡</span>
              </div>
              <span className="text-sm">GDPR Compliant</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-6 h-6 bg-purple-500 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
              <span className="text-sm">256-bit SSL</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-6 h-6 bg-orange-500 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span className="text-sm">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}