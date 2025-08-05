import { Star, Quote, CheckCircle } from 'lucide-react';

export function SocialProofSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechStart Inc.",
      company: "TechStart Inc.",
      content: "Switched from 12 different tools to this platform. Saved us $2000/month and our team is 3x more productive. The AI agents handle everything automatically.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Director",
      company: "GrowthCorp",
      content: "The financial AI agent alone pays for the entire platform. Automated our invoice processing and eliminated manual errors completely.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Foster",
      role: "Marketing Manager",
      company: "Digital Agency Pro",
      content: "Our marketing campaigns are now optimized 24/7 by AI. Lead quality improved by 400% and conversion rates doubled in just 3 months.",
      rating: 5,
      avatar: "EF"
    }
  ];

  const stats = [
    { value: "1,000+", label: "Businesses Trust Us" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "$2.5M+", label: "Saved in Tool Costs" },
    { value: "24/7", label: "AI Agent Support" }
  ];

  const certifications = [
    { name: "SOC 2 Type II", icon: "🔒" },
    { name: "GDPR Compliant", icon: "🛡️" },
    { name: "ISO 27001", icon: "🏆" },
    { name: "PCI DSS", icon: "💳" }
  ];

  return (
    <section className="py-16 bg-background" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Trusted by Growing Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Join thousands of companies that transformed their operations with our AI platform
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <Quote className="h-5 w-5 text-primary mb-2" />
                  <p className="text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Enterprise-Grade Security & Compliance
            </h3>
            <p className="text-muted-foreground">
              Your data is protected by industry-leading security standards
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors duration-200"
              >
                <div className="text-2xl mb-2">{cert.icon}</div>
                <div className="font-medium text-foreground">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Logos/Names */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">
            Trusted by innovative companies worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 opacity-60">
            {[
              "TechStart Inc.", "GrowthCorp", "Digital Agency Pro", 
              "Innovate Labs", "Future Systems", "Scale Dynamics"
            ].map((company, index) => (
              <div 
                key={index}
                className="bg-muted rounded-lg p-4 flex items-center justify-center font-medium text-sm"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Real Results from Real Customers
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-2">Average 60% Cost Savings</div>
              <p className="text-muted-foreground text-sm">
                Businesses save thousands monthly by consolidating tools
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-2">3x Productivity Increase</div>
              <p className="text-muted-foreground text-sm">
                AI automation frees up 20+ hours per week per employee
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-2">2 Week ROI Average</div>
              <p className="text-muted-foreground text-sm">
                Most customers see positive ROI within the first month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}