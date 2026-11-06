"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDemo } from "@/lib/store";
import type { Rol } from "@/lib/data";
import { Escudo } from "./ui";
import { IconCarnet, IconCuotas, IconPadel, IconReservas } from "./Icons";

function useGuard(rol: Rol) {
  const { ready, state } = useDemo();
  const router = useRouter();
  useEffect(() => {
    if (ready && state.rol !== rol) router.replace("/");
  }, [ready, state.rol, rol, router]);
  return ready && state.rol === rol;
}

const Cargando = () => <div className="cargando">Cargando…</div>;

const SOCIO_ITEMS = [
  { href: "/socio/carnet", label: "Carnet", Icono: IconCarnet },
  { href: "/socio/cuotas", label: "Cuotas", Icono: IconCuotas },
  { href: "/socio/reservas", label: "Salones", Icono: IconReservas },
  { href: "/socio/padel", label: "Pádel", Icono: IconPadel },
];

export function SocioShell({ children }: { children: ReactNode }) {
  const ok = useGuard("socio");
  const path = usePathname();
  const { logout } = useDemo();
  const router = useRouter();
  if (!ok) return <Cargando />;
  return (
    <div className="socio-app">
      <main className="socio-main">
        {children}
        <div className="wrap" style={{ paddingTop: 0 }}>
          <button
            className="btn btn-sec btn-sm"
            onClick={() => {
              logout();
              router.replace("/");
            }}
          >
            Salir
          </button>
        </div>
      </main>
      <nav className="botnav" aria-label="Principal">
        {SOCIO_ITEMS.map(({ href, label, Icono }) => (
          <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>
            <Icono />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function StaffShell({
  rol,
  etiqueta,
  items,
  children,
}: {
  rol: Rol;
  etiqueta: string;
  items: { href: string; label: string }[];
  children: ReactNode;
}) {
  const ok = useGuard(rol);
  const path = usePathname();
  const { logout } = useDemo();
  const router = useRouter();
  if (!ok) return <Cargando />;
  return (
    <>
      <div className="topbar">
        <div className="marca">
          <Escudo alto={40} />
          <span>
            C.A.I. Lobería
            <small>{etiqueta}</small>
          </span>
        </div>
        <nav aria-label="Principal">
          {items.map((it) => (
            <Link key={it.href} href={it.href} aria-current={path === it.href ? "page" : undefined}>
              {it.label}
            </Link>
          ))}
        </nav>
        <button
          className="salir"
          onClick={() => {
            logout();
            router.replace("/");
          }}
        >
          Salir
        </button>
      </div>
      <main>{children}</main>
    </>
  );
}
