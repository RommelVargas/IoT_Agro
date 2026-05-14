'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { mockLotes, mockLecturasPerLote, mockAlertas, mockDispositivos } from '@/lib/mock-data'

// ── Mini chart using SVG ──────────────────────────────────────────────────────
function SparkLine({ data, color = 'var(--green-500)', height = 48 }: {
  data: number[], color?: string, height?: number
}) {
  const w = 200, h = height
  const min = Math.min(...data), max = Math.max(...data)
  const norm = (v: number) => h - ((v - min) / (max - min)) * (h - 4) - 2
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${norm(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, icon, color = 'var(--green-500)', trend, data }: {
  label: string, value: string | number, unit: string,
  icon: React.ReactNode, color?: string, trend?: string, data?: number[]
}) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="text-label">{label}</span>
        <span style={{ color, opacity: 0.8 }}>{icon}</span>
      </div>
      <div>
        <span style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1, color }}>{value}</span>
        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>{unit}</span>
      </div>
      {data && <SparkLine data={data} color={color} />}
      {trend && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{trend}</span>}
    </div>
  )
}

// ── Alert item ────────────────────────────────────────────────────────────────
function AlertItem({ alerta }: { alerta: typeof mockAlertas[0] }) {
  const colors = {
    warning: { bg: 'var(--amber-glow)', border: 'rgba(245,158,11,0.3)', dot: '#f59e0b' },
    info:    { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', dot: '#3b82f6' },
    success: { bg: 'var(--green-glow)', border: 'var(--border-strong)', dot: '#22c55e' },
  }
  const c = colors[alerta.tipo as keyof typeof colors]
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem',
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, marginTop: 6, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{alerta.titulo}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{alerta.descripcion}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {alerta.lote} · {alerta.hora}
        </div>
      </div>
    </div>
  )
}

// ── Drying progress bar ───────────────────────────────────────────────────────
function SecadoProgress({ lote, selected, onClick }: {
  lote: typeof mockLotes[0], selected: boolean, onClick: () => void
}) {
  const color = lote.progreso_secado >= 100 ? 'var(--green-500)'
    : lote.progreso_secado > 60 ? 'var(--green-400)'
    : lote.progreso_secado > 30 ? 'var(--amber)'
    : 'var(--red)'

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(34,197,94,0.06)' : 'var(--bg-surface)',
        border: `1px solid ${selected ? 'var(--green-500)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem',
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
        <div>
          <span className="mono" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lote.codigo_lote}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>{lote.variedad}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {selected && (
            <span style={{ fontSize: '0.7rem', color: 'var(--green-400)', fontWeight: 600 }}>● en gráfica</span>
          )}
          <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{lote.progreso_secado}%</span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 100,
          background: color,
          width: `${lote.progreso_secado}%`,
          transition: 'width 1s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>HR actual: {lote.humedad_actual}%</span>
        <span>{lote.progreso_secado >= 100 ? '✓ Completado' : `T°: ${lote.temp_actual}°C`}</span>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [tick, setTick] = useState(0)
  const [selectedLoteId, setSelectedLoteId] = useState(mockLotes[0].id)
  const [chartMetric, setChartMetric] = useState<'temp' | 'humedad'>('temp')

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(id)
  }, [])

  const lecturas = mockLecturasPerLote[selectedLoteId] ?? mockLecturasPerLote[1]
  const selectedLote = mockLotes.find(l => l.id === selectedLoteId) ?? mockLotes[0]
  const ultima = lecturas[lecturas.length - 1]

  const tempData    = lecturas.map(l => Number(l.temp_ambiente.toFixed(1)))
  const humedadData = lecturas.map(l => Number(l.humedad_relativa.toFixed(1)))
  const chartData   = chartMetric === 'temp' ? tempData : humedadData
  const chartColor  = chartMetric === 'temp' ? 'var(--amber)' : 'var(--blue)'
  const chartLabel  = chartMetric === 'temp' ? 'Temperatura' : 'Humedad Relativa'

  const totalQQ  = mockLotes.filter(l => l.esta_activo).reduce((s, l) => s + l.peso_inicial_qq, 0)
  const valorUSD = mockLotes.filter(l => l.esta_activo).reduce((s, l) => s + l.peso_inicial_qq * l.precio_mercado_actual, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        padding: '1rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </Link>
          <span style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="badge badge-green">
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            En vivo
          </span>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--green-glow)', border: '1px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.875rem', color: 'var(--green-400)',
          }}>JA</div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: 1280, width: '100%', margin: '0 auto' }}>
        {/* Page title */}
        <div className="fade-in" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Finca Las Colinas
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {new Date().toLocaleDateString('es-NI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            · Última lectura hace {tick < 1 ? '0' : tick} min
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid-4 fade-in fade-in-delay-1" style={{ marginBottom: '1.5rem' }}>
          <MetricCard
            label="Temperatura Ambiente"
            value={ultima.temp_ambiente.toFixed(1)}
            unit="°C"
            color="var(--amber)"
            data={tempData}
            trend="↑ +1.2°C vs ayer"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>}
          />
          <MetricCard
            label="Humedad Relativa"
            value={ultima.humedad_relativa.toFixed(1)}
            unit="%"
            color="var(--blue)"
            data={humedadData}
            trend="↓ -3.4% vs ayer"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>}
          />
          <MetricCard
            label="Lotes en Secado"
            value={mockLotes.filter(l => l.esta_activo).length}
            unit={`/ ${mockLotes.length}`}
            color="var(--green-400)"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>}
          />
          <MetricCard
            label="Valor en Proceso"
            value={`$${(valorUSD / 1000).toFixed(1)}k`}
            unit="USD"
            color="var(--green-500)"
            trend={`${totalQQ.toFixed(0)} qq en proceso`}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Estado de secado — clic para seleccionar lote del gráfico */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 className="text-title">Estado de Secado</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Clic en un lote para ver su gráfica
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mockLotes.map(l => (
                  <SecadoProgress
                    key={l.id}
                    lote={l}
                    selected={l.id === selectedLoteId}
                    onClick={() => setSelectedLoteId(l.id)}
                  />
                ))}
              </div>
            </div>

            {/* Chart con selector de lote y métrica */}
            <div className="card">
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 className="text-title" style={{ marginBottom: '0.25rem' }}>
                    {chartLabel} — últimas 24h
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span className="mono">{selectedLote.codigo_lote}</span> · {selectedLote.variedad}
                  </p>
                </div>

                {/* Metric toggle */}
                <div style={{
                  display: 'flex', gap: '0.375rem',
                  background: 'var(--bg-surface)', padding: '3px', borderRadius: 8,
                  border: '1px solid var(--border)',
                }}>
                  {(['temp', 'humedad'] as const).map(m => (
                    <button
                      key={m}
                      id={`btn-chart-${m}`}
                      onClick={() => setChartMetric(m)}
                      style={{
                        padding: '0.3rem 0.75rem', borderRadius: 6,
                        fontSize: '0.8rem', fontWeight: 600,
                        background: chartMetric === m
                          ? (m === 'temp' ? 'var(--amber-glow)' : 'rgba(59,130,246,0.15)')
                          : 'transparent',
                        color: chartMetric === m
                          ? (m === 'temp' ? 'var(--amber)' : 'var(--blue)')
                          : 'var(--text-muted)',
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}>
                      {m === 'temp' ? '🌡 Temp' : '💧 Humedad'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lote pills */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {mockLotes.map(l => (
                  <button
                    key={l.id}
                    id={`btn-lote-${l.id}`}
                    onClick={() => setSelectedLoteId(l.id)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 100,
                      fontSize: '0.75rem', fontWeight: 600,
                      border: `1px solid ${l.id === selectedLoteId ? 'var(--green-500)' : 'var(--border)'}`,
                      background: l.id === selectedLoteId ? 'var(--green-glow)' : 'transparent',
                      color: l.id === selectedLoteId ? 'var(--green-400)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}>
                    {l.codigo_lote}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div style={{ position: 'relative', height: 120 }}>
                <SparkLine data={chartData} color={chartColor} height={120} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(to top, var(--bg-card), transparent)',
                  pointerEvents: 'none',
                }} />
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)',
              }}>
                {['00:00', '06:00', '12:00', '18:00', '23:00'].map(h => <span key={h}>{h}</span>)}
              </div>
            </div>

            {/* Dispositivos */}
            <div className="card">
              <h2 className="text-title" style={{ marginBottom: '1rem' }}>Dispositivos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mockDispositivos.map(d => (
                  <div key={d.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
                    padding: '0.875rem 1rem', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: d.activo ? 'var(--green-500)' : 'var(--text-muted)',
                        boxShadow: d.activo ? '0 0 6px var(--green-500)' : 'none',
                      }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{d.nombre_alias}</div>
                        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.mac}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>🔋 {d.bateria}%</span>
                      <span>{d.rssi} dBm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="text-title">Alertas</h2>
                <span className="badge badge-amber">{mockAlertas.length} activas</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mockAlertas.map(a => <AlertItem key={a.id} alerta={a} />)}
              </div>
            </div>

            {/* Lluvia del lote seleccionado */}
            <div className="card" style={{
              textAlign: 'center',
              background: ultima.lluvia ? 'rgba(59,130,246,0.08)' : 'var(--bg-card)',
              borderColor: ultima.lluvia ? 'rgba(59,130,246,0.3)' : 'var(--border)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {ultima.lluvia ? '🌧️' : '☀️'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                {ultima.lluvia ? 'Lluvia detectada' : 'Sin lluvia'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {selectedLote.codigo_lote} · en este momento
              </div>
            </div>

            {/* Pasaporte */}
            <Link href={`/agricultor/pasaporte/${selectedLoteId}`} style={{ display: 'block' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--green-900), var(--bg-card))',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem', cursor: 'pointer',
                transition: 'all var(--transition)',
              }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📄 Pasaporte Digital</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Certificado de calidad de <span className="mono">{selectedLote.codigo_lote}</span>
                </div>
                <span className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}>
                  Ver pasaporte →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
