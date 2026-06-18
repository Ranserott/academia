import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const CourseSearch = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search for Python, React, AWS..." 
          className="w-full h-12 bg-secondary/50 border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>
      
      <div className="relative w-full md:w-48">
        <select className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm cursor-pointer">
          <option>Most Popular</option>
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};
