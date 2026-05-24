'use client'
import Link from 'next/link'
import { mockLotes, mockLecturasPerLote } from '@/lib/mock-data'
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
  const base = [
    1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,
    1,0,1,0,1,0,1,
    1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,
  ]
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
  const loteId = parseInt(id)
  
  // Sincronizado con el mock dinámico
  const lote = mockLotes.find(l => l.id === loteId) ?? mockLotes[0]
  const lecturasLote = mockLecturasPerLote[lote.id] ?? mockLecturasPerLote[1]
  const ultimaLectura = lecturasLote[lecturasLote.length - 1]

  const minTemp = Math.min(...lecturasLote.map(l => l.temp_ambiente)).toFixed(1)
  const maxTemp = Math.max(...lecturasLote.map(l => l.temp_ambiente)).toFixed(1)
  const avgHR   = (lecturasLote.reduce((s, l) => s + l.humedad_relativa, 0) / lecturasLote.length).toFixed(1)

  // Calidad final real
  const humedadFinal = ultimaLectura.humedad_estimada
  let calidadDinamica = "C"
  if (humedadFinal >= 11.0 && humedadFinal <= 12.2) calidadDinamica = "A+"
  else if (humedadFinal >= 10.5 && humedadFinal <= 12.5) calidadDinamica = "A"
  else if (humedadFinal >= 9.5 && humedadFinal <= 13.5) calidadDinamica = "B"

  // Valor financiero ajustado
  const valorTotalTeorico = lote.peso_inicial_qq * lote.precio_mercado_actual
  const valorTotalReal = Math.max(0, valorTotalTeorico - ultimaLectura.devaluacion)

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
          Volver al Marketplace
        </Link>
        <span className="badge badge-green">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          Blockchain Verified (Demo)
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Certificado Técnico de Origen</div>
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
                  Calidad {calidadDinamica}
                </span>
                <span className={`badge ${lote.esta_activo ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.8rem' }}>
                  {lote.esta_activo ? '● En secado activo' : '✓ Lote estabilizado'}
                </span>
              </div>
            </div>

            {/* QR */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <QRCode seed={lote.codigo_lote} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Autenticidad digital</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Datos comerciales */}
          <div className="card fade-in fade-in-delay-1">
            <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Valor de Mercado</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Cálculo comercial verificado</p>
            <VerifiedRow label="Código de lote" value={lote.codigo_lote} />
            <VerifiedRow label="Variedad botánica" value={lote.variedad} />
            <VerifiedRow label="Masa disponible" value={`${lote.peso_inicial_qq} qq`} />
            <VerifiedRow label="Precio de referencia" value={`$${lote.precio_mercado_actual}/qq USD`} />
            <VerifiedRow label="Tasación ajustada (Merma)" value={`$${valorTotalReal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          </div>

          {/* Datos del proceso */}
          <div className="card fade-in fade-in-delay-2">
            <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Datos del Proceso</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Histórico telemétrico del proceso</p>
            <VerifiedRow label="Clima: Temp. mínima" value={`${minTemp}°C`} />
            <VerifiedRow label="Clima: Temp. máxima" value={`${maxTemp}°C`} />
            <VerifiedRow label="Clima: Humedad Rel. (Promedio)" value={`${avgHR}%`} />
            <VerifiedRow label="Estado físico: Humedad grano" value={`${humedadFinal.toFixed(1)}%`} />
            <VerifiedRow label="Validación telemétrica" value={`${lecturasLote.length.toLocaleString()} pings`} />
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: 300 }}
            onClick={() => alert(`Oferta de compra enviada al productor por el lote ${lote.codigo_lote}`)}>
            Enviar oferta de compra
          </button>
        </div>
      </main>
    </div>
  )
}