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
    // Credenciales de demo — en producción esto viene del backend
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

// ── Auth mock — devuelve el agricultor si las credenciales coinciden y está activo
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
    humedad_actual: 14.2,
    temp_actual: 32.5,
    progreso_secado: 72,
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
    calidad: 'B',
    humedad_actual: 18.7,
    temp_actual: 30.1,
    progreso_secado: 45,
  },
  {
    id: 3,
    agricultor_id: 1,
    codigo_lote: 'LOTE-003-HM',
    variedad: 'Honey Maduro',
    peso_inicial_qq: 60.0,
    precio_mercado_actual: 340.0,
    esta_activo: false,
    fecha_inicio: '2026-04-15T08:00:00Z',
    fecha_fin: '2026-05-10T16:00:00Z',
    calidad: 'A+',
    humedad_actual: 11.5,
    temp_actual: null,
    progreso_secado: 100,
  },
]

// ── Seeded pseudo-random (LCG) — elimina el mismatch de hidratación ──────────
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0x100000000
  }
}

// ── Lecturas por lote (distintas curvas para cada uno) ────────────────────────
function genLecturas(
  tempBase: number,
  hrBase: number,
  tempOffset: number,
  lluviaRango: [number, number] | null,
  seed: number
) {
  const rng = makeRng(seed)
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    hora: `${String(i).padStart(2, '0')}:00`,
    temp_ambiente: tempBase + Math.sin(i * 0.3 + tempOffset) * 5 + rng() * 2,
    humedad_relativa: hrBase + Math.cos(i * 0.25 + tempOffset) * 12 + rng() * 3,
    temp_grano: tempBase + 4 + Math.sin(i * 0.3 + 1) * 4 + rng() * 1.5,
    humedad_estimada: 16 - i * 0.15 + rng() * 0.5,
    lluvia: lluviaRango ? i >= lluviaRango[0] && i <= lluviaRango[1] : false,
    voltaje_bateria: 3.8 - i * 0.01,
  }))
}

export const mockLecturasPerLote: Record<number, ReturnType<typeof genLecturas>> = {
  1: genLecturas(28, 55, 0,   [18, 20], 42),
  2: genLecturas(31, 62, 1.5, null,     77),
  3: genLecturas(26, 48, 3.0, null,     13),
}

// Backward-compat default (lote 1)
export const mockLecturas = mockLecturasPerLote[1]

// ── Alertas ───────────────────────────────────────────────────────────────────
export const mockAlertas = [
  {
    id: 1,
    tipo: 'warning',
    titulo: 'Humedad elevada en Lote 002',
    descripcion: 'La humedad del grano supera el 18%. Riesgo de hongos si continúa.',
    hora: 'hace 23 min',
    lote: 'LOTE-002-NS',
  },
  {
    id: 2,
    tipo: 'info',
    titulo: 'Lluvia detectada',
    descripcion: 'El sensor detectó presencia de lluvia. Verificar cobertura del patio.',
    hora: 'hace 2 h',
    lote: 'LOTE-001-PL',
  },
  {
    id: 3,
    tipo: 'success',
    titulo: 'Lote 003 completó secado',
    descripcion: 'Humedad objetivo alcanzada (11.5%). Listo para almacenamiento.',
    hora: 'hace 4 días',
    lote: 'LOTE-003-HM',
  },
]

// ── Dispositivos ──────────────────────────────────────────────────────────────
export const mockDispositivos = [
  { id: 1, nombre_alias: 'Estaca Secador 1', mac: 'AA:BB:CC:DD:EE:01', activo: true,  bateria: 85, rssi: -62 },
  { id: 2, nombre_alias: 'Estaca Secador 2', mac: 'AA:BB:CC:DD:EE:02', activo: true,  bateria: 42, rssi: -75 },
  { id: 3, nombre_alias: 'Sensor Patio Norte', mac: 'AA:BB:CC:DD:EE:03', activo: false, bateria: 12, rssi: -91 },
]
