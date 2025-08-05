'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppGrid } from '@/components/dashboard/app-grid';
import { 
  Search, 
  Grid3X3,
  List
} from 'lucide-react';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Your Business Modules
        </h2>
        <p className="text-muted-foreground mt-1">
          Access and manage all your business applications
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search modules, AI agents, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-full">
              All Modules
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              AI Agents
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Recently Used
            </Button>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-l-full rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-r-full rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Apps Grid */}
      <AppGrid viewMode={viewMode} />
    </div>
  );
}