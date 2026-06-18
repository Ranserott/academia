import { Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

const courses = [
  {
    title: 'Full Stack Web Development',
    description: 'Domina el stack MERN (MongoDB, Express, React y Node) desde cero hasta experto.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    category: 'Desarrollo Web',
    instructor: {
      name: 'Alex M.',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
  },
  {
    title: 'Data Science & Python',
    description: 'Aprende análisis de datos, visualización y machine learning con las librerías más potentes.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=600&q=80',
    category: 'Data Science',
    instructor: {
      name: 'Sarah J.',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Diseña interfaces modernas y experiencias de usuario centradas en las personas.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&w=600&q=80',
    category: 'Diseño UX',
    instructor: {
      name: 'David L.',
      avatar: 'https://i.pravatar.cc/150?u=david',
    },
  },
];

const categories = ['Todos', 'Desarrollo Web', 'Data Science', 'Diseño UX'];

export const Courses = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <h2 className="text-3xl md:text-4xl font-bold">Cursos destacados</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-2 p-1 bg-secondary/50 rounded-xl border border-border">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat === 'Todos' ? 'bg-primary text-white' : 'hover:bg-primary/10 text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-2 py-1 rounded bg-background/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                  {course.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-white">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium text-muted-foreground">{course.instructor.name}</span>
                  </div>
                  <button className="text-primary text-sm font-bold hover:underline">
                    Ver curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="px-10">
            Explorar todos los cursos
          </Button>
        </div>
      </div>
    </section>
  );
};
