type ClassValue = string | false | null | undefined

/** Une clases condicionales. Suficiente para este proyecto; no se necesita clsx. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
