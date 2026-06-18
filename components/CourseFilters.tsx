import React from 'react';

const categories = [
  { name: 'Web Development', count: 120 },
  { name: 'Data Science', count: 85 },
  { name: 'DevOps', count: 42 },
  { name: 'Mobile Dev', count: 36 },
];

const levels = ['Beginner', 'Intermediate', 'Expert'];
const durations = ['0-2 Hours', '3-10 Hours', '10+ Hours'];

export const CourseFilters = () => {
  return (
    <aside className="w-full md:w-64 space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Category</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat.name} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border border-border checked:bg-primary checked:border-primary transition-all" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-sm text-muted-foreground group-hover:text-white transition-colors">{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground/50 bg-secondary/50 px-2 py-0.5 rounded-full">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Level</h3>
        <div className="space-y-3">
          {levels.map((level) => (
            <label key={level} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input type="radio" name="level" className="peer appearance-none w-5 h-5 rounded-full border border-border checked:border-primary transition-all" />
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full opacity-0 peer-checked:opacity-100 left-1.25 transition-opacity"></div>
              </div>
              <span className="ml-3 text-sm text-muted-foreground group-hover:text-white transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Duration</h3>
        <div className="space-y-3">
          {durations.map((duration) => (
            <label key={duration} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border border-border checked:bg-primary checked:border-primary transition-all" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-sm text-muted-foreground group-hover:text-white transition-colors">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Price Range</h3>
        <div className="space-y-4">
          <input type="range" className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$200+</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
