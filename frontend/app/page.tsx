'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          width: 36, height: 36,
          background: 'var(--green-500)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 6v6l4 2" />
            <circle cx="18" cy="6" r="4" fill="var(--green-500)" stroke="#000" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em' }}>IoT Agro</span>
        <span style={{
          marginLeft: '0.5rem',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          background: 'var(--green-glow)',
          padding: '2px 8px',
          borderRadius: 100,
          border: '1px solid var(--border)',
        }}>Beta</span>
      </header>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-in" style={{ textAlign: 'center', maxWidth: 640, position: 'relative' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-green">
              <span className="pulse-dot" />
              Sistema activo · 3 lotes en monitoreo
            </span>
          </div>

          <h1 className="text-display" style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #86efac 50%, #22c55e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.25rem',
          }}>
            Radar Financiero del Café
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '3.5rem',
          }}>
            Monitoreo IoT en tiempo real para fincas cafetaleras de Nicaragua.
            Secado inteligente, calidad certificada, mercado transparente.
          </p>

          {/* Role selector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            maxWidth: 560,
            margin: '0 auto',
          }}>
            <Link href="/agricultor/login" id="btn-agricultor">
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--green-500)'
                el.style.boxShadow = '0 0 30px var(--green-glow)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--green-glow)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-400)" strokeWidth="2">
                    <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
                    <path d="M8 12h8M8 8h8M8 16h5"/>
                    <circle cx="19" cy="5" r="3" fill="var(--green-500)" stroke="none"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.375rem' }}>Agricultor</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Gestioná tus lotes, monitoreá sensores y controlá el proceso de secado.
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  fontSize: '0.875rem', fontWeight: 600, color: 'var(--green-400)',
                }}>
                  Acceder <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>
              </div>
            </Link>

            <Link href="/comprador" id="btn-comprador">
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(245,158,11,0.5)'
                el.style.boxShadow = '0 0 30px rgba(245,158,11,0.1)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.375rem' }}>Comprador</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Explorá lotes disponibles, verificá calidad y accedé al Pasaporte Digital.
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  fontSize: '0.875rem', fontWeight: 600, color: 'var(--amber)',
                }}>
                  Ver lotes <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer stats */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
      }}>
        {[
          { label: 'Lotes activos', value: '2' },
          { label: 'Lecturas hoy', value: '1,248' },
          { label: 'Dispositivos online', value: '2/3' },
          { label: 'Uptime', value: '99.8%' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--green-400)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </footer>
    </main>
  )
}
