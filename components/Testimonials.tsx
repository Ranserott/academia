import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    text: "Tech Academy cambió completamente mi trayectoria profesional. Pasé de no saber nada de código a trabajar como Frontend Developer en una startup unicornio en solo 8 meses.",
    author: "Elena Rodríguez",
    role: "Frontend Dev @ TechCo",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    text: "La metodología práctica y los mentores son increíbles. No solo aprendes a programar, aprendes a pensar como ingeniero y a resolver problemas reales.",
    author: "Carlos Méndez",
    role: "Software Engineer @ Cloudware",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=carlos",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-background/50 overflow-hidden relative">
      {/* Decorative quotes background */}
      <Quote className="absolute top-20 left-10 w-64 h-64 text-primary/5 -rotate-12 pointer-events-none" />
      <Quote className="absolute bottom-20 right-10 w-64 h-64 text-primary/5 rotate-12 pointer-events-none" />

      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros graduados</h2>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl border border-border bg-card relative group hover:border-primary/30 transition-colors"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-8 right-8" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-lg text-foreground italic mb-8 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full border-2 border-primary/20" 
                />
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
