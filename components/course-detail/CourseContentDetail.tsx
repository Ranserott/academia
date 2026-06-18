"use client";

import React from 'react';
import { CheckCircle2, Play, Lock, ChevronDown, ChevronUp } from 'lucide-react';

const curriculum = [
  {
    title: 'Module 1: Introduction & Fundamentals',
    lessons: '3 Lessons • 45m total',
    items: [
      { title: '1. Why System Design Matters', duration: '12:30', isPreview: true },
      { title: '2. Horizontal vs Vertical Scaling', duration: '15:45', isPreview: false },
      { title: '3. CAP Theorem Explained', duration: '16:45', isPreview: false },
    ]
  },
  {
    title: 'Module 2: Networking Deep Dive',
    lessons: '5 Lessons • 1h 20m total',
    items: [
      { title: '4. DNS and How it Works', duration: '10:15', isPreview: false },
      { title: '5. Load Balancers 101', duration: '18:20', isPreview: false },
    ]
  },
  {
    title: 'Module 3: Database Strategies',
    lessons: '4 Lessons • 55m total',
    items: [
      { title: '6. SQL vs NoSQL', duration: '14:30', isPreview: false },
      { title: '7. Database Sharding', duration: '20:10', isPreview: false },
    ]
  }
];

export const CourseContentDetail = () => {
  const [openModule, setOpenModule] = React.useState(0);

  return (
    <div className="space-y-12">
      {/* About this course */}
      <div>
        <h2 className="text-2xl font-bold mb-6">About this course</h2>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
          <p>Designing large-scale systems is both an art and a science. In this comprehensive course, you&apos;ll go from basic architectural patterns to designing complex distributed systems capable of handling millions of requests per second.</p>
          <p>We will cover load balancing, caching strategies, database sharding, and message queues. You will learn not just the theory, but how to apply these concepts in real-world scenarios like designing a URL shortener, a chat application, and a video streaming service.</p>
        </div>

        {/* What you&apos;ll learn */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-8">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            What you&apos;ll learn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Scalability fundamentals",
              "Database replication & partitioning",
              "Content Delivery Networks (CDNs)",
              "Microservices Architecture"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        <div className="border border-border rounded-2xl overflow-hidden">
          {curriculum.map((module, idx) => (
            <div key={idx} className="border-b border-border last:border-0">
              <button 
                onClick={() => setOpenModule(openModule === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-6 bg-card hover:bg-slate-900 transition-colors"
              >
                <div className="text-left">
                  <h4 className="font-bold text-white">{module.title}</h4>
                  <p className="text-xs text-muted-foreground">{module.lessons}</p>
                </div>
                {openModule === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {openModule === idx && (
                <div className="bg-slate-950 px-6 py-2">
                  {module.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                          {item.isPreview ? (
                            <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <span className={`text-sm ${item.isPreview ? 'text-white' : 'text-muted-foreground'}`}>
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {item.isPreview && (
                          <span className="text-[10px] font-bold text-primary uppercase border border-primary/30 px-2 py-0.5 rounded bg-primary/10">
                            Preview
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{item.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructor */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Instructor</h2>
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img src="https://i.pravatar.cc/150?u=alex" alt="Alex Chen" className="w-24 h-24 rounded-2xl object-cover" />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-white">Alex Chen</h4>
                <p className="text-sm text-primary font-medium">Senior Staff Engineer @ Google</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Alex has over 15 years of experience building scalable systems for some of the world&apos;s largest tech companies. He specializes in distributed databases and real-time processing pipelines.
              </p>
              <div className="flex gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  120k+ Students
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  12 Courses
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
