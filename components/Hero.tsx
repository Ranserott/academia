import { Button } from './ui/Button';
import { PlayCircle, ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Próximo curso: JS Engineering
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Aprende <br />
              <span className="text-white">habilidades tech</span> <br />
              que <span className="text-primary">cambian tu</span> <br />
              <span className="text-primary">carrera</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Domina el desarrollo web, ciencia de datos y diseño UX con mentores expertos. 
              Proyectos reales, feedback personalizado y una comunidad global.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Ver todos los cursos <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <PlayCircle className="w-4 h-4" /> Ver Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Únete a más de <span className="text-white font-bold">15,000+</span> estudiantes
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 shadow-2xl overflow-hidden">
               {/* Dashboard Mockup Placeholder */}
               <div className="aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden border border-border relative">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mt-8 p-4 flex gap-4 h-full">
                    <div className="w-1/4 h-full border-r border-border pr-4 space-y-4">
                      <div className="h-4 w-full bg-slate-800 rounded"></div>
                      <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                      <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="h-32 w-full bg-slate-800 rounded-lg"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-slate-800 rounded-lg"></div>
                        <div className="h-20 bg-slate-800 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Floating Badge */}
               <div className="absolute top-10 -right-4 z-20 bg-card border border-border rounded-xl p-3 shadow-xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Curso completado</p>
                      <p className="text-xs font-bold text-white">React Avanzado</p>
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
