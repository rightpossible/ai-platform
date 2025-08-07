import { connectDB } from './connection';
import { App } from './schemas/app';

export async function seedErpNextApp() {
  await connectDB();

  // Check if ERPNext app already exists
  const existingApp = await App.findOne({ slug: 'erpnext-business-suite' });
  if (existingApp) {
    console.log('✅ ERPNext app already exists');
    return existingApp;
  }

  // Create ERPNext app
  const erpNextApp = {
    name: 'All-in-One Business Pro',
    slug: 'erpnext-business-suite',
    ssoUrl: '/api/erpnext/create-site', // Special endpoint for ERPNext
    description: 'Complete business management platform with CRM, HR, Accounting, Project Management, and more',
    status: 'active' as const,
    icon: 'Building2',
    color: 'bg-gradient-to-r from-blue-600 to-purple-600',
    
    // Plan-related fields
    requiresPlan: true,
    minimumPlanLevel: 2, // Pro plan required
    category: 'business',
    
    // Enhanced catalog fields
    shortDescription: 'Your complete business management suite - CRM, HR, Accounting, Projects & more in one platform',
    longDescription: `Transform your business with ERPNext - the world's most comprehensive open-source business platform. Get access to:

• **CRM & Sales** - Lead management, opportunities, customer tracking
• **Human Resources** - Employee management, payroll, leave tracking  
• **Accounting & Finance** - Invoicing, payments, financial reports
• **Project Management** - Tasks, timesheets, project tracking
• **Inventory Management** - Stock tracking, warehouses, purchase orders
• **Customer Support** - Ticketing system, knowledge base
• **Analytics & Reports** - Business intelligence and custom reports
• **Document Management** - File storage and collaboration

When you activate this app, we'll create your personal business platform that you can access anytime. Perfect for small to medium businesses looking for an all-in-one solution.

**Note:** This creates a dedicated business platform for your organization. Setup takes 3-5 minutes and includes all modules ready to use.`,
    
    screenshots: [
      '/images/erpnext/dashboard.png',
      '/images/erpnext/crm.png', 
      '/images/erpnext/accounting.png',
      '/images/erpnext/projects.png'
    ],
    
    features: [
      'Customer Relationship Management (CRM)',
      'Human Resource Management (HR)',
      'Accounting & Financial Management',
      'Project Management & Timesheets',
      'Inventory & Warehouse Management',
      'Customer Support & Ticketing',
      'Business Analytics & Reports',
      'Document Management System',
      'Multi-user Collaboration',
      'Mobile-responsive Interface',
      'Custom Forms & Workflows',
      'Email Integration'
    ],
    
    tags: [
      'ERP',
      'CRM', 
      'HR',
      'Accounting',
      'Projects',
      'Inventory',
      'Business',
      'All-in-One',
      'Enterprise'
    ],
    
    website: 'https://erpnext.com',
    supportUrl: 'https://docs.erpnext.com',
    integrationStatus: 'ready' as const,
    popularity: 95,
    rating: 4.8,
    isPopular: true,
    isFeatured: true,
    launchInNewTab: true
  };

  const createdApp = await App.create(erpNextApp);
  console.log('✅ Created ERPNext app:', createdApp.name);
  
  return createdApp;
}
