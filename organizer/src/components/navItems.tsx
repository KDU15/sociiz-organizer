import type { ReactNode } from 'react'

export type NavItem = { to: string; label: string; icon: ReactNode }

const svg = (children: ReactNode, extra: Record<string, string> = {}) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...extra}
  >
    {children}
  </svg>
)

export const navItems: NavItem[] = [
  {
    to: '/visao-geral',
    label: 'Visão geral',
    icon: svg(
      <>
        <rect x="3" y="3" width="6" height="6" rx="1.5" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" />
      </>,
    ),
  },
  {
    to: '/quadro',
    label: 'Quadro de demandas',
    icon: svg(
      <>
        <rect x="3" y="3" width="4" height="14" rx="1.5" />
        <rect x="8" y="3" width="4" height="9" rx="1.5" />
        <rect x="13" y="3" width="4" height="11" rx="1.5" />
      </>,
    ),
  },
  { to: '/backlog', label: 'Backlog', icon: svg(<path d="M3 6h14M3 10h14M3 14h9" />) },
  {
    to: '/projetos',
    label: 'Projetos',
    icon: svg(
      <path d="M3 5.5V15a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 17 15V7.5A1.5 1.5 0 0 0 15.5 6H10L8.5 4H4.5A1.5 1.5 0 0 0 3 5.5z" />,
    ),
  },
  {
    to: '/indicadores',
    label: 'Indicadores',
    icon: svg(<path d="M3 17h14M5.5 14v-4M10 14V5M14.5 14V8" />),
  },
  {
    to: '/templates-docs',
    label: 'Templates e docs',
    icon: svg(
      <>
        <path d="M5 3h6l4 4v10H5z" />
        <path d="M11 3v4h4M7.5 11h5M7.5 14h5" />
      </>,
    ),
  },
  {
    to: '/incidentes',
    label: 'Incidentes',
    icon: svg(
      <>
        <path d="M10 3.5 17.5 16h-15z" />
        <path d="M10 8.5v3.5M10 14.25v.01" />
      </>,
    ),
  },
]
