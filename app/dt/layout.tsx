import type { ReactNode } from "react";
import { StaffShell } from "@/components/Shells";

export default function DtLayout({ children }: { children: ReactNode }) {
  return (
    <StaffShell rol="dt" etiqueta="Profesor / DT" items={[{ href: "/dt", label: "Mi rama" }]}>
      {children}
    </StaffShell>
  );
}
