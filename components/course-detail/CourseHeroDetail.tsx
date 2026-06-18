import React from 'react';
import { Star, Globe, Clock, RefreshCcw, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CourseHeroProps {
  course: {
    title: string;
    instructor: string;
    rating: number;
    reviews: string;
    price: string;
    image: string;
  };
}

export const CourseHeroDetail = ({ course }: CourseHeroProps) => {
  return (
    <section className="bg-slate-950 pt-32 pb-12 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span>Home</span> <ChevronRight className="w-4 h-4" />
          <span>Development</span> <ChevronRight className="w-4 h-4" />
          <span className="text-white">System Design</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {course.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                   <img src="https://i.pravatar.cc/150?u=alex" alt="Instructor" className="w-full h-full rounded-full" />
                </div>
                <span>Created by <span className="text-primary font-bold">{course.instructor}</span></span>
              </div>
              
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{course.rating}</span>
                <span className="text-muted-foreground font-normal">({course.reviews} ratings)</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>English, Spanish</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCcw className="w-4 h-4" />
                <span>Last updated Nov 2023</span>
              </div>
            </div>

            {/* Video Preview Area */}
            <div className="aspect-video bg-slate-900 rounded-2xl border border-border overflow-hidden relative group cursor-pointer shadow-2xl">
              <img 
                src={course.image} 
                alt="Course Preview" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-3xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-white font-bold text-lg bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg">
                Vista previa de este curso
              </div>
            </div>
          </div>

          {/* Pricing Sidebar (Sticky on Desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-8 sticky top-24 shadow-2xl">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-white">{course.price}</span>
                <span className="text-lg text-muted-foreground line-through">$199.99</span>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">-35%</span>
              </div>

              <div className="space-y-4 mb-8">
                <Button size="lg" className="w-full py-6 text-lg font-bold">
                  Inscribirse ahora
                </Button>
                <p className="text-center text-xs text-muted-foreground">30-Day Money-Back Guarantee</p>
              </div>

              <div className="space-y-4 text-sm">
                <p className="font-bold text-white uppercase tracking-wider text-xs">This course includes:</p>
                <ul className="space-y-3">
                  {[
                    { icon: Clock, text: '12 hours on-demand video' },
                    { icon: Globe, text: '15 downloadable resources' },
                    { icon: RefreshCcw, text: 'Full lifetime access' },
                    { icon: Globe, text: 'Access on mobile and TV' },
                    { icon: Star, text: 'Certificate of completion' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <item.icon className="w-4 h-4 text-primary" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <div className="text-center">
                   <p className="font-bold text-white mb-2">Training 5 or more people?</p>
                   <p className="text-xs text-muted-foreground mb-4">Get your team access to 8,000+ top courses anytime, anywhere.</p>
                   <Button variant="outline" className="w-full">Try TechAcademy for Business</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
