import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '1',
    title: 'Fundamentos',
    description: 'Aprende la base de programación, HTML, CSS y JS básico.',
  },
  {
    number: '2',
    title: 'Especialización',
    description: 'Profundiza en Frontend (React) o Backend (Node/Python).',
  },
  {
    number: '3',
    title: 'Portafolio',
    description: 'Desarrolla 3 proyectos de gran escala para mostrar tus habilidades.',
  },
  {
    number: '4',
    title: 'Contratación',
    description: 'Preparación de entrevistas, optimización CV y red de contactos.',
  },
];

export const Roadmap = () => {
  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu camino al éxito profesional</h2>
            <p className="text-muted-foreground max-w-xl">
              Un roadmap estructurado para llevarte desde principiante hasta profesional contratado.
            </p>
          </div>
          <Link href="/carrera" className="flex items-center gap-2 text-primary font-medium hover:underline group">
            Ver carrera completa <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative p-8 rounded-2xl border border-border bg-card/50 overflow-hidden group hover:border-primary/30 transition-colors"
            >
              <div className="text-5xl font-black text-primary/10 absolute -top-2 -right-2 group-hover:text-primary/20 transition-colors">
                {step.number}
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
