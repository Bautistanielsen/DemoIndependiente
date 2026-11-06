"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import {
  ESPACIOS,
  NOV_2026,
  SENIA,
  TURNOS,
  plata,
  type EspacioId,
  type TurnoId,
} from "@/lib/data";
import { Chip, Confirmacion, Encabezado, Sep } from "@/components/ui";

const SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function Reservas() {
  const { state, solicitarReserva } = useDemo();
  const [espacio, setEspacio] = useState<EspacioId>("quinta");
  const [dia, setDia] = useState<number | null>(null);
  const [turno, setTurno] = useState<TurnoId | null>(null);
  const [evento, setEvento] = useState("");
  const [enviada, setEnviada] = useState(false);

  const info = ESPACIOS[espacio];
  const deEspacio = state.reservas.filter((r) => r.espacio === espacio && r.estado !== "rechazada");
  const ocupados = (d: number) => deEspacio.filter((r) => r.dia === d);
  const mias = state.reservas.filter((r) => r.quien === "Lucía Fernández");

  const elegirEspacio = (e: EspacioId) => {
    setEspacio(e);
    setDia(null);
    setTurno(null);
  };

  const celdas: (number | null)[] = [
    ...Array<null>(NOV_2026.primerDiaOffset).fill(null),
    ...Array.from({ length: NOV_2026.dias }, (_, i) => i + 1),
  ];

  const estadoTurno = (t: TurnoId) => {
    const r = dia ? ocupados(dia).find((x) => x.turno === t) : undefined;
    return r ? r.estado : null;
  };

  return (
    <>
      <Encabezado titulo="Reservar salón" sub="Elegí el lugar, el día y el turno" />
      <div className="wrap">
        <div className="tabs" role="group" aria-label="Salón">
          {(Object.keys(ESPACIOS) as EspacioId[]).map((e) => (
            <button key={e} className="tab" aria-pressed={espacio === e} onClick={() => elegirEspacio(e)}>
              {ESPACIOS[e].nombre}
            </button>
          ))}
        </div>
        <p className="apagado" style={{ marginTop: 8 }}>
          {plata(info.precio)} por turno · hasta {info.capacidad} personas · seña del {SENIA * 100}% ({plata(info.precio * SENIA)})
        </p>

        <h2 className="tit">{NOV_2026.nombre}</h2>
        <div className="cal" role="group" aria-label="Calendario de noviembre">
          {SEMANA.map((s) => (
            <div key={s} className="dh">{s}</div>
          ))}
          {celdas.map((d, i) => {
            if (d === null) return <div key={`v${i}`} />;
            const pasado = d <= NOV_2026.hoy;
            const lleno = ocupados(d).length >= 2;
            const parcial = ocupados(d).length === 1;
            const clase = pasado ? "pasado" : lleno ? "lleno" : parcial ? "parcial" : "";
            return (
              <button
                key={d}
                className={`dia ${clase}`}
                disabled={pasado || lleno}
                aria-pressed={dia === d}
                aria-label={`${d} de noviembre${lleno ? ", completo" : parcial ? ", queda un turno" : ""}`}
                onClick={() => {
                  setDia(d);
                  setTurno(null);
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="leyenda">
          <span><i />Libre</span>
          <span><i className="p" />Queda un turno</span>
          <span><i className="l" />Completo</span>
        </div>

        {dia && (
          <>
            <Sep />
            <h2 className="tit">{dia} de noviembre</h2>
            {(Object.keys(TURNOS) as TurnoId[]).map((t) => {
              const est = estadoTurno(t);
              return (
                <div key={t} className="fila">
                  <div className="izq">
                    <b>{TURNOS[t]}</b>
                    {est === "pendiente" && <Chip tipo="aviso">Pedido en espera</Chip>}
                    {est === "aprobada" && <Chip tipo="neutro">Ocupado</Chip>}
                  </div>
                  <button
                    className="btn btn-sm"
                    disabled={est !== null}
                    onClick={() => setTurno(t)}
                    aria-pressed={turno === t}
                    style={turno === t ? { background: "var(--negro)", borderColor: "var(--negro)" } : undefined}
                  >
                    {turno === t ? "Elegido ✓" : "Elegir"}
                  </button>
                </div>
              );
            })}

            {turno && (
              <>
                <label className="campo">
                  <span>¿Qué vas a festejar?</span>
                  <input value={evento} onChange={(e) => setEvento(e.target.value)} placeholder="Ej: Cumpleaños de 15" />
                </label>
                <button
                  className="btn block"
                  onClick={() => {
                    solicitarReserva(espacio, dia, turno, evento.trim());
                    setEnviada(true);
                  }}
                >
                  Reservar salón
                </button>
                <p className="ayuda">La secretaria revisa tu pedido y te avisa por WhatsApp si lo aprueba.</p>
              </>
            )}
          </>
        )}

        {mias.length > 0 && (
          <>
            <Sep />
            <h2 className="tit">Mis pedidos</h2>
            {mias.map((r) => (
              <div key={r.id} className="fila">
                <div className="izq">
                  <b>{ESPACIOS[r.espacio].nombre}</b>
                  <small>{r.dia} de noviembre · {TURNOS[r.turno]}</small>
                </div>
                {r.estado === "pendiente" && <Chip tipo="aviso">En revisión</Chip>}
                {r.estado === "aprobada" && <Chip tipo="ok">Aprobada</Chip>}
                {r.estado === "rechazada" && <Chip tipo="deuda">Rechazada</Chip>}
              </div>
            ))}
          </>
        )}
      </div>

      {enviada && (
        <Confirmacion
          titulo="¡Pedido enviado!"
          detalle="La secretaria lo revisa y te avisa por WhatsApp. Si lo aprueba, te pasa cómo abonar la seña."
          boton="Listo"
          onClose={() => {
            setEnviada(false);
            setDia(null);
            setTurno(null);
            setEvento("");
          }}
        />
      )}
    </>
  );
}
