import Link from "next/link";
import { Button } from "./ui/Button";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function Navbar() {
  const session = await auth();

  let enrollmentCount = 0;
  if (session?.user?.id) {
    enrollmentCount = await prisma.enrollment.count({
      where: { userId: session.user.id },
    });
  }

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
            <Link
              href="/cursos"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Explorar
            </Link>
            {session?.user && (
              <Link
                href="/dashboard/mis-cursos"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Mis Cursos
                {enrollmentCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                    {enrollmentCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {session.user.name || session.user.email}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                >
                  Cerrar Sesión
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link href="/auth/signup">
                <Button>Empezar gratis</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
