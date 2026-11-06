"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store";
import { DEMO_CLAVE, DEMO_DNI, type Rol } from "@/lib/data";
import { Escudo } from "@/components/ui";

const DESTINO: Record<Rol, string> = {
  socio: "/socio/carnet",
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
          <label className="campo">
            <span>Tu contraseña</span>
            <input
              type={ver ? "text" : "password"}
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </label>
          <button type="button" className="btn btn-sec btn-sm" onClick={() => setVer((v) => !v)}>
            {ver ? "Ocultar contraseña" : "Ver contraseña"}
          </button>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn block" style={{ marginTop: 20 }}>
            Ver mi carnet
          </button>
          <p className="ayuda" style={{ textAlign: "center" }}>
            ¿Te olvidaste la contraseña? Te la mandamos por WhatsApp o email.
          </p>
        </form>

        <div className="demo-box" style={{ marginTop: 28 }}>
          <strong>Demo · socio de ejemplo</strong>
          <p>DNI <b>{DEMO_DNI}</b> · contraseña <b>{DEMO_CLAVE}</b></p>
          <button className="btn btn-neg btn-sm block" style={{ marginTop: 10 }} onClick={() => entrar("socio")}>
            Entrar directo como socia
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
