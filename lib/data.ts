// Datos de ejemplo de la demo. Todo es ficticio.

export type Rol = "socio" | "secretaria" | "comision" | "dt";

export const plata = (n: number) =>
  "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const DEMO_DNI = "38456123";
export const DEMO_CLAVE = "1234";

/* ---------- El socio de la demo ---------- */

export const YO = {
  dni: DEMO_DNI,
  nombre: "Lucía",
  apellido: "Fernández",
  nro: 1247,
  categoria: "Socia activa",
  actividades: ["Vóley · Femenino Mayores"],
  desde: 2014,
};

export type Cuota = {
  id: string;
  mes: string;
  vence: string;
  estado: "vencida" | "por-vencer";
  social: number;
  actividad: number;
};

export const CUOTAS_INICIALES: Cuota[] = [
  { id: "2026-10", mes: "Octubre", vence: "10/10", estado: "vencida", social: 8500, actividad: 6000 },
  { id: "2026-11", mes: "Noviembre", vence: "10/11", estado: "por-vencer", social: 8500, actividad: 6000 },
];

export type Pago = {
  id: string;
  socio: string;
  concepto: string;
  fecha: string;
  monto: number;
  medio: string;
};

export const PAGOS_INICIALES: Pago[] = [
  { id: "R-1008", socio: "Lucía Fernández", concepto: "Cuota septiembre", fecha: "08/09/2026", monto: 14500, medio: "Mercado Pago" },
  { id: "R-0951", socio: "Lucía Fernández", concepto: "Cuota agosto", fecha: "07/08/2026", monto: 14500, medio: "Mercado Pago" },
  { id: "R-0897", socio: "Lucía Fernández", concepto: "Cuota julio", fecha: "11/07/2026", monto: 14500, medio: "Efectivo en secretaría" },
];

/* ---------- Socios (vista de la secretaria) ---------- */

export type Socio = {
  dni: string;
  nombre: string;
  categoria: string;
  rama: string;
  adeuda: number;
  cuota: number;
  tel: string;
};

export const SOCIOS: Socio[] = [
  { dni: "38456123", nombre: "Lucía Fernández", categoria: "Activo", rama: "Vóley · Fem. Mayores", adeuda: 0, cuota: 14500, tel: "2262 45-1203" },
  { dni: "35120987", nombre: "Matías Rodríguez", categoria: "Activo", rama: "Fútbol · Mayores", adeuda: 0, cuota: 13500, tel: "2262 52-7781" },
  { dni: "42001234", nombre: "Camila Giménez", categoria: "Cadete", rama: "Vóley · Infantiles", adeuda: 0, cuota: 11000, tel: "2262 40-9912" },
  { dni: "31987654", nombre: "Julián Pereyra", categoria: "Activo", rama: "Básquet · Masculino", adeuda: 2, cuota: 14000, tel: "2262 47-3345" },
  { dni: "12345678", nombre: "Rosa Maidana", categoria: "Vitalicio", rama: "—", adeuda: 0, cuota: 0, tel: "2262 43-0021" },
  { dni: "27555111", nombre: "Héctor Castro", categoria: "Familiar", rama: "Fútbol · Infantiles", adeuda: 3, cuota: 22000, tel: "2262 55-1180" },
  { dni: "40222333", nombre: "Sofía Aranda", categoria: "Activo", rama: "Básquet · Femenino", adeuda: 0, cuota: 14000, tel: "2262 41-6650" },
  { dni: "44111222", nombre: "Bruno Salvatierra", categoria: "Cadete", rama: "Fútbol · Infantiles", adeuda: 1, cuota: 9500, tel: "2262 49-2208" },
  { dni: "29666777", nombre: "Marcela Ibarra", categoria: "Activo", rama: "Vóley · Fem. Mayores", adeuda: 0, cuota: 14500, tel: "2262 46-8834" },
  { dni: "33444555", nombre: "Diego Lamas", categoria: "Activo", rama: "Fútbol · Mayores", adeuda: 4, cuota: 13500, tel: "2262 50-4417" },
  { dni: "39888999", nombre: "Pilar Quiroga", categoria: "Familiar", rama: "—", adeuda: 0, cuota: 9000, tel: "2262 44-7761" },
  { dni: "30777888", nombre: "Ariel Barrios", categoria: "Activo", rama: "Básquet · Masculino", adeuda: 0, cuota: 14000, tel: "2262 48-1095" },
];

export const CATEGORIAS = ["Activo", "Cadete", "Familiar", "Vitalicio"];

/* ---------- Cobros del día ---------- */

export type Cobro = {
  id: string;
  hora: string;
  socio: string;
  concepto: string;
  monto: number;
  medio: string;
  auto: boolean;
};

export const COBROS_INICIALES: Cobro[] = [
  { id: "c1", hora: "09:12", socio: "Matías Rodríguez", concepto: "Cuota noviembre", monto: 13500, medio: "Mercado Pago", auto: true },
  { id: "c2", hora: "10:40", socio: "Marcela Ibarra", concepto: "Cuota noviembre", monto: 14500, medio: "Mercado Pago", auto: true },
  { id: "c3", hora: "11:05", socio: "Sofía Aranda", concepto: "Cuota noviembre", monto: 14000, medio: "Débito automático", auto: true },
  { id: "c4", hora: "11:30", socio: "Rosa Maidana", concepto: "Turno de pádel", monto: 16000, medio: "Efectivo", auto: false },
];

/* ---------- Reservas de salones ---------- */

export type EspacioId = "quinta" | "sede";
export type TurnoId = "mediodia" | "noche";
export type EstadoReserva = "aprobada" | "pendiente" | "rechazada";

export const ESPACIOS: Record<EspacioId, { nombre: string; precio: number; capacidad: number }> = {
  quinta: { nombre: "Salón de la quinta", precio: 120000, capacidad: 80 },
  sede: { nombre: "Salón de la sede", precio: 80000, capacidad: 60 },
};

export const TURNOS: Record<TurnoId, string> = {
  mediodia: "Mediodía · 12:00 a 18:00",
  noche: "Noche · 20:00 a 03:00",
};

export const SENIA = 0.3;

export type Reserva = {
  id: string;
  espacio: EspacioId;
  dia: number; // día de noviembre 2026
  turno: TurnoId;
  quien: string;
  evento: string;
  estado: EstadoReserva;
};

export const RESERVAS_INICIALES: Reserva[] = [
  { id: "r1", espacio: "quinta", dia: 7, turno: "mediodia", quien: "Familia Rojas", evento: "Cumpleaños de 15", estado: "aprobada" },
  { id: "r2", espacio: "quinta", dia: 14, turno: "noche", quien: "Club de Abuelos", evento: "Cena anual", estado: "aprobada" },
  { id: "r3", espacio: "quinta", dia: 14, turno: "mediodia", quien: "Familia Soria", evento: "Bautismo", estado: "aprobada" },
  { id: "r4", espacio: "quinta", dia: 21, turno: "noche", quien: "Promo 2009", evento: "Reencuentro", estado: "aprobada" },
  { id: "r5", espacio: "quinta", dia: 28, turno: "mediodia", quien: "Familia Giménez", evento: "Cumpleaños infantil", estado: "pendiente" },
  { id: "r6", espacio: "sede", dia: 8, turno: "noche", quien: "Centro de Jubilados", evento: "Reunión", estado: "aprobada" },
  { id: "r7", espacio: "sede", dia: 22, turno: "mediodia", quien: "Familia Duarte", evento: "Comunión", estado: "aprobada" },
  { id: "r8", espacio: "sede", dia: 22, turno: "noche", quien: "Familia Duarte", evento: "Comunión (cena)", estado: "aprobada" },
  { id: "r9", espacio: "sede", dia: 29, turno: "noche", quien: "Egresados 6° año", evento: "Despedida", estado: "pendiente" },
  { id: "r10", espacio: "sede", dia: 12, turno: "mediodia", quien: "Tomás Villalba", evento: "Cumpleaños", estado: "pendiente" },
];

export const NOV_2026 = {
  nombre: "Noviembre 2026",
  dias: 30,
  primerDiaOffset: 6, // el 1/11/2026 es domingo; la semana empieza en lunes
  hoy: 5,
};

/* ---------- Pádel ---------- */

export const PADEL_TURNOS = ["16:00", "17:30", "19:00", "20:30", "22:00"];

export const PADEL_PRECIOS_INICIALES = [
  { desde: "06/02/2026", precio: 12000 },
  { desde: "06/05/2026", precio: 14000 },
  { desde: "06/08/2026", precio: 16000 },
];

export const PADEL_PRECIO_SUGERIDO = 18000;

// Ocupación inventada pero estable (misma salida en servidor y navegador).
export const padelOcupado = (dia: number, turno: number) =>
  (dia * 3 + turno * 5 + dia * turno) % 7 < 3;

/* ---------- Plantel (DT) ---------- */

export type Jugadora = { dni: string; nombre: string; camiseta: number; adeuda: number };

export const PLANTEL: Jugadora[] = [
  { dni: "40100001", nombre: "Valentina Sosa", camiseta: 1, adeuda: 0 },
  { dni: "40100002", nombre: "Julieta Roldán", camiseta: 3, adeuda: 1 },
  { dni: "29666777", nombre: "Marcela Ibarra", camiseta: 4, adeuda: 0 },
  { dni: "40100003", nombre: "Carla Benítez", camiseta: 5, adeuda: 0 },
  { dni: "38456123", nombre: "Lucía Fernández", camiseta: 7, adeuda: 0 },
  { dni: "40100004", nombre: "Romina Vega", camiseta: 8, adeuda: 0 },
  { dni: "40100005", nombre: "Agustina Paz", camiseta: 9, adeuda: 0 },
  { dni: "40100006", nombre: "Daniela Cruz", camiseta: 10, adeuda: 0 },
  { dni: "40100007", nombre: "Noelia Duarte", camiseta: 11, adeuda: 2 },
  { dni: "40100008", nombre: "Micaela Ponce", camiseta: 12, adeuda: 0 },
];

/* ---------- Comisión: números del club ---------- */

export const MESES = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];

// En miles de pesos, de noviembre 2025 a octubre 2026.
export const SERIE = {
  social: [1450, 1480, 1320, 1390, 1560, 1610, 1650, 1640, 1700, 1720, 1760, 1790],
  actividades: [1900, 1750, 1100, 1600, 2300, 2450, 2500, 2450, 2550, 2600, 2700, 2750],
  reservas: [600, 1250, 980, 420, 380, 360, 300, 260, 300, 340, 560, 720],
  padel: [380, 400, 430, 420, 400, 420, 500, 470, 510, 560, 560, 620],
  egresos: [3300, 3600, 3100, 3250, 3500, 3650, 3700, 3600, 3800, 3900, 4100, 4250],
};

export const SOCIOS_TOTALES = 812;
export const SOCIOS_MOROSOS = 114;

export const CATEGORIAS_GASTO = ["Servicios", "Mantenimiento", "Sueldos", "Árbitros", "Otros"];

export type Gasto = { id: string; fecha: string; concepto: string; categoria: string; monto: number };

export const GASTOS_INICIALES: Gasto[] = [
  { id: "g1", fecha: "31/10", concepto: "Sueldos de profesores (octubre)", categoria: "Sueldos", monto: 1850000 },
  { id: "g2", fecha: "28/10", concepto: "Luz de sede y quinta", categoria: "Servicios", monto: 410000 },
  { id: "g3", fecha: "24/10", concepto: "Arreglo del techo de la cancha", categoria: "Mantenimiento", monto: 680000 },
  { id: "g4", fecha: "19/10", concepto: "Árbitros fechas 6 y 7", categoria: "Árbitros", monto: 320000 },
  { id: "g5", fecha: "15/10", concepto: "Gas", categoria: "Servicios", monto: 190000 },
];
