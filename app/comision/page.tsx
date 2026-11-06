"use client";

import { MESES, SERIE, SOCIOS_MOROSOS, SOCIOS_TOTALES, plata } from "@/lib/data";
import { Encabezado, Marcador, Sep } from "@/components/ui";

const ingresoMes = (i: number) => SERIE.social[i] + SERIE.actividades[i] + SERIE.reservas[i] + SERIE.padel[i];
const K = 1000;

export default function Resumen() {
  const u = MESES.length - 1; // octubre, último mes cerrado
  const ingresos = ingresoMes(u) * K;
  const egresos = SERIE.egresos[u] * K;
  const saldo = ingresos - egresos;
  const mora = Math.round((SOCIOS_MOROSOS / SOCIOS_TOTALES) * 100);
  const maximo = Math.max(...SERIE.egresos, ...MESES.map((_, i) => ingresoMes(i)));

  const origenes = [
    { n: "Cuota social", v: SERIE.social[u] * K },
    { n: "Actividades", v: SERIE.actividades[u] * K },
    { n: "Reservas de salones", v: SERIE.reservas[u] * K },
    { n: "Pádel", v: SERIE.padel[u] * K },
  ];

  const exportarExcel = () => {
    const filas = [
      ["Mes", "Cuota social", "Actividades", "Reservas", "Padel", "Ingresos", "Egresos", "Saldo"],
      ...MESES.map((m, i) => [
        m,
        SERIE.social[i] * K,
        SERIE.actividades[i] * K,
        SERIE.reservas[i] * K,
        SERIE.padel[i] * K,
        ingresoMes(i) * K,
        SERIE.egresos[i] * K,
        (ingresoMes(i) - SERIE.egresos[i]) * K,
      ]),
    ];
    const csv = "﻿" + filas.map((f) => f.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ingresos-egresos-cai-loberia.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Encabezado titulo="Octubre 2026" sub="Último mes cerrado" />
      <div className="wrap-staff">
        <div className="cuatro" style={{ marginTop: 20 }}>
          <Marcador etiqueta="Ingresos" numero={plata(ingresos)} />
          <Marcador tono="rojo" etiqueta="Egresos" numero={plata(egresos)} />
          <Marcador tono={saldo >= 0 ? "ok" : "rojo"} etiqueta="Saldo" numero={plata(saldo)} />
          <Marcador etiqueta="Morosidad" numero={`${mora}%`} sub={`${SOCIOS_MOROSOS} de ${SOCIOS_TOTALES} socios`} />
        </div>

        <h2 className="tit">Evolución de los últimos 12 meses</h2>
        <div className="leyenda">
          <span><i style={{ background: "var(--negro)" }} />Ingresos</span>
          <span><i style={{ background: "var(--rojo)" }} />Egresos</span>
        </div>
        <div className="chart" role="img" aria-label="Gráfico de barras de ingresos y egresos de los últimos 12 meses. Octubre: ingresos 5,9 millones, egresos 4,3 millones.">
          <div className="chart-in">
            {MESES.map((m, i) => (
              <div key={m + i} className="mes" title={`${m}: ingresos ${plata(ingresoMes(i) * K)} · egresos ${plata(SERIE.egresos[i] * K)}`}>
                <div className="barra i" style={{ height: `${(ingresoMes(i) / maximo) * 100}%` }} />
                <div className="barra e" style={{ height: `${(SERIE.egresos[i] / maximo) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="meses" aria-hidden="true">
            {MESES.map((m, i) => <span key={m + i}>{m}</span>)}
          </div>
        </div>

        <Sep />
        <h2 className="tit">De dónde vino la plata</h2>
        <div className="origen">
          {origenes.map((o) => (
            <div key={o.n} className="fila" style={{ display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>{o.n}</b>
                <span className="monto">{plata(o.v)}</span>
              </div>
              <div className="tira"><i style={{ width: `${(o.v / ingresos) * 100}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="acciones" style={{ justifyContent: "flex-start", marginTop: 24 }}>
          <button className="btn" onClick={exportarExcel}>Exportar a Excel</button>
          <button className="btn btn-sec" onClick={() => window.print()}>Exportar a PDF</button>
        </div>
      </div>
    </>
  );
}
