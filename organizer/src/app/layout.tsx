import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Organizer Sociiz',
  description: 'Organizer interno da Sociiz para acompanhar demandas, projetos, incidentes e documentação.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;700;800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  )
}
