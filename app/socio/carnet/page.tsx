"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useDemo } from "@/lib/store";
import { YO } from "@/lib/data";
import { Chip, Encabezado, Escudo } from "@/components/ui";

export default function Carnet() {
  const { state } = useDemo();
  const vencidas = state.cuotas.filter((c) => c.estado === "vencida").length;
  const pendientes = state.cuotas.length;

  return (
    <>
      <Encabezado titulo="Mi carnet" sub="Mostralo en la puerta o en el buffet" escudo={false} />
      <div className="wrap">
        <article className="carnet" aria-label="Carnet digital de socio">
          <div className="carnet-top">
            <Escudo alto={64} />
            <div className="club">
              Club Atlético
              <br />
              Independiente
              <small>Lobería</small>
            </div>
          </div>

          <div className="carnet-banda">
            <div className="avatar" aria-hidden="true">
              {YO.nombre[0]}
              {YO.apellido[0]}
            </div>
            <div>
              <h2>
                {YO.nombre}
                <br />
                {YO.apellido}
              </h2>
              <p style={{ fontWeight: 800 }}>Socia Nº {YO.nro}</p>
              <p>{YO.categoria}</p>
              {YO.actividades.map((a) => (
                <p key={a} className="apagado">{a}</p>
              ))}
            </div>
          </div>

          <div className="carnet-pie">
            <div className="qr">
              <QRCodeSVG value={`CAI-LOB|${YO.nro}|${YO.dni}`} size={132} />
            </div>
            <div>
              {vencidas > 0 ? (
                <Chip tipo="deuda">Debés {vencidas} {vencidas === 1 ? "cuota" : "cuotas"}</Chip>
              ) : pendientes > 0 ? (
                <Chip tipo="aviso">Cuota por vencer</Chip>
              ) : (
                <Chip tipo="ok">Al día</Chip>
              )}
              <p>Socia desde {YO.desde}</p>
            </div>
          </div>
        </article>

        {pendientes > 0 && (
          <Link href="/socio/cuotas" className="btn block" style={{ marginTop: 20 }}>
            Pagar cuota
          </Link>
        )}
      </div>
    </>
  );
}
