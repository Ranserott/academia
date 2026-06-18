import Link from 'next/link';
import { Button } from './ui/Button';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold">TechAcademy</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cursos" className="text-sm font-medium hover:text-primary transition-colors">Explorar</Link>
            <Link href="/mis-cursos" className="text-sm font-medium hover:text-primary transition-colors">Mis Cursos</Link>
            <Link href="/empresas" className="text-sm font-medium hover:text-primary transition-colors">Empresas</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
          <Button>Empezar gratis</Button>
        </div>
      </div>
    </nav>
  );
};
