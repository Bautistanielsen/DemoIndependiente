"use client";

import { Encabezado } from "@/components/ui";
import { useDemo } from "@/lib/store";

export default function Invitacion() {
  const { persona } = useDemo();
  const mensaje = `Hola, soy ${persona.nombre} ${persona.apellido}. Me interesa asociarme al Club Atlético Independiente. ¿Me cuentan cómo hacerlo?`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="no-socio-invitacion">
      <Encabezado titulo="Inicio" sub="Tu lugar en el club" escudo={false} />
      <div className="wrap">
        <h2 style={{ width: "100%", maxWidth: 400, margin: "0 auto 16px", textAlign: "left", fontSize: 26 }}>
          Hola, {persona.nombre} {persona.apellido}
        </h2>
        <img
          src="/asociate_img.png"
          alt="Hacete socio del Club Atlético Independiente de Lobería"
          width={1122}
          height={1402}
          style={{ display: "block", width: "100%", maxWidth: 400, height: "auto", margin: "0 auto", borderRadius: 6, boxShadow: "0 16px 32px rgba(17,17,17,0.35), 0 4px 12px rgba(17,17,17,0.25)" }}
        />
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn block" style={{ display: "flex", maxWidth: 400, margin: "20px auto 0" }}>
          Quiero asociarme
        </a>
      </div>
    </div>
  );
}
