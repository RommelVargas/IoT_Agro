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
    calidad: 'B',
    humedad_actual: 9.5,
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
    humedad_actual: 15.5,
    temp_actual: 24.1, 
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
    humedad_actual: 11.8, 
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

// ── Lecturas por lote (Generador Físico y Financiero REALISTA) ────────────────
function genLecturas(
  tempBase: number, tempPeak: number, hrBase: number, hrDrop: number,
  lluviaRango: [number, number] | null, seed: number, 
  humedadStart: number, humedadTarget: number,
  peso_inicial: number, precio_actual: number
) {
  const rng = makeRng(seed)
  let currentHumedadGrano = humedadStart;
  
  // El lote empieza en perfecto estado. Solo se devalúa si pasa algo grave.
  let factorCalidad = 1.00; 

  return Array.from({ length: 24 }, (_, i) => {
    const isLluvia = lluviaRango ? i >= lluviaRango[0] && i <= lluviaRango[1] : false;
    
    // Curva solar: pico a las 14:00 hrs
    const factorSolar = Math.exp(-Math.pow((i - 14), 2) / 18);
    
    // Impacto de lluvia en el ambiente
    const dropTempLluvia = isLluvia ? 5 + rng() * 2 : 0;
    const extraHrLluvia = isLluvia ? 25 : 0;

    const temp_ambiente = tempBase + (tempPeak * factorSolar) + rng() * 1.5 - dropTempLluvia;
    let humedad_relativa = hrBase - (hrDrop * factorSolar) + rng() * 3 + extraHrLluvia;
    if (humedad_relativa > 100) humedad_relativa = 100;

    const temp_grano = temp_ambiente + (factorSolar * 4) + rng() - dropTempLluvia;

    // Físicas de secado de la masa del grano
    if (isLluvia) {
      currentHumedadGrano += 0.15; // Reabsorbe agua por estar en la lluvia
    } else {
      const speed = Math.max(0.1, (temp_ambiente - 15) / 15);
      const drop = ((humedadStart - humedadTarget) / 12) * speed;
      currentHumedadGrano -= drop + (rng() * 0.05);
    }

    // --- CÁLCULO FINANCIERO CORREGIDO (EMPIEZA EN $0) ---
    
    // 1. Riesgo de fermentación: Sube drásticamente si está lloviendo sobre café húmedo
    let riesgo = 5.0; 
    if (isLluvia && currentHumedadGrano > 12.5) {
      riesgo = 85.0; 
    }

    // 2. Daño a la Calidad (IRREVERSIBLE): Si se fermenta, baja de categoría para siempre
    if (riesgo > 60.0 && factorCalidad > 0.85) {
      factorCalidad = 0.85; // Se manchó, baja a Categoría B y pierde 15% de su valor
    }

    // 3. Pérdida de Masa (Temporal): Solo pierdes dinero si la humedad baja de 12%
    let peso_actual = peso_inicial;
    if (currentHumedadGrano < 12.0) {
      const frac_ideal = 1.0 - 0.12;
      const frac_actual = 1.0 - (currentHumedadGrano / 100.0);
      peso_actual = peso_inicial * (frac_ideal / frac_actual);
    }

    // 4. Devaluación total (Debe empezar en 0 y solo subir por daño o sobresecado)
    const valor_potencial_maximo = peso_inicial * precio_actual;
    const valor_real_actual = peso_actual * (precio_actual * factorCalidad);
    const devaluacion = Math.max(0, valor_potencial_maximo - valor_real_actual);

    return {
      id: i + 1,
      hora: `${String(i).padStart(2, '0')}:00`,
      temp_ambiente,
      humedad_relativa,
      temp_grano,
      humedad_estimada: currentHumedadGrano,
      lluvia: isLluvia,
      voltaje_bateria: 3.8 - i * 0.01,
      devaluacion 
    }
  })
}

export const mockLecturasPerLote: Record<number, ReturnType<typeof genLecturas>> = {
  // Lote 1: Sobre-secado. Día caliente, baja hasta el 9.5%.
  1: genLecturas(18, 16, 90, 45, null, 42, 14.5, 9.5, 120.5, 280.0),
  
  // Lote 2: Fermentación. Lluvia fuerte de 14:00 a 18:00 hrs.
  2: genLecturas(17, 14, 92, 40, [14, 18], 77, 16.5, 11.5, 85.0, 310.0),
  
  // Lote 3: Ideal. Día estable, secado perfecto.
  3: genLecturas(19, 11, 85, 35, null, 13, 13.5, 11.8, 60.0, 340.0),
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

// ── Dispositivos ──────────────────────────────────────────────────────────────
export const mockDispositivos = [
  {
    id: 1,
    nombre_alias: 'Estaca Secador 1',
    mac: 'AA:BB:CC:DD:EE:01',
    activo: true,
    bateria: 85,
    rssi: -62,
  },
  {
    id: 2,
    nombre_alias: 'Estaca Secador 2',
    mac: 'AA:BB:CC:DD:EE:02',
    activo: true,
    bateria: 42,
    rssi: -75,
  },
  {
    id: 3,
    nombre_alias: 'Sensor Patio Norte',
    mac: 'AA:BB:CC:DD:EE:03',
    activo: false,
    bateria: 12,
    rssi: -91,
  },
]