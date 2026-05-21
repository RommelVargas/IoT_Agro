import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IoT Agro — Radar Financiero del Café',
  description: 'Plataforma de monitoreo IoT para fincas cafetaleras. Seguimiento en tiempo real de secado, calidad y pasaporte digital del lote.',
  keywords: 'IoT, café, sensores, secado, calidad, Nicaragua, finca',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
