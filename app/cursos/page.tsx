import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CourseFilters } from '@/components/CourseFilters';
import { CourseCard } from '@/components/CourseCard';
import { CourseSearch } from '@/components/CourseSearch';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const courses = [
  {
    title: 'Advanced React Patterns & Performance',
    description: 'Deep dive into hooks, context, rendering optimization, and advanced component patterns.',
    rating: 4.9,
    reviews: '2.3k',
    duration: '5h 30m',
    level: 'Advanced',
    price: '$89.99',
    instructor: 'Sarah Drasner',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    badgeColor: 'bg-indigo-500 text-white',
  },
  {
    title: 'Python for Data Science Bootcamp',
    description: 'Master Python, Pandas, NumPy, and Matplotlib to analyze data and create visualizations.',
    rating: 4.7,
    reviews: '1.1k',
    duration: '22h Total',
    level: 'Beginner',
    price: '$129.99',
    instructor: 'Jose Portilla',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'AWS Certified Solutions Architect',
    description: 'Complete preparation for the AWS SAA-C03 exam including hands-on labs and practice exams.',
    rating: 4.8,
    reviews: '540',
    duration: '12h Total',
    level: 'Expert',
    price: '$149.99',
    instructor: 'Cloud Guru',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    badge: 'New',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    title: 'Ethical Hacking: Zero to Hero',
    description: 'Learn network penetration testing, web exploitation, and security fundamentals.',
    rating: 4.6,
    reviews: '3.2k',
    duration: '18h Total',
    level: 'Intermediate',
    price: '$94.99',
    instructor: 'Aleksa Matic',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Flutter & Dart - The Complete Guide',
    description: 'A Complete Guide to the Flutter SDK & Flutter Framework for building native iOS and Android apps.',
    rating: 4.8,
    reviews: '1.8k',
    duration: '42h Total',
    level: 'Beginner',
    price: '$19.99',
    instructor: 'Maximilian S.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Machine Learning A-Z™: Hands-On',
    description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
    rating: 4.5,
    reviews: '12k',
    duration: '35h Total',
    level: 'Expert',
    price: '$109.99',
    instructor: 'Kirill Eremenko',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4">Explore Courses</h1>
          <p className="text-muted-foreground">Master the latest tech skills with our industry-leading curriculum.</p>
        </div>

        <CourseSearch />

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <CourseFilters />

          {/* Course Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">1</button>
              <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors font-bold">2</button>
              <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors font-bold">3</button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors font-bold">12</button>
              <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
