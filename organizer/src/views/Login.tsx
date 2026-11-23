'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    router.push('/quadro')
  }

  return (
    <div className="login">
      <section className="login__brand" aria-label="Organizer">
        <div className="login__logo">
          <img src="/sociiz-logo.svg" alt="Sociiz" />
          <span className="login__sep" aria-hidden="true" />
          <span>Organizer</span>
        </div>
        <div className="login__spacer" />
        <span className="login__footer">© 2026 Sociiz · Uso interno</span>
      </section>

      <main className="login__panel">
        <form className="login__form enter enter-2" onSubmit={onSubmit}>

          <label className="field">
            <span className="label">E-mail</span>
            <input className="input" type="email" autoComplete="username" placeholder="nome@sociiz.com.br" />
          </label>

          <div className="field">
            <div className="field__row">
              <label htmlFor="senha" className="label">Senha</label>
              <a href="#" className="draw">Esqueci minha senha</a>
            </div>
            <div className="field__password">
              <input
                id="senha"
                className="input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                style={{ paddingRight: 52 }}
              />
              <button
                type="button"
                className="eye"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z" />
                  <circle cx="10" cy="10" r="2.2" />
                  {showPassword && <path d="M3.5 3.5l13 13" />}
                </svg>
              </button>
            </div>
          </div>

          <label className="login__remember">
            <input type="checkbox" />
            Manter conectado neste computador
          </label>

          <button type="submit" className="btn btn-accent">Entrar no Organizer</button>

          <p className="login__help">Sem acesso? Peça ao Dev principal da sua equipe.</p>
        </form>
      </main>
    </div>
  )
}
