import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const partners = [
  { name: 'Stripe', logo: 'Stripe' },
  { name: 'Google', logo: 'Google' },
  { name: 'Shopify', logo: 'Shopify' },
  { name: 'Spotify', logo: 'Spotify' },
];

const footerLinks = [
  {
    title: 'Plataforma',
    links: [
      { name: 'Cursos', href: '/cursos' },
      { name: 'Mentores', href: '/mentores' },
      { name: 'Precios', href: '/precios' },
      { name: 'Para Empresas', href: '/empresas' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'Guías de carrera', href: '/guias' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Comunidad', href: '/comunidad' },
    ],
  },
  {
    title: 'Compañía',
    links: [
      { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { name: 'Carreras', href: '/carreras' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Legal', href: '/legal' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border">
      {/* Partners Section */}
      <div className="container mx-auto px-4 mb-20 text-center">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-10">
          NUESTROS ALUMNOS TRABAJAN EN
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <span className="text-xl font-bold tracking-tight">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold">TechAcademy</span>
            </Link>
            <p className="text-muted-foreground max-w-xs mb-8">
              La plataforma líder para aprender las habilidades tecnológicas más demandadas. Transforma tu carrera hoy.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold mb-6">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>© 2024 TechAcademy Inc. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="/privacidad" className="hover:text-primary">Privacidad</Link>
            <Link href="/terminos" className="hover:text-primary">Términos</Link>
            <Link href="/cookies" className="hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
