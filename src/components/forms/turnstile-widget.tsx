'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | undefined

function loadTurnstileScript(nonce: string | undefined): Promise<void> {
  if (window.turnstile) return Promise.resolve()

  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    if (nonce) script.nonce = nonce
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = undefined
      script.remove()
      reject(new Error('No se pudo cargar Turnstile'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

type TurnstileWidgetProps = {
  siteKey: string
  nonce: string | undefined
  /** Recibe el token cuando se resuelve el desafío, o `null` si caduca o falla. */
  onToken: (token: string | null) => void
  /** Cambia este valor para pedir un token nuevo (tras enviar el formulario). */
  resetKey: number
}

/**
 * Cloudflare Turnstile en modo "solo si hace falta": no muestra nada salvo que
 * Cloudflare requiera interacción. Solo se monta cuando la persona empieza a usar
 * el formulario, así no se contacta con terceros al cargar la página.
 */
export function TurnstileWidget({ siteKey, nonce, onToken, resetKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | undefined>(undefined)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    let cancelled = false

    loadTurnstileScript(nonce)
      .then(() => {
        const container = containerRef.current
        if (cancelled || !container || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          language: 'es',
          theme: 'light',
          appearance: 'interaction-only',
          size: container.clientWidth < 300 ? 'compact' : 'flexible',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      })
      .catch(() => onTokenRef.current(null))

    return () => {
      cancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
      widgetIdRef.current = undefined
    }
  }, [siteKey, nonce])

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
  }, [resetKey])

  return <div ref={containerRef} className="mt-4 empty:hidden" />
}
