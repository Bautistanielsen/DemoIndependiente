import type { ReactNode } from "react";
import { StaffShell } from "@/components/Shells";

export default function ComisionLayout({ children }: { children: ReactNode }) {
  return (
    <StaffShell
      rol="comision"
      etiqueta="Comisión directiva"
      items={[
        { href: "/comision", label: "Resumen" },
        { href: "/comision/gastos", label: "Gastos" },
      ]}
    >
      {children}
    </StaffShell>
  );
}
