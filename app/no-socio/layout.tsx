import type { ReactNode } from "react";
import { SocioShell } from "@/components/Shells";

export default function NoSocioLayout({ children }: { children: ReactNode }) {
  return <SocioShell rol="no-socio">{children}</SocioShell>;
}
