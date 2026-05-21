'use client'
import Link from 'next/link'
import { mockLotes, mockAgricultores } from '@/lib/mock-data'

function QualityBadge({ calidad }: { calidad: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    'A+': { bg: 'rgba(34,197,94,0.15)', text: 'var(--green-400)', border: 'rgba(34,197,94,0.3)' },
    'A':  { bg: 'rgba(34,197,94,0.1)',  text: 'var(--green-500)', border: 'rgba(34,197,94,0.2)' },
    'B':  { bg: 'var(--amber-glow)',     text: 'var(--amber)',     border: 'rgba(245,158,11,0.3)' },
    'C':  { bg: 'var(--red-glow)',       text: 'var(--red)',       border: 'rgba(239,68,68,0.3)' },
  }
  const c = colors[calidad] || colors['B']
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48, borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`,
      fontWeight: 800, fontSize: '1.1rem', color: c.text,
      fontFamily: 'JetBrains Mono, monospace',
    }}>{calidad}</div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? 'var(--amber)' : 'none'}
          stroke="var(--amber)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--amber)', marginLeft: '0.25rem' }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ tip, children }: { tip: string; children: React.ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={e => {
        const tt = (e.currentTarget as HTMLElement).querySelector('.tt') as HTMLElement
        if (tt) tt.style.opacity = '1'
      }}
      onMouseLeave={e => {
        const tt = (e.currentTarget as HTMLElement).querySelector('.tt') as HTMLElement
        if (tt) tt.style.opacity = '0'
      }}>
      {children}
      <span className="tt" style={{
        position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a2e1e', border: '1px solid var(--border-strong)',
        borderRadius: 8, padding: '0.5rem 0.75rem',
        fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--text-primary)',
        whiteSpace: 'normal', width: 200, textAlign: 'left',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        opacity: 0, transition: 'opacity 0.15s ease',
        pointerEvents: 'none', zIndex: 50,
      }}>{tip}</span>
    </span>
  )
}

function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  )
}

const VARIEDAD_INFO: Record<string, string> = {
  'Pergamino Lavado': 'Proceso húmedo: se retira la cereza antes de secar. Sabor limpio, brillante y con alta acidez. El más exportado de Nicaragua.',
  'Natural Seco': 'Se seca con la cereza intacta alrededor del grano. Sabor frutal, dulce e intenso. Proceso más artesanal.',
  'Honey Maduro': 'Semi-lavado: se deja algo de mucílago en el grano al secar. Equilibrio entre sabor limpio y frutal. Alta demanda en mercados especiales.',
}

const CALIDAD_INFO: Record<string, string> = {
  'A+': 'Excelente. Secado ultra-uniforme, varianza térmica mínima y humedad perfecta (10-11%). Apto para mercados de especialidad premium.',
  'A': 'Muy bueno. Proceso de secado consistente y humedad dentro del rango ideal. Estándar de exportación.',
  'B': 'Bueno. Algunos picos de temperatura durante el secado. Apto para exportación con descuento menor.',
  'C': 'Aceptable. Varianza alta en el proceso. Posibles defectos menores. Para mercado local o blends.',
}

function LoteCard({ lote }: { lote: typeof mockLotes[0] }) {
  const valor = (lote.peso_inicial_qq * lote.precio_mercado_actual).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const agricultor = mockAgricultores.find(a => a.id === lote.agricultor_id)

  return (
    <Link href={`/comprador/lotes/${lote.id}`} id={`lote-card-${lote.id}`}>
      <div className="card" style={{
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
        cursor: 'pointer', height: '100%',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-3px)'
        el.style.borderColor = 'var(--border-strong)'
        el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3), 0 0 20px var(--green-glow)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'var(--shadow-card)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              {lote.codigo_lote}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{lote.variedad}</span>
              {VARIEDAD_INFO[lote.variedad] && (
                <Tooltip tip={VARIEDAD_INFO[lote.variedad]}><InfoIcon /></Tooltip>
              )}
            </div>
          </div>
          <Tooltip tip={CALIDAD_INFO[lote.calidad] ?? 'Calificación de calidad basada en el proceso de secado.'}>
            <QualityBadge calidad={lote.calidad} />
          </Tooltip>
        </div>

        {/* Agricultor / fiabilidad */}
        {agricultor && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--green-glow)', border: '1px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.7rem', color: 'var(--green-400)',
              flexShrink: 0,
            }}>{agricultor.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.125rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.825rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {agricultor.nombre}
                </span>
                {agricultor.verificado && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--green-500)" stroke="none">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StarRating rating={agricultor.rating} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ({agricultor.reviews} reseñas · {agricultor.lotes_completados} lotes)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stats con tooltips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {([
            {
              label: 'Peso',
              value: `${lote.peso_inicial_qq} qq`,
              tip: 'Quintales (qq): unidad de peso del café. 1 qq ≈ 46 kg. Es la unidad de compra estándar en Nicaragua y Centroamérica.',
            },
            {
              label: 'Precio/qq',
              value: `$${lote.precio_mercado_actual}`,
              tip: 'Precio de mercado por quintal en USD. El rango internacional de café de especialidad es $240–$380/qq según calidad y variedad.',
            },
            {
              label: 'Valor total',
              value: valor,
              tip: 'Estimado económico del lote = peso × precio/qq actual. Valor referencial; el precio final se negocia con el productor.',
            },
            {
              label: 'Humedad',
              value: lote.humedad_actual ? `${lote.humedad_actual}%` : '—',
              tip: '% de agua en el grano. Rango ideal: 10–12%. Sobre 14% = riesgo de hongos y pérdida de calidad. Bajo 10% = grano quebradizo.',
            },
          ] as { label: string; value: string; tip: string }[]).map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
              padding: '0.625rem 0.875rem', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {s.label}
                <Tooltip tip={s.tip}><InfoIcon /></Tooltip>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={`badge ${lote.esta_activo ? 'badge-green' : 'badge-amber'}`}>
            {lote.esta_activo ? <><span className="pulse-dot" style={{ width: 6, height: 6 }} /> En secado</> : '✓ Completado'}
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.8rem', color: 'var(--green-400)', fontWeight: 600,
          }}>
            Ver pasaporte
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function CompradorPage() {
  const lotesActivos = mockLotes.filter(l => l.esta_activo)
  const lotesCompletados = mockLotes.filter(l => !l.esta_activo)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        padding: '1rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
            <div style={{
              width: 32, height: 32, background: 'var(--green-500)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                <path d="M12 22V12M12 12C12 7 17 3 17 3s-1 5-5 9zM12 12C12 7 7 3 7 3s1 5 5 9z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.0625rem' }}>IoT Agro</span>
          </Link>
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Marketplace de Café · Nicaragua
        </span>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '4rem 2rem 3rem',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(34,197,94,0.04) 0%, transparent 100%)',
        textAlign: 'center',
      }}>
        <div className="fade-in">
          <span className="badge badge-green" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
            Calidad certificada por IoT
          </span>
          <h1 className="text-hero" style={{ marginBottom: '1rem', maxWidth: 560, margin: '0 auto 1rem' }}>
            Comprá café de origen con datos reales
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Cada lote tiene un Pasaporte Digital con temperatura, humedad y proceso de secado registrados en tiempo real desde sensores IoT en la finca.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            {[
              { label: 'Lotes activos', value: lotesActivos.length },
              { label: 'QQ disponibles', value: lotesActivos.reduce((s, l) => s + l.peso_inicial_qq, 0) },
              { label: 'Precio promedio', value: `$${(mockLotes.reduce((s, l) => s + l.precio_mercado_actual, 0) / mockLotes.length).toFixed(0)}/qq` },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--green-400)' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lotes grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {lotesActivos.length > 0 && (
          <section className="fade-in fade-in-delay-1" style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Disponibles ahora</h2>
              <span className="badge badge-green">{lotesActivos.length} lotes</span>
            </div>
            <div className="grid-3">
              {lotesActivos.map(l => <LoteCard key={l.id} lote={l} />)}
            </div>
          </section>
        )}

        {lotesCompletados.length > 0 && (
          <section className="fade-in fade-in-delay-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Lotes completados</h2>
              <span className="badge badge-amber">{lotesCompletados.length} lotes</span>
            </div>
            <div className="grid-3">
              {lotesCompletados.map(l => <LoteCard key={l.id} lote={l} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
