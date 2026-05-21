'use client'
import Link from 'next/link'
import { mockLotes, mockLecturas } from '@/lib/mock-data'
import { use } from 'react'

function VerifiedRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.875rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
    </div>
  )
}

function QRCode({ seed = '' }: { seed?: string }) {
  // Patrón determinista basado en el código del lote
  const base = [
    1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,
    1,0,1,0,1,0,1,
    1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,
  ]
  // Rellena los bits de datos usando el seed
  const cells = base.map((v, i) => {
    if (v === 1) return true
    const c = seed.charCodeAt(i % seed.length) || 42
    return (c + i) % 3 !== 0
  })
  return (
    <div style={{
      background: '#fff', padding: '16px', borderRadius: 12,
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, width: 'fit-content',
    }}>
      {cells.map((filled, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: filled ? '#000' : '#fff' }} />
      ))}
    </div>
  )
}

export default function PasaportePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const lote = mockLotes.find(l => l.id === parseInt(id)) ?? mockLotes[0]
  const ultimas = mockLecturas.slice(-6)

  const minTemp = Math.min(...mockLecturas.map(l => l.temp_ambiente)).toFixed(1)
  const maxTemp = Math.max(...mockLecturas.map(l => l.temp_ambiente)).toFixed(1)
  const avgHR   = (mockLecturas.reduce((s, l) => s + l.humedad_relativa, 0) / mockLecturas.length).toFixed(1)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        padding: '1rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}>
        <Link href="/comprador" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          color: 'var(--text-muted)', fontSize: '0.875rem',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          Volver a lotes
        </Link>
        <span className="badge badge-green">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          Certificado verificado
        </span>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Pasaporte header */}
        <div className="fade-in" style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(22,163,74,0.08) 100%)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 240, height: 240,
            background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 44, height: 44, background: 'var(--green-500)',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                    <path d="M12 22V12M12 12C12 7 17 3 17 3s-1 5-5 9zM12 12C12 7 7 3 7 3s1 5 5 9z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>IoT Agro</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pasaporte Digital Certificado</div>
                </div>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {lote.variedad}
              </h1>
              <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {lote.codigo_lote}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>
                  Calidad {lote.calidad}
                </span>
                <span className={`badge ${lote.esta_activo ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.8rem' }}>
                  {lote.esta_activo ? '● En proceso' : '✓ Completado'}
                </span>
              </div>
            </div>

            {/* QR */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <QRCode seed={lote.codigo_lote} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Escanear para verificar</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Datos comerciales */}
          <div className="card fade-in fade-in-delay-1">
            <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Datos Comerciales</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Información del lote</p>
            <VerifiedRow label="Código de lote" value={lote.codigo_lote} />
            <VerifiedRow label="Variedad" value={lote.variedad} />
            <VerifiedRow label="Peso inicial" value={`${lote.peso_inicial_qq} quintales`} />
            <VerifiedRow label="Precio por quintal" value={`$${lote.precio_mercado_actual} USD`} />
            <VerifiedRow label="Valor total estimado" value={`$${(lote.peso_inicial_qq * lote.precio_mercado_actual).toLocaleString()} USD`} />
            <VerifiedRow label="Fecha de inicio" value={new Date(lote.fecha_inicio).toLocaleDateString('es-NI')} />
          </div>

          {/* Datos del proceso */}
          <div className="card fade-in fade-in-delay-2">
            <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Datos del Proceso</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Registrados por IoT</p>
            <VerifiedRow label="Temp. mínima registrada" value={`${minTemp}°C`} />
            <VerifiedRow label="Temp. máxima registrada" value={`${maxTemp}°C`} />
            <VerifiedRow label="Humedad relativa promedio" value={`${avgHR}%`} />
            <VerifiedRow label="Humedad del grano actual" value={`${lote.humedad_actual}%`} />
            <VerifiedRow label="Progreso de secado" value={`${lote.progreso_secado}%`} />
            <VerifiedRow label="Lecturas registradas" value={`${mockLecturas.length.toLocaleString()} muestras`} />
          </div>
        </div>

        {/* Últimas lecturas */}
        <div className="card fade-in fade-in-delay-3">
          <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Últimas Lecturas de Sensor</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Registros más recientes verificados</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Hora', 'T° Amb.', 'H. Rel.', 'T° Grano', 'H. Grano', 'Lluvia'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ultimas.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="mono" style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{l.hora}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{l.temp_ambiente.toFixed(1)}°C</td>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{l.humedad_relativa.toFixed(1)}%</td>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{l.temp_grano.toFixed(1)}°C</td>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{l.humedad_estimada.toFixed(1)}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${l.lluvia ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.7rem' }}>
                        {l.lluvia ? '🌧 Sí' : '☀ No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            ¿Te interesa este lote? Próximamente habilitaremos el contacto directo con el productor.
          </p>
          <button
            id="btn-contactar"
            disabled
            className="btn btn-primary btn-lg"
            style={{ opacity: 0.4, cursor: 'not-allowed' }}
            title="Función en desarrollo">
            Contactar productor · Próximamente
          </button>
        </div>
      </main>
    </div>
  )
}
