"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { CourseTable } from "@/components/admin/CourseTable";
import { LessonManager } from "@/components/admin/LessonManager";
import {
  DollarSign,
  Users,
  Trophy,
  FileText,
} from "lucide-react";

export default function AdminCoursesPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Courses Overview" />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Revenue"
              value="$124,500"
              change="+12.5%"
              trend="up"
              icon={DollarSign}
            />
            <StatsCard
              title="Active Students"
              value="3,420"
              change="+5.2%"
              trend="up"
              icon={Users}
            />
            <StatsCard
              title="Completion Rate"
              value="68.4%"
              change="-2.1%"
              trend="down"
              icon={Trophy}
            />
            <StatsCard
              title="Total Courses"
              value="45"
              change="0%"
              trend="neutral"
              icon={FileText}
            />
          </div>

          {/* Lesson Manager */}
          <LessonManager />

          {/* Courses Table */}
          <CourseTable courses={[]} />

          {/* Footer Branding */}
          <footer className="pt-8 pb-4 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Academia Inc. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
