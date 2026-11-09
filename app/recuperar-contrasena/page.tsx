"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Escudo } from "@/components/ui";

export default function RecuperarContrasena() {
  const [correo, setCorreo] = useState("");
  const [solicitado, setSolicitado] = useState(false);

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSolicitado(true);
  };

  return (
    <>
      <header className="login-top">
        <Escudo alto={110} />
        <h1>Club Atlético Independiente</h1>
        <p>Lobería</p>
      </header>
      <main className="wrap" style={{ paddingTop: 24 }}>
        <h2>Recuperar contraseña</h2>
        <p className="ayuda">Ingresá tu correo electrónico para solicitar un enlace de recuperación.</p>
        <form onSubmit={enviar}>
          <label className="campo">
            <span>Correo electrónico</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="nombre@ejemplo.com"
              value={correo}
              onChange={(event) => {
                setCorreo(event.target.value);
                setSolicitado(false);
              }}
            />
          </label>
          <button type="submit" className="btn block">Enviar enlace de recuperación</button>
        </form>
        {solicitado && (
          <div className="demo-box" role="status" style={{ marginTop: 20 }}>
            <strong>Solicitud simulada</strong>
            <p>En la versión conectada recibirías un enlace para cambiar tu contraseña. En esta demo no se envió ningún correo ni se modificó tu contraseña.</p>
          </div>
        )}
        <p className="ayuda" style={{ marginTop: 16 }}>Demo · No se enviarán correos.</p>
        <Link href="/" className="btn btn-sec block" style={{ marginTop: 20 }}>Volver</Link>
      </main>
    </>
  );
}
