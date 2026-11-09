"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store";
import { DEMO_CLAVE, DEMO_DNI, DEMO_NO_SOCIO_CLAVE, DEMO_NO_SOCIO_DNI, type Rol } from "@/lib/data";
import { Escudo } from "@/components/ui";

const DESTINO: Record<Rol, string> = {
  socio: "/socio/carnet",
  "no-socio": "/no-socio/carnet",
  secretaria: "/secretaria",
  comision: "/comision",
  dt: "/dt",
};

export default function Login() {
  const { login, reiniciar } = useDemo();
  const router = useRouter();
  const [dni, setDni] = useState("");
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState("");

  const entrar = (rol: Rol) => {
    login(rol);
    router.push(DESTINO[rol]);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const limpio = dni.replace(/\D/g, "");
    if (limpio === DEMO_DNI && clave === DEMO_CLAVE) {
      setError("");
      entrar("socio");
    } else if (limpio === DEMO_NO_SOCIO_DNI && clave === DEMO_NO_SOCIO_CLAVE) {
      setError("");
      entrar("no-socio");
    } else {
      setError("El DNI o la contraseña no coinciden. Revisalos y probá de nuevo.");
    }
  };

  return (
    <>
      <header className="login-top">
        <Escudo alto={110} />
        <h1>Club Atlético Independiente</h1>
        <p>Lobería</p>
      </header>
      <main className="wrap" style={{ paddingTop: 0 }}>
        <form onSubmit={enviar} noValidate>
          <label className="campo">
            <span>Tu DNI</span>
            <input
              inputMode="numeric"
              autoComplete="username"
              placeholder="Sin puntos, ej: 38456123"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </label>
          <div className="campo">
            <label htmlFor="password" className="campo-label">Tu contraseña</label>
            <div className="password-field">
              <input
                id="password"
                type={ver ? "text" : "password"}
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={ver}
                aria-controls="password"
                onClick={() => setVer((v) => !v)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {ver && <path d="m3 3 18 18" />}
                </svg>
              </button>
            </div>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn block" style={{ marginTop: 20 }}>
            Ingresar
          </button>
          <p className="ayuda" style={{ textAlign: "center" }}>
            <Link href="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          </p>
        </form>

        <div className="demo-box" style={{ marginTop: 28 }}>
          <strong>Demo · socio de ejemplo</strong>
          <p>DNI <b>{DEMO_DNI}</b> · contraseña <b>{DEMO_CLAVE}</b></p>
          <button className="btn btn-neg btn-sm block" style={{ marginTop: 10 }} onClick={() => entrar("socio")}>
            Entrar directo como socia
          </button>
          <p style={{ marginTop: 18 }}><strong>Demo · no socio de ejemplo</strong></p>
          <p>DNI <b>{DEMO_NO_SOCIO_DNI}</b> · contraseña <b>{DEMO_NO_SOCIO_CLAVE}</b></p>
          <button className="btn btn-sec btn-sm block" style={{ marginTop: 10 }} onClick={() => entrar("no-socio")}>
            Entrar directo como no socio
          </button>
        </div>

        <div className="demo-box" style={{ marginTop: 14 }}>
          <strong>Demo · entrar como personal del club</strong>
          <div className="roles">
            <button className="btn btn-sec btn-sm" onClick={() => entrar("secretaria")}>Secretaria</button>
            <button className="btn btn-sec btn-sm" onClick={() => entrar("comision")}>Comisión directiva</button>
            <button className="btn btn-sec btn-sm" onClick={() => entrar("dt")}>Profesor / DT</button>
          </div>
          <button className="btn btn-sec btn-sm block" style={{ marginTop: 14, borderStyle: "dashed" }} onClick={reiniciar}>
            Reiniciar la demo (borra lo que hiciste)
          </button>
        </div>
      </main>
    </>
  );
}
