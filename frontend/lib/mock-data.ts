// Mock data — reemplazar con llamadas reales a la API cuando estén los endpoints GET

// ── Clave de sesión compartida (login → dashboard) ────────────────────────────
export const MOCK_SESSION_KEY = 'iot_agro_agricultor_id'

// ── Agricultores ──────────────────────────────────────────────────────────────
export const mockAgricultores = [
  {
    id: 1,
    nombre: 'Familia López Rivas',
    finca: 'Finca Las Colinas',
    ubicacion: 'Matagalpa, Nicaragua',
    rating: 4.9,
    reviews: 47,
    verificado: true,
    lotes_completados: 18,
    avatar: 'LR',
    activo: true,
    _email: 'lopez@finca.com',
    _password: 'demo1234',
  },
  {
    id: 2,
    nombre: 'Cooperativa Café Norte',
    finca: 'Finca El Jagüey',
    ubicacion: 'Jinotega, Nicaragua',
    rating: 4.2,
    reviews: 23,
    verificado: true,
    lotes_completados: 9,
    avatar: 'CN',
    activo: false,
    _email: 'cafenorte@finca.com',
    _password: 'demo1234',
  },
]

export function findAgricultorByCredentials(email: string, password: string) {
  return mockAgricultores.find(
    a => a._email === email && a._password === password && a.activo
  ) ?? null
}

// ── Lotes ─────────────────────────────────────────────────────────────────────
export const mockLotes = [
  {
    id: 1,
    agricultor_id: 1,
    codigo_lote: 'LOTE-001-PL',
    variedad: 'Pergamino Lavado',
    peso_inicial_qq: 120.5,
    precio_mercado_actual: 280.0,
    esta_activo: true,
    fecha_inicio: '2026-05-01T08:00:00Z',
    fecha_fin: null,
    calidad: 'A',
    humedad_actual: 10.5, // Coincide con la última lectura de sobre-secado
    temp_actual: 32.5,
    progreso_secado: 115,
  },
  {
    id: 2,
    agricultor_id: 1,
    codigo_lote: 'LOTE-002-NS',
    variedad: 'Natural Seco',
    peso_inicial_qq: 85.0,
    precio_mercado_actual: 310.0,
    esta_activo: true,
    fecha_inicio: '2026-05-05T08:00:00Z',
    fecha_fin: null,
    calidad: 'C', 
    humedad_actual: 15.5, // Coincide con la lectura durante la lluvia
    temp_actual: 24.1,    // Temperatura baja por la lluvia
    progreso_secado: 45,
  },
  {
    id: 3,
    agricultor_id: 1,
    codigo_lote: 'LOTE-003-HM',
    variedad: 'Honey Maduro',
    peso_inicial_qq: 60.0,
    precio_mercado_actual: 340.0,
    esta_activo: true,
    fecha_inicio: '2026-04-15T08:00:00Z',
    fecha_fin: '2026-05-10T16:00:00Z',
    calidad: 'A+',
    humedad_actual: 11.8, // Ideal
    temp_actual: 26.5,
    progreso_secado: 100,
  },
]

// ── Seeded pseudo-random (LCG) ────────────────────────────────────────────────
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0x100000000
  }
}

// ── Lecturas por lote (Generador Lógico) ──────────────────────────────────────
function genLecturas(
  tempBase: number,
  hrBase: number,
  tempOffset: number,
  lluviaRango: [number, number] | null,
  seed: number,
  humedadStart: number,
  humedadEnd: number
) {
  const rng = makeRng(seed)
  return Array.from({ length: 24 }, (_, i) => {
    const progress = i / 23;
    const baseHumedad = humedadStart - ((humedadStart - humedadEnd) * progress);
    const isLluvia = lluviaRango ? i >= lluviaRango[0] && i <= lluviaRango[1] : false;

    // Consecuencias lógicas de la lluvia en el ambiente:
    const extraHrLluvia = isLluvia ? 20 : 0; // La humedad relativa sube un 20%
    const dropTempLluvia = isLluvia ? 5 : 0; // La temperatura cae 5 grados

    return {
      id: i + 1,
      hora: `${String(i).padStart(2, '0')}:00`,
      temp_ambiente: tempBase + Math.sin(i * 0.3 + tempOffset) * 5 + rng() * 2 - dropTempLluvia,
      humedad_relativa: hrBase + Math.cos(i * 0.25 + tempOffset) * 12 + rng() * 3 + extraHrLluvia,
      temp_grano: tempBase + 4 + Math.sin(i * 0.3 + 1) * 4 + rng() * 1.5 - dropTempLluvia,
      humedad_estimada: baseHumedad + rng() * 0.4,
      lluvia: isLluvia,
      voltaje_bateria: 3.8 - i * 0.01,
    }
  })
}

export const mockLecturasPerLote: Record<number, ReturnType<typeof genLecturas>> = {
  // Lote 1: Sobre-secado. Sin lluvia.
  1: genLecturas(28, 55, 0, null, 42, 14.5, 10.5),
  
  // Lote 2: Fermentación. Llueve "ahorita mismo" (horas 19 a 23).
  2: genLecturas(31, 62, 1.5, [19, 23], 77, 18.0, 15.5),
  
  // Lote 3: Ideal.
  3: genLecturas(26, 48, 3.0, null, 13, 12.2, 11.8),
}

export const mockLecturas = mockLecturasPerLote[1]

// ── Alertas ───────────────────────────────────────────────────────────────────
export const mockAlertas = [
  {
    id: 1,
    tipo: 'warning',
    titulo: 'Pérdida por Sobre-secado',
    descripcion: 'El lote LOTE-001-PL ha bajado del 12%. Registrando pérdida financiera.',
    hora: 'hace 10 min',
    lote: 'LOTE-001-PL',
  },
  {
    id: 2,
    tipo: 'info',
    titulo: 'Lluvia detectada en patio',
    descripcion: 'Lluvia activa. El LOTE-002-NS está húmedo, alto riesgo de fermentación.',
    hora: 'hace 5 min',
    lote: 'LOTE-002-NS',
  },
  {
    id: 3,
    tipo: 'success',
    titulo: 'Lote 003 estable',
    descripcion: 'Humedad objetivo sostenida (11.8%). Calidad A+ asegurada.',
    hora: 'hace 4 días',
    lote: 'LOTE-003-HM',
  },
]

export const mockDispositivos = [
  { id: 1, nombre_alias: 'Estaca Secador 1', mac: 'AA:BB:CC:DD:EE:01', activo: true,  bateria: 85, rssi: -62 },
  { id: 2, nombre_alias: 'Estaca Secador 2', mac: 'AA:BB:CC:DD:EE:02', activo: true,  bateria: 42, rssi: -75 },
  { id: 3, nombre_alias: 'Sensor Patio Norte', mac: 'AA:BB:CC:DD:EE:03', activo: false, bateria: 12, rssi: -91 },
]