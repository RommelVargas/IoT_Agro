'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { findAgricultorByCredentials, MOCK_SESSION_KEY } from '@/lib/mock-data'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))
    // TODO: reemplazar con endpoint Django cuando esté listo
    const agricultor = findAgricultorByCredentials(email, password)
    if (!agricultor) {
      setError('Credenciales incorrectas o usuario inactivo.')
      setLoading(false)
      return
    }
    localStorage.setItem(MOCK_SESSION_KEY, String(agricultor.id))
    router.push('/agricultor/dashboard')
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(34,197,94,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: 420 }}>
        {/* Back link */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem',
          transition: 'color var(--transition)',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          Volver al inicio
        </Link>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: 44, height: 44,
            background: 'var(--green-500)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
              <path d="M12 22V12M12 12C12 7 17 3 17 3s-1 5-5 9zM12 12C12 7 7 3 7 3s1 5 5 9z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>IoT Agro</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Portal del Agricultor</div>
          </div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bienvenido</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Ingresá a tu cuenta para gestionar tus lotes y sensores.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Correo electrónico
              </label>
              <input
                id="input-email"
                type="email"
                className="input"
                placeholder="tu@finca.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Contraseña
              </label>
              <input
                id="input-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{
                background: 'var(--red-glow)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: 'var(--red)',
              }}>
                {error}
              </div>
            )}

            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Ingresando...
                </>
              ) : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '1.5rem',
          fontSize: '0.8rem', color: 'var(--text-muted)',
        }}>
          ¿Sos comprador?{' '}
          <Link href="/comprador" style={{ color: 'var(--green-400)', fontWeight: 500 }}>
            Ver lotes disponibles
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
