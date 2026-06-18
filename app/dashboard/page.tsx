"use client";

import React from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentDashboard } from '@/components/student/StudentDashboard';

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-blue-600/30">
      {/* Student Sidebar Navigation */}
      <StudentSidebar />

      {/* Main Student Dashboard Content */}
      <StudentDashboard />
    </div>
  );
}
