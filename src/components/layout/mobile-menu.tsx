'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import type { NavItem } from '@/content/types'
import { cn } from '@/lib/cn'

import { ButtonLink } from '@/components/ui/button'
import { CloseIcon, MenuIcon } from '@/components/ui/icons'

type MobileMenuProps = { items: NavItem[]; cta: NavItem }

/** Menú desplegable para pantallas estrechas. Patrón de botón de divulgación (no modal). */
export function MobileMenu({ items, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-abeto px-4 font-display text-ui font-semibold text-abeto hover:bg-abeto hover:text-niebla"
      >
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        Menú
      </button>

      <nav
        id={panelId}
        aria-label="Menú móvil"
        className={cn(
          open ? 'block' : 'hidden',
          'absolute inset-x-0 top-full border-b border-salvia bg-papel px-5 pt-3 pb-6 shadow-float sm:px-8',
        )}
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-salvia/60 font-display text-lg font-medium text-abeto"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href={cta.href} onClick={() => setOpen(false)} className="mt-5 w-full">
          {cta.label}
        </ButtonLink>
      </nav>
    </div>
  )
}
