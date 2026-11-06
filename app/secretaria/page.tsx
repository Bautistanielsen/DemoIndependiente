"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useDemo } from "@/lib/store";
import { ESPACIOS, SOCIOS, TURNOS, plata } from "@/lib/data";
import { Chip, Encabezado, Marcador, Sep } from "@/components/ui";

const PLANTILLA =
  "Hola {nombre}, te escribimos del Club Independiente de Lobería. Tenés {cuotas} sin pagar ({monto}). Podés abonar desde la app en un minuto. ¡Gracias!";

export default function Hoy() {
  const { state, resolverReserva, avisar, cobrarEfectivo, adeudaDe, precioPadel } = useDemo();
  const [efectivo, setEfectivo] = useState(false);
  const [socio, setSocio] = useState(SOCIOS[1].nombre);
  const [concepto, setConcepto] = useState("Cuota social");
  const [monto, setMonto] = useState("");
  const [msg, setMsg] = useState("");

  const total = state.cobros.reduce((t, c) => t + c.monto, 0);
  const pendientes = state.reservas.filter((r) => r.estado === "pendiente");
  const morosos = SOCIOS.map((s) => ({ ...s, debe: adeudaDe(s.dni, s.adeuda) })).filter((s) => s.debe > 0);
  const padelPendiente = state.padelPrecios.length < 4;

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(monto.replace(/\D/g, ""));
    if (!n) return;
    cobrarEfectivo(socio, concepto, n);
    setMonto("");
    setEfectivo(false);
    setMsg(`Cobro en efectivo de ${plata(n)} registrado.`);
  };

  return (
    <>
      <Encabezado titulo="Hoy en secretaría" sub="Jueves 5 de noviembre" />
      <div className="wrap-staff">
        {padelPendiente && (
          <div className="alerta" role="status">
            <span>Mañana (6/11) toca actualizar el precio del pádel.</span>
            <Link href="/secretaria/padel" className="btn btn-neg btn-sm">Ver aumento</Link>
          </div>
        )}

        <div className="tres" style={{ marginTop: 20 }}>
          <Marcador etiqueta="Cobrado hoy" numero={plata(total)} sub={`${state.cobros.length} cobros · ${state.cobros.filter((c) => c.auto).length} automáticos`} />
          <Marcador tono="rojo" etiqueta="Reservas por resolver" numero={String(pendientes.length)} sub="esperan tu respuesta" />
          <Marcador etiqueta="Socios con deuda" numero={String(morosos.length)} sub="en este listado" />
        </div>

        <div className="dos">
          <section>
            <h2 className="tit">Cobros del día</h2>
            <p className="apagado">Los pagos online se cargan solos. Vos cargás solo el efectivo.</p>
            {msg && <p role="status" style={{ background: "var(--ok)", color: "#fff", padding: "10px 14px", fontWeight: 800, marginTop: 10 }}>✓ {msg}</p>}
            {state.cobros.map((c) => (
              <div key={c.id} className="fila">
                <div className="izq">
                  <b>{c.socio}</b>
                  <small>{c.hora} · {c.concepto}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="monto">{plata(c.monto)}</div>
                  {c.auto ? <Chip tipo="ok">{c.medio}</Chip> : <Chip tipo="neutro">Efectivo</Chip>}
                </div>
              </div>
            ))}

            {!efectivo ? (
              <button className="btn block" style={{ marginTop: 16 }} onClick={() => { setMsg(""); setEfectivo(true); }}>
                Cobrar en efectivo
              </button>
            ) : (
              <form onSubmit={guardar} style={{ marginTop: 16, borderTop: "3px solid var(--negro)", paddingTop: 8 }}>
                <label className="campo">
                  <span>Socio</span>
                  <select value={socio} onChange={(e) => setSocio(e.target.value)}>
                    {SOCIOS.map((s) => <option key={s.dni}>{s.nombre}</option>)}
                  </select>
                </label>
                <label className="campo">
                  <span>Concepto</span>
                  <select value={concepto} onChange={(e) => setConcepto(e.target.value)}>
                    <option>Cuota social</option>
                    <option>Cuota de actividad</option>
                    <option>Turno de pádel</option>
                    <option>Seña de salón</option>
                  </select>
                </label>
                <label className="campo">
                  <span>Monto</span>
                  <input inputMode="numeric" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Ej: 14500" />
                </label>
                <div className="acciones" style={{ justifyContent: "flex-start" }}>
                  <button className="btn" type="submit" disabled={!monto}>Registrar cobro</button>
                  <button className="btn btn-sec" type="button" onClick={() => setEfectivo(false)}>Cancelar</button>
                </div>
              </form>
            )}
          </section>

          <section>
            <h2 className="tit">Reservas pendientes</h2>
            {pendientes.length === 0 && <p className="apagado" style={{ padding: "14px 0" }}>No hay pedidos por resolver. ¡Todo al día!</p>}
            {pendientes.map((r) => (
              <div key={r.id} className="fila">
                <div className="izq">
                  <b>{ESPACIOS[r.espacio].nombre} · {r.dia}/11</b>
                  <small>{r.quien} · {r.evento}</small>
                  <small>{TURNOS[r.turno]} · {plata(ESPACIOS[r.espacio].precio)}</small>
                </div>
                <div className="acciones">
                  <button className="btn btn-sm" onClick={() => resolverReserva(r.id, "aprobada")}>Aprobar</button>
                  <button className="btn btn-peligro btn-sm" onClick={() => resolverReserva(r.id, "rechazada")}>Rechazar</button>
                </div>
              </div>
            ))}

            <Sep />
            <h2 className="tit">Morosos</h2>
            {morosos.map((s) => (
              <div key={s.dni} className="fila">
                <div className="izq">
                  <b>{s.nombre}</b>
                  <small>{s.rama} · {s.tel}</small>
                  <Chip tipo="deuda">Debe {s.debe} {s.debe === 1 ? "cuota" : "cuotas"} · {plata(s.debe * s.cuota)}</Chip>
                </div>
                {state.avisados.includes(s.dni) ? (
                  <Chip tipo="ok">Aviso enviado</Chip>
                ) : (
                  <button className="btn btn-sec btn-sm" onClick={() => avisar(s.dni)}>Avisar por WhatsApp</button>
                )}
              </div>
            ))}
            <details style={{ marginTop: 14 }}>
              <summary style={{ fontWeight: 800, cursor: "pointer", minHeight: 44, display: "flex", alignItems: "center" }}>
                Editar el mensaje de aviso
              </summary>
              <label className="campo">
                <span>Plantilla (podés usar {"{nombre}"}, {"{cuotas}"} y {"{monto}"})</span>
                <textarea defaultValue={PLANTILLA} />
              </label>
              <p className="ayuda">Pádel hoy: {plata(precioPadel)} por turno.</p>
            </details>
          </section>
        </div>
      </div>
    </>
  );
}
