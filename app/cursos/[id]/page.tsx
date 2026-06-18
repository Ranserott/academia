"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CourseHeroDetail } from '@/components/course-detail/CourseHeroDetail';
import { CourseContentDetail } from '@/components/course-detail/CourseContentDetail';
import { FileText, Star, Layout } from 'lucide-react';

// Mock data for a single course
const courseData = {
  id: '1',
  title: 'Mastering Large-Scale System Design',
  instructor: 'Alex Chen',
  rating: 4.8,
  reviews: '2,340',
  price: '$129.00',
  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
};

const tabs = [
  { id: 'description', label: 'Description', icon: Layout },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = React.useState('description');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main>
        <CourseHeroDetail course={courseData} />

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content: Tabs and Details */}
            <div className="lg:col-span-2">
              {/* Tabs Navigation */}
              <div className="flex border-b border-border mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative min-w-max ${
                      activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'description' && <CourseContentDetail />}
                {activeTab === 'resources' && (
                  <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                    <p className="text-muted-foreground">Resources are available after enrollment.</p>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content: Sidebar (already handled in CourseHeroDetail but can add extra widgets here) */}
            <div className="hidden lg:block">
              {/* Extra widgets could go here */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
