"use client";

import { useState, type FormEvent } from "react";
import { useDemo } from "@/lib/store";
import { CATEGORIAS_GASTO, plata } from "@/lib/data";
import { Chip, Encabezado } from "@/components/ui";

export default function Gastos() {
  const { state, agregarGasto } = useDemo();
  const [concepto, setConcepto] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_GASTO[0]);
  const [monto, setMonto] = useState("");
  const [ok, setOk] = useState(false);

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(monto.replace(/\D/g, ""));
    if (!n || !concepto.trim()) return;
    agregarGasto({ fecha: "05/11", concepto: concepto.trim(), categoria, monto: n });
    setConcepto("");
    setMonto("");
    setOk(true);
  };

  return (
    <>
      <Encabezado titulo="Gastos" sub="Cargá cada egreso en 3 datos" />
      <div className="wrap-staff">
        <div className="dos" style={{ marginTop: 12 }}>
          <form onSubmit={guardar}>
            <h2 className="tit">Nuevo gasto</h2>
            <label className="campo">
              <span>¿En qué se gastó?</span>
              <input value={concepto} onChange={(e) => { setConcepto(e.target.value); setOk(false); }} placeholder="Ej: Pintura para la sede" />
            </label>
            <label className="campo">
              <span>Categoría</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {CATEGORIAS_GASTO.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="campo">
              <span>Monto</span>
              <input inputMode="numeric" value={monto} onChange={(e) => { setMonto(e.target.value); setOk(false); }} placeholder="Ej: 85000" />
            </label>
            <button className="btn block" type="submit" disabled={!monto || !concepto.trim()}>Guardar gasto</button>
            {ok && <p role="status" style={{ background: "var(--ok)", color: "#fff", padding: "10px 14px", fontWeight: 800, marginTop: 12 }}>✓ Gasto guardado.</p>}
          </form>

          <section>
            <h2 className="tit">Últimos gastos</h2>
            {state.gastos.map((g) => (
              <div key={g.id} className="fila">
                <div className="izq">
                  <b>{g.concepto}</b>
                  <small>{g.fecha}</small>
                  <Chip tipo="neutro">{g.categoria}</Chip>
                </div>
                <span className="monto">{plata(g.monto)}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
