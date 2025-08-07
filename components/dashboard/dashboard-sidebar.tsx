'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Mail,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  Building2,
  ShoppingCart,
  Phone,
  Code2,
  Database,
  Briefcase,
  Globe,
  Shield,
  Bot,
  ChevronDown,
  ChevronRight,
  Star,
  Plus,
  CircleIcon,
  LogOut,
  Bell,
  HelpCircle
} from 'lucide-react';
import { SubscriptionWidget } from './subscription-widget';
import { Card } from '@/components/ui/card';

export function DashboardSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['favorites', 'ai-agents']);
  const { user } = useUser();
  const pathname = usePathname();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  type NavigationItem = {
    name: string;
    icon: any;
    href: string;
    badge?: string;
    status?: string;
  };

  type NavigationSection = {
    id: string;
    title: string;
    expandable?: boolean;
    items: NavigationItem[];
  };

  const navigationSections: NavigationSection[] = [
    {
      id: 'main',
      title: 'Main',
      items: [
        { name: 'Dashboard', icon: Home, href: '/dashboard' },
        { name: 'App Discovery', icon: Star, href: '/apps/discover' },
        { name: 'Business Platform', icon: Building2, href: '/dashboard/erpnext-credentials' },
        { name: 'Manage Plans', icon: CreditCard, href: '/pricing' },
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' }
      ]
    },
    {
      id: 'favorites',
      title: 'Favorites',
      expandable: true,
      items: [
        { name: 'CRM & Sales', icon: TrendingUp, href: '/crm', badge: '5' },
        { name: 'Finance', icon: CreditCard, href: '/finance', badge: 'AI' },
        { name: 'Email Marketing', icon: Mail, href: '/email', badge: 'AI' },
        { name: 'Customer Support', icon: MessageSquare, href: '/support', badge: 'AI' }
      ]
    },
    {
      id: 'ai-agents',
      title: 'AI Agents',
      expandable: true,
      items: [
        { name: 'Executive AI', icon: Bot, href: '/ai/executive', status: 'active' },
        { name: 'Marketing AI', icon: Bot, href: '/ai/marketing', status: 'active' },
        { name: 'Sales AI', icon: Bot, href: '/ai/sales', status: 'active' },
        { name: 'Support AI', icon: Bot, href: '/ai/support', status: 'active' },
        { name: 'Finance AI', icon: Bot, href: '/ai/finance', status: 'active' },
        { name: 'HR AI', icon: Bot, href: '/ai/hr', status: 'paused' }
      ]
    },
    {
      id: 'business',
      title: 'Business Modules',
      expandable: true,
      items: [
        { name: 'Sales & CRM', icon: TrendingUp, href: '/modules/sales' },
        { name: 'Marketing', icon: Globe, href: '/modules/marketing' },
        { name: 'Finance & Accounting', icon: CreditCard, href: '/modules/finance' },
        { name: 'HR & Recruitment', icon: Users, href: '/modules/hr' },
        { name: 'Customer Support', icon: MessageSquare, href: '/modules/support' },
        { name: 'Project Management', icon: Briefcase, href: '/modules/projects' },
        { name: 'E-commerce', icon: ShoppingCart, href: '/modules/ecommerce' },
        { name: 'Communication', icon: Phone, href: '/modules/communication' }
      ]
    },
    {
      id: 'productivity',
      title: 'Productivity',
      expandable: true,
      items: [
        { name: 'Calendar', icon: Calendar, href: '/productivity/calendar' },
        { name: 'Documents', icon: FileText, href: '/productivity/documents' },
        { name: 'File Storage', icon: Database, href: '/productivity/storage' }
      ]
    },
    {
      id: 'developer',
      title: 'Developer Tools',
      expandable: true,
      items: [
        { name: 'API Management', icon: Code2, href: '/developer/api' },
        { name: 'Integrations', icon: Globe, href: '/developer/integrations' },
        { name: 'Security', icon: Shield, href: '/developer/security' }
      ]
    }
  ];

  return (
    <div className="w-64 bg-background border-r border-border h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CircleIcon className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-foreground">AI Platform</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.picture} alt={user?.name || 'User'} />
                  <AvatarFallback className="text-xs">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/auth/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationSections.map((section) => (
          <div key={section.id}>
            {section.expandable ? (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  onClick={() => toggleSection(section.id)}
                >
                  {section.title}
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                
                {expandedSections.includes(section.id) && (
                  <div className="ml-2 mt-1 space-y-1">
                    {section.items.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Button
                          key={item.name}
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start text-sm h-8 px-2"
                          asChild
                        >
                          <a href={item.href}>
                            <IconComponent className="mr-2 h-4 w-4" />
                            <span className="truncate flex-1 text-left">{item.name}</span>
                            {'badge' in item && item.badge && (
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                item.badge === 'AI' 
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                            {'status' in item && item.status && (
                              <div className={`w-2 h-2 rounded-full ${
                                item.status === 'active' 
                                  ? 'bg-green-500 animate-pulse' 
                                  : 'bg-yellow-500'
                              }`}></div>
                            )}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider p-2">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start text-sm h-8 px-2"
                        asChild
                      >
                        <a href={item.href}>
                          <IconComponent className="mr-2 h-4 w-4" />
                          <span className="truncate">{item.name}</span>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Subscription Widget */}
        <div className="p-4 border-t mt-auto">
          <SubscriptionWidget />
        </div>
      </div>
    </div>
  );
}