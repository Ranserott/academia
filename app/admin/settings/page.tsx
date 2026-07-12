import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminHeader title="Configuración" />

      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Configuración</h2>
          <p className="text-muted-foreground">
            Administra tu cuenta y preferencias
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
          <h3 className="text-lg font-bold mb-4">Información de la Cuenta</h3>
          <dl className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <dt className="text-muted-foreground">Nombre</dt>
              <dd className="font-medium">{session.user.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{session.user.email}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Rol</dt>
              <dd>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                  {session.user.role}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <SettingsForm />
      </main>
    </div>
  );
}