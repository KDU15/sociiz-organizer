'use client'

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="page-head">
      <span className="eyebrow">Sociiz · Desenvolvimento</span>
      <h1>{title}</h1>
    </div>
  )
}
