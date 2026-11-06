import type { ReactNode } from "react";
import { SocioShell } from "@/components/Shells";

export default function SocioLayout({ children }: { children: ReactNode }) {
  return <SocioShell>{children}</SocioShell>;
}
