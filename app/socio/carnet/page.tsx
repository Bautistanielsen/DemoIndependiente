"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useDemo } from "@/lib/store";
import { YO } from "@/lib/data";
import { IconCarnet } from "@/components/Icons";
import { Chip, Encabezado, Escudo } from "@/components/ui";

export default function Carnet() {
  const { state, persona } = useDemo();
  const noSocio = state.rol === "no-socio";
  const mensaje = `Hola, soy ${persona.nombre} ${persona.apellido}. Me interesa asociarme al Club Atlético Independiente. ¿Me cuentan cómo hacerlo?`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  const vencidas = state.cuotas.filter((c) => c.estado === "vencida").length;
  const pendientes = state.cuotas.length;

  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}>
      <Encabezado titulo="Inicio" sub="Tu lugar en el club" escudo={false} />
      <div className="wrap" style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 16, paddingBottom: "calc(89px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ width: "100%", maxWidth: 400, margin: "0 auto", flexShrink: 0 }}>
        <article className="carnet" aria-label={noSocio ? "Invitación a asociarte" : "Carnet digital de socio"}>
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
              {persona.nombre[0]}
              {persona.apellido[0]}
            </div>
            <div>
              <h2>
                {persona.nombre}
                <br />
                {persona.apellido}
              </h2>
              <p style={{ fontWeight: 800 }}>{noSocio ? "No socio" : `Socia Nº ${YO.nro}`}</p>
              <p>{noSocio ? "Sumate a Independiente" : YO.categoria}</p>
              {!noSocio && YO.actividades.map((a) => (
                <p key={a} className="apagado">{a}</p>
              ))}
            </div>
          </div>

          <div className="carnet-pie">
            {noSocio ? (
              <>
                <div className="qr carnet-invitacion" aria-hidden="true"><IconCarnet /></div>
                <div><p>Tu próximo carnet.</p><p>Más deporte y beneficios para vos.</p></div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </article>

        {noSocio ? (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn block" style={{ marginTop: 20 }}>
            Quiero asociarme
          </a>
        ) : pendientes > 0 && (
          <Link href="/socio/cuotas" className="btn block" style={{ marginTop: 20 }}>
            Pagar cuota
          </Link>
        )}
        </div>
      </div>
    </div>
  );
}
