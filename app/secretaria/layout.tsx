import type { ReactNode } from "react";
import { StaffShell } from "@/components/Shells";

export default function SecretariaLayout({ children }: { children: ReactNode }) {
  return (
    <StaffShell
      rol="secretaria"
      etiqueta="Secretaría"
      items={[
        { href: "/secretaria", label: "Hoy" },
        { href: "/secretaria/socios", label: "Socios" },
        { href: "/secretaria/padel", label: "Pádel" },
      ]}
    >
      {children}
    </StaffShell>
  );
}
