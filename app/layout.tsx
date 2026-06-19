import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Academia', template: '%s | Academia' },
  description: 'Plataforma de cursos online',
  openGraph: {
    title: 'Academia',
    description: 'Plataforma de cursos online',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
