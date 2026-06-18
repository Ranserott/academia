import { Code2, Users, Award } from 'lucide-react';

const benefits = [
  {
    title: 'Proyectos Prácticos',
    description: 'Construye un portafolio profesional mientras aprendes. Cada curso termina con un proyecto real.',
    icon: Code2,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Mentoría 1-1',
    description: 'No estás solo. Recibe feedback detallado de expertos de la industria en cada paso de tu camino.',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Certificación Oficial',
    description: 'Obtén certificados verificables que puedes añadir a tu LinkedIn para destacar ante reclutadores.',
    icon: Award,
    color: 'bg-pink-500/10 text-pink-500',
  },
];

export const Benefits = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center mb-16">
        <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">¿POR QUÉ ELEGIRNOS?</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Aprendizaje diseñado para el mundo real</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Olvídate de la teoría aburrida. Aquí aprenderás haciendo, con las herramientas que usan las mejores empresas.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className={`w-12 h-12 rounded-xl ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
