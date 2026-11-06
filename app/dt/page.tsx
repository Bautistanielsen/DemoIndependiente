"use client";

import { useDemo } from "@/lib/store";
import { PLANTEL } from "@/lib/data";
import { Chip, Encabezado, Marcador } from "@/components/ui";

export default function MiRama() {
  const { state, toggleAsistencia, adeudaDe } = useDemo();
  const jugadoras = PLANTEL.map((j) => ({ ...j, debe: adeudaDe(j.dni, j.adeuda) }));
  const alDia = jugadoras.filter((j) => j.debe === 0).length;
  const presentes = jugadoras.filter((j) => state.asistencia[j.dni]).length;

  return (
    <>
      <Encabezado titulo="Vóley · Femenino Mayores" sub="Entrenamiento de hoy · 20:00" />
      <div className="wrap-staff">
        <div className="tres" style={{ marginTop: 20, gridTemplateColumns: undefined }}>
          <Marcador etiqueta="Al día con la cuota" numero={`${alDia} de ${jugadoras.length}`} />
          <Marcador tono="rojo" etiqueta="Presentes hoy" numero={String(presentes)} sub="tildá a medida que llegan" />
        </div>

        <h2 className="tit">Plantel</h2>
        {jugadoras.map((j) => (
          <label key={j.dni} className="fila check" style={{ justifyContent: "space-between" }}>
            <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <input type="checkbox" checked={!!state.asistencia[j.dni]} onChange={() => toggleAsistencia(j.dni)} />
              <span>
                <b>{j.nombre}</b>
                <small>Camiseta {j.camiseta}</small>
              </span>
            </span>
            {j.debe === 0 ? <Chip tipo="ok">Al día</Chip> : <Chip tipo="deuda">Cuota atrasada</Chip>}
          </label>
        ))}
        <p className="ayuda" style={{ marginTop: 14 }}>
          Acá ves solo si cada jugadora está al día. Los importes y las finanzas del club no se muestran.
        </p>
      </div>
    </>
  );
}
