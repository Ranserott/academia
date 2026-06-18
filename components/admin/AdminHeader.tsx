"use client";

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <header className="h-20 border-b border-border bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-64 h-10 bg-secondary/30 border border-border rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-slate-950"></span>
        </button>
      </div>
    </header>
  );
};
