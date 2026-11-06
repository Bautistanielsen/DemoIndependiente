"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import { CATEGORIAS, SOCIOS, plata } from "@/lib/data";
import { Chip, Encabezado } from "@/components/ui";

export default function Socios() {
  const { adeudaDe } = useDemo();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [nota, setNota] = useState("");

  const lista = SOCIOS.filter(
    (s) =>
      (!cat || s.categoria === cat) &&
      (s.nombre.toLowerCase().includes(q.toLowerCase()) || s.dni.includes(q.replace(/\D/g, "") || "§")),
  );

  return (
    <>
      <Encabezado titulo="Socios" sub="812 socios en el club · mostrando una muestra de ejemplo" />
      <div className="wrap-staff">
        <div className="acciones" style={{ justifyContent: "flex-start", marginTop: 16 }}>
          <button className="btn" onClick={() => setNota("En la versión real: formulario de alta con DNI, categoría, actividades y contacto.")}>Nuevo socio</button>
          <button className="btn btn-sec" onClick={() => setNota("En la versión real: subís tu planilla .xlsx o .csv, el sistema te marca filas con errores y confirmás antes de importar.")}>
            Importar desde Excel
          </button>
        </div>
        {nota && <p className="alerta" role="status" style={{ marginTop: 14 }}>{nota}</p>}

        <label className="campo">
          <span>Buscar por nombre o DNI</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej: Rodríguez o 35120987" />
        </label>
        <div className="filtros" role="group" aria-label="Categoría">
          <button className="filtro" aria-pressed={cat === null} onClick={() => setCat(null)}>Todas</button>
          {CATEGORIAS.map((c) => (
            <button key={c} className="filtro" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>
          ))}
        </div>

        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr><th>Socio</th><th>DNI</th><th>Categoría</th><th>Actividad</th><th>Cuota</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {lista.map((s) => {
                const debe = adeudaDe(s.dni, s.adeuda);
                return (
                  <tr key={s.dni}>
                    <td><b>{s.nombre}</b><br /><span className="apagado">{s.tel}</span></td>
                    <td>{s.dni}</td>
                    <td>{s.categoria}</td>
                    <td>{s.rama}</td>
                    <td>{s.cuota ? plata(s.cuota) : "—"}</td>
                    <td>{debe > 0 ? <Chip tipo="deuda">Debe {debe}</Chip> : <Chip tipo="ok">Al día</Chip>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {lista.length === 0 && <p className="apagado" style={{ padding: 16 }}>No encontramos a nadie con ese dato.</p>}
      </div>
    </>
  );
}
