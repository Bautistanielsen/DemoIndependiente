"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CUOTAS_INICIALES,
  COBROS_INICIALES,
  GASTOS_INICIALES,
  PADEL_PRECIOS_INICIALES,
  PAGOS_INICIALES,
  RESERVAS_INICIALES,
  YO,
  NO_SOCIO,
  type Cobro,
  type Cuota,
  type EspacioId,
  type EstadoReserva,
  type Gasto,
  type Pago,
  type Reserva,
  type Rol,
  type TurnoId,
  PADEL_PRECIO_SUGERIDO,
} from "./data";

type State = {
  rol: Rol | null;
  cuotas: Cuota[];
  pagos: Pago[];
  noSocioCuotas: Cuota[];
  noSocioPagos: Pago[];
  cobros: Cobro[];
  reservas: Reserva[];
  padelMios: string[];
  padelNoSocioMios: string[];
  padelPrecios: { desde: string; precio: number }[];
  gastos: Gasto[];
  asistencia: Record<string, boolean>;
  avisados: string[];
};

const inicial = (): State => ({
  rol: null,
  cuotas: CUOTAS_INICIALES,
  pagos: PAGOS_INICIALES,
  noSocioCuotas: CUOTAS_INICIALES.map((cuota) => ({ ...cuota, social: 0 })),
  noSocioPagos: [],
  cobros: COBROS_INICIALES,
  reservas: RESERVAS_INICIALES,
  padelMios: [],
  padelNoSocioMios: [],
  padelPrecios: PADEL_PRECIOS_INICIALES,
  gastos: GASTOS_INICIALES,
  asistencia: {},
  avisados: [],
});

type Demo = {
  state: State;
  persona: { dni: string; nombre: string; apellido: string };
  basePath: "/socio" | "/no-socio";
  cuotas: Cuota[];
  pagos: Pago[];
  padelMios: string[];
  ready: boolean;
  login: (rol: Rol) => void;
  logout: () => void;
  reiniciar: () => void;
  pagarCuotas: (ids: string[]) => Pago;
  solicitarReserva: (espacio: EspacioId, dia: number, turno: TurnoId, evento: string) => void;
  resolverReserva: (id: string, estado: EstadoReserva) => void;
  reservarPadel: (clave: string) => void;
  aplicarPrecioPadel: () => void;
  agregarGasto: (g: Omit<Gasto, "id">) => void;
  toggleAsistencia: (dni: string) => void;
  avisar: (dni: string) => void;
  cobrarEfectivo: (socio: string, concepto: string, monto: number) => void;
  precioPadel: number;
  adeudaDe: (dni: string, base: number) => number;
};

const Ctx = createContext<Demo | null>(null);
const KEY = "cai-demo-v1";

const dos = (n: number) => String(n).padStart(2, "0");
const ahora = () => {
  const d = new Date();
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(inicial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...inicial(), ...JSON.parse(raw) });
    } catch {
      /* sin storage: la demo arranca de cero */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignorado */
    }
  }, [state, ready]);

  const login = useCallback((rol: Rol) => setState((s) => ({ ...s, rol })), []);
  const logout = useCallback(() => setState((s) => ({ ...s, rol: null })), []);
  const reiniciar = useCallback(() => setState(inicial()), []);

  const esNoSocio = state.rol === "no-socio";
  const persona = esNoSocio ? NO_SOCIO : YO;
  const basePath = esNoSocio ? "/no-socio" : "/socio";
  const cuotas = esNoSocio ? state.noSocioCuotas : state.cuotas;
  const pagos = esNoSocio ? state.noSocioPagos : state.pagos;
  const padelMios = esNoSocio ? state.padelNoSocioMios : state.padelMios;

  const pagarCuotas = useCallback(
    (ids: string[]) => {
      const elegidas = cuotas.filter((c) => ids.includes(c.id));
      const monto = elegidas.reduce((t, c) => t + c.social + c.actividad, 0);
      const hoy = new Date(2026, 10, 5);
      const pago: Pago = {
        id: esNoSocio ? `R-NS-${1001 + pagos.length}` : `R-${1013 + pagos.length - PAGOS_INICIALES.length}`,
        socio: `${persona.nombre} ${persona.apellido}`,
        concepto: `Cuota ${elegidas.map((c) => c.mes.toLowerCase()).join(" y ")}`,
        fecha: `${dos(hoy.getDate())}/${dos(hoy.getMonth() + 1)}/${hoy.getFullYear()}`,
        monto,
        medio: "Mercado Pago",
      };
      const cobro: Cobro = {
        id: `c-${pago.id}`,
        hora: ahora(),
        socio: pago.socio,
        concepto: pago.concepto.charAt(0).toUpperCase() + pago.concepto.slice(1),
        monto,
        medio: "Mercado Pago",
        auto: true,
      };
      setState((s) => ({
        ...s,
        ...(esNoSocio
          ? { noSocioCuotas: s.noSocioCuotas.filter((c) => !ids.includes(c.id)), noSocioPagos: [pago, ...s.noSocioPagos] }
          : { cuotas: s.cuotas.filter((c) => !ids.includes(c.id)), pagos: [pago, ...s.pagos] }),
        cobros: [cobro, ...s.cobros],
      }));
      return pago;
    },
    [cuotas, pagos.length, persona, esNoSocio],
  );

  const solicitarReserva = useCallback(
    (espacio: EspacioId, dia: number, turno: TurnoId, evento: string) =>
      setState((s) => ({
        ...s,
        reservas: [
          ...s.reservas,
          {
            id: `r-${s.reservas.length + 1}`,
            espacio,
            dia,
            turno,
            evento: evento || "Evento",
            quien: s.rol === "no-socio" ? `${NO_SOCIO.nombre} ${NO_SOCIO.apellido}` : `${YO.nombre} ${YO.apellido}`,
            estado: "pendiente",
          },
        ],
      })),
    [],
  );

  const resolverReserva = useCallback(
    (id: string, estado: EstadoReserva) =>
      setState((s) => ({
        ...s,
        reservas: s.reservas.map((r) => (r.id === id ? { ...r, estado } : r)),
      })),
    [],
  );

  const reservarPadel = useCallback(
    (clave: string) => setState((s) => ({
      ...s,
      ...(s.rol === "no-socio"
        ? { padelNoSocioMios: [...s.padelNoSocioMios, clave] }
        : { padelMios: [...s.padelMios, clave] }),
    })),
    [],
  );

  const aplicarPrecioPadel = useCallback(
    () =>
      setState((s) => ({
        ...s,
        padelPrecios: [...s.padelPrecios, { desde: "06/11/2026", precio: PADEL_PRECIO_SUGERIDO }],
      })),
    [],
  );

  const agregarGasto = useCallback(
    (g: Omit<Gasto, "id">) =>
      setState((s) => ({ ...s, gastos: [{ ...g, id: `g-${s.gastos.length + 1}` }, ...s.gastos] })),
    [],
  );

  const toggleAsistencia = useCallback(
    (dni: string) =>
      setState((s) => ({ ...s, asistencia: { ...s.asistencia, [dni]: !s.asistencia[dni] } })),
    [],
  );

  const avisar = useCallback(
    (dni: string) => setState((s) => ({ ...s, avisados: [...s.avisados, dni] })),
    [],
  );

  const cobrarEfectivo = useCallback(
    (socio: string, concepto: string, monto: number) =>
      setState((s) => ({
        ...s,
        cobros: [
          { id: `c-${s.cobros.length + 1}`, hora: ahora(), socio, concepto, monto, medio: "Efectivo", auto: false },
          ...s.cobros,
        ],
      })),
    [],
  );

  const precioPadel = state.padelPrecios[state.padelPrecios.length - 1].precio;

  // Lucía es la única socia cuya deuda cambia en la demo (cuando paga).
  const adeudaDe = useCallback(
    (dni: string, base: number) =>
      dni === YO.dni ? state.cuotas.filter((c) => c.estado === "vencida").length : base,
    [state.cuotas],
  );

  return (
    <Ctx.Provider
      value={{
        state,
        persona,
        basePath,
        cuotas,
        pagos,
        padelMios,
        ready,
        login,
        logout,
        reiniciar,
        pagarCuotas,
        solicitarReserva,
        resolverReserva,
        reservarPadel,
        aplicarPrecioPadel,
        agregarGasto,
        toggleAsistencia,
        avisar,
        cobrarEfectivo,
        precioPadel,
        adeudaDe,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo fuera de DemoProvider");
  return v;
}
