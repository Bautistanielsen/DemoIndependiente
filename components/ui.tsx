"use client";

import { useEffect, type ReactNode } from "react";

export function Escudo({ alto = 64 }: { alto?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/escudo.webp" alt="Escudo del Club Atlético Independiente de Lobería" height={alto} style={{ height: alto, width: "auto" }} />;
}

export function Encabezado({ titulo, sub, escudo = true }: { titulo: string; sub?: string; escudo?: boolean }) {
  return (
    <header className="enc">
      <div>
        <h1>{titulo}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {escudo && <Escudo alto={64} />}
    </header>
  );
}

type Tipo = "ok" | "aviso" | "deuda" | "neutro";
const ICONO: Record<Tipo, string> = { ok: "✓", aviso: "!", deuda: "▲", neutro: "•" };

export function Chip({ tipo, children }: { tipo: Tipo; children: ReactNode }) {
  return (
    <span className={`chip ${tipo}`}>
      <span aria-hidden="true">{ICONO[tipo]}</span>
      {children}
    </span>
  );
}

export function Marcador({
  etiqueta,
  numero,
  sub,
  tono = "negro",
}: {
  etiqueta: string;
  numero: string;
  sub?: string;
  tono?: "negro" | "rojo" | "ok";
}) {
  return (
    <div className={`marc ${tono}`}>
      <div className="et">{etiqueta}</div>
      <div className="num">{numero}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export const Sep = () => <div className="sep" aria-hidden="true" />;

export function Confirmacion({
  titulo,
  detalle,
  boton,
  onClose,
  children,
}: {
  titulo: string;
  detalle?: string;
  boton: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div className="ov" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="tilde" aria-hidden="true">✓</div>
      <h2 className="display">{titulo}</h2>
      {detalle && <p className="ov-detalle">{detalle}</p>}
      {children}
      <button className="btn block" style={{ maxWidth: 420 }} onClick={onClose} autoFocus>
        {boton}
      </button>
    </div>
  );
}

export function Procesando({ texto }: { texto: string }) {
  return (
    <div className="ov" role="status" aria-live="polite">
      <div className="spin" aria-hidden="true" />
      <h2 className="display">{texto}</h2>
    </div>
  );
}
