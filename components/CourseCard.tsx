"use client";

import Link from 'next/link';
import { Star, Clock, Bookmark, Layers } from 'lucide-react';

interface CourseCardProps {
  course: {
    title: string;
    description: string;
    rating: number;
    reviews: string;
    duration: string;
    level: string;
    price: string;
    instructor: string;
    image: string;
    badge?: string;
    badgeColor?: string;
  };
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link href="/cursos/1" className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col h-full">
      <div className="aspect-[16/10] relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {course.badge && (
          <div className={`absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${course.badgeColor || 'bg-primary text-white'}`}>
            {course.badge}
          </div>
        )}
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-white hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="font-bold text-white">{course.rating}</span>
              <span>({course.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>{course.level}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="text-sm font-medium">
              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Instructor</p>
              <p className="text-white">{course.instructor}</p>
            </div>
            <div className="text-xl font-black text-primary">
              {course.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

