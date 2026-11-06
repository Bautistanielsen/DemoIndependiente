"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import { DIAS_SEMANA, PADEL_TURNOS, padelOcupado, plata } from "@/lib/data";
import { Chip, Confirmacion, Encabezado } from "@/components/ui";

const DIAS = Array.from({ length: 7 }, (_, i) => new Date(2026, 10, 5 + i));

export default function Padel() {
  const { state, reservarPadel, precioPadel } = useDemo();
  const [i, setI] = useState(0);
  const [hecho, setHecho] = useState<string | null>(null);
  const fecha = DIAS[i];

  return (
    <>
      <Encabezado titulo="Cancha de pádel" sub={`${plata(precioPadel)} el turno de 90 minutos`} />
      <div className="wrap">
        <div className="dias" role="group" aria-label="Día">
          {DIAS.map((f, k) => (
            <button key={k} className="dchip" aria-pressed={i === k} onClick={() => setI(k)}>
              {DIAS_SEMANA[f.getDay()]}
              <b>{f.getDate()}</b>
            </button>
          ))}
        </div>

        {PADEL_TURNOS.map((hora, t) => {
          const clave = `${fecha.getDate()}-${t}`;
          const mio = state.padelMios.includes(clave);
          const ocupado = !mio && padelOcupado(fecha.getDate(), t);
          return (
            <div key={clave} className="fila turno">
              <div className="izq">
                <span className="hora">{hora}</span>
                <small>{ocupado ? "Ocupado" : mio ? "Reservado a tu nombre" : "Libre"}</small>
              </div>
              {mio ? (
                <Chip tipo="ok">Tu turno</Chip>
              ) : ocupado ? (
                <Chip tipo="neutro">Ocupado</Chip>
              ) : (
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    reservarPadel(clave);
                    setHecho(`${DIAS_SEMANA[fecha.getDay()]} ${fecha.getDate()}/11 a las ${hora}`);
                  }}
                >
                  Reservar
                </button>
              )}
            </div>
          );
        })}
        <p className="ayuda">El turno se abona en secretaría o con Mercado Pago antes de jugar.</p>
      </div>

      {hecho && (
        <Confirmacion
          titulo="¡Turno reservado!"
          detalle={`${hecho}. Te lo recordamos por WhatsApp el día anterior.`}
          boton="Listo"
          onClose={() => setHecho(null)}
        />
      )}
    </>
  );
}
