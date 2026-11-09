"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store";
import { plata, YO, type Pago } from "@/lib/data";
import { Chip, Confirmacion, Encabezado, Escudo, Marcador, Procesando, Sep } from "@/components/ui";

export default function Cuotas() {
  const { state, persona, basePath, cuotas, pagos, pagarCuotas } = useDemo();
  const router = useRouter();
  const [fuera, setFuera] = useState<string[]>([]); // cuotas que el socio destildó
  const [fase, setFase] = useState<"idle" | "procesando" | "ok">("idle");
  const [recibo, setRecibo] = useState<Pago | null>(null);

  const elegidas = cuotas.filter((c) => !fuera.includes(c.id));
  const total = elegidas.reduce((t, c) => t + c.social + c.actividad, 0);

  const pagar = () => {
    const ids = elegidas.map((c) => c.id);
    setFase("procesando");
    // En producción: acá se crea la preferencia de Mercado Pago y se redirige al checkout.
    // El pago se registra solo cuando llega el webhook (idempotente por payment_id).
    setTimeout(() => {
      setRecibo(pagarCuotas(ids));
      setFase("ok");
    }, 1400);
  };

  return (
    <>
      <Encabezado titulo="Mis cuotas" sub={`${persona.nombre} ${persona.apellido} · ${state.rol === "no-socio" ? "No socio" : `Socia Nº ${YO.nro}`}`} />
      <div className="wrap">
        {cuotas.length === 0 ? (
          <Marcador tono="ok" etiqueta="Tu estado" numero="Estás al día" sub="No debés nada. ¡Gracias por ser parte del club!" />
        ) : (
          <>
            <Marcador
              etiqueta="Total a pagar"
              numero={plata(total)}
              sub={`${elegidas.length} ${elegidas.length === 1 ? "cuota" : "cuotas"} seleccionadas`}
            />
            <div style={{ marginTop: 12 }}>
              {cuotas.map((c) => (
                <label key={c.id} className="fila check" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={!fuera.includes(c.id)}
                      onChange={() =>
                        setFuera((f) => (f.includes(c.id) ? f.filter((x) => x !== c.id) : [...f, c.id]))
                      }
                    />
                    <span>
                      <b>{c.mes}</b>
                      <small>{state.rol === "no-socio" ? `Vóley ${plata(c.actividad)}` : `Social ${plata(c.social)} + Vóley ${plata(c.actividad)}`}</small>
                      {c.estado === "vencida" ? (
                        <Chip tipo="deuda">Venció el {c.vence}</Chip>
                      ) : (
                        <Chip tipo="aviso">Vence el {c.vence}</Chip>
                      )}
                    </span>
                  </span>
                  <span className="monto">{plata(c.social + c.actividad)}</span>
                </label>
              ))}
            </div>
            <button className="btn block" style={{ marginTop: 20 }} disabled={elegidas.length === 0} onClick={pagar}>
              Pagar cuota con Mercado Pago
            </button>
            <p className="ayuda">Pagás con tarjeta, dinero en cuenta o transferencia. Tu recibo llega por WhatsApp.</p>
          </>
        )}

        <Sep />
        <h2 className="tit">Pagos anteriores</h2>
        {pagos.map((p) => (
          <div key={p.id} className="fila">
            <div className="izq">
              <b>{p.concepto}</b>
              <small>{p.fecha} · {p.medio} · Recibo {p.id}</small>
            </div>
            <span className="monto">{plata(p.monto)}</span>
          </div>
        ))}
      </div>

      {fase === "procesando" && <Procesando texto="Conectando con Mercado Pago…" />}
      {fase === "ok" && recibo && (
        <Confirmacion
          titulo="¡Pago recibido!"
          detalle="Ya quedó registrado. Te mandamos el recibo por WhatsApp."
          boton={state.rol === "no-socio" ? "Volver a mi cuenta" : "Ver mi carnet"}
          onClose={() => {
            setFase("idle");
            router.push(`${basePath}/carnet`);
          }}
        >
          <div className="recibo">
            <div className="cab">
              <Escudo alto={48} />
              <div>
                <b className="display">Recibo {recibo.id}</b>
                <small className="apagado">Club Atlético Independiente · Lobería</small>
              </div>
            </div>
            <div className="fila"><span>{state.rol === "no-socio" ? "Persona" : "Socia"}</span><b>{recibo.socio}</b></div>
            <div className="fila"><span>Concepto</span><b>{recibo.concepto}</b></div>
            <div className="fila"><span>Fecha</span><b>{recibo.fecha}</b></div>
            <div className="fila"><span>Medio</span><b>{recibo.medio}</b></div>
            <div className="fila"><span>Total</span><b className="display" style={{ fontSize: 26 }}>{plata(recibo.monto)}</b></div>
          </div>
        </Confirmacion>
      )}
    </>
  );
}
