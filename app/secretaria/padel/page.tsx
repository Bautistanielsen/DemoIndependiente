"use client";

import { useDemo } from "@/lib/store";
import { PADEL_PRECIO_SUGERIDO, plata } from "@/lib/data";
import { Chip, Encabezado, Marcador, Sep } from "@/components/ui";

export default function PadelSecretaria() {
  const { state, precioPadel, aplicarPrecioPadel } = useDemo();
  const aplicado = state.padelPrecios.length >= 4;
  const hist = [...state.padelPrecios].reverse();

  return (
    <>
      <Encabezado titulo="Precio del pádel" sub="Se actualiza cada 3 meses y queda todo registrado" />
      <div className="wrap-staff">
        <div className="dos" style={{ marginTop: 20 }}>
          <div>
            <Marcador etiqueta="Precio actual por turno" numero={plata(precioPadel)} sub={aplicado ? "Vigente desde el 06/11/2026" : "Vigente desde el 06/08/2026"} />
            {!aplicado ? (
              <>
                <div className="alerta" role="status">Mañana (6/11) corresponde el aumento trimestral.</div>
                <p style={{ margin: "16px 0 8px", fontSize: 18 }}>
                  Precio sugerido: <b>{plata(PADEL_PRECIO_SUGERIDO)}</b> (+{Math.round((PADEL_PRECIO_SUGERIDO / precioPadel - 1) * 100)}%)
                </p>
                <button className="btn block" onClick={aplicarPrecioPadel}>Aplicar nuevo precio</button>
                <p className="ayuda">Te mandamos un recordatorio por WhatsApp un día antes de cada actualización.</p>
              </>
            ) : (
              <p style={{ marginTop: 16 }}><Chip tipo="ok">Aumento aplicado</Chip> Próxima actualización: 06/02/2027.</p>
            )}
          </div>
          <div>
            <h2 className="tit" style={{ marginTop: 0 }}>Historial de precios</h2>
            {hist.map((p, i) => (
              <div key={p.desde} className="fila">
                <div className="izq">
                  <b>Desde el {p.desde}</b>
                  {i === 0 && <Chip tipo="ok">Vigente</Chip>}
                </div>
                <span className="monto">{plata(p.precio)}</span>
              </div>
            ))}
            <Sep />
            <p className="apagado">Cada cambio guarda fecha y valor: nunca se pisa un precio anterior.</p>
          </div>
        </div>
      </div>
    </>
  );
}
