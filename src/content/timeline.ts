import type { TimelineEntry, TimelineKind } from './types'

export const timelineKindLabels: Record<TimelineKind, string> = {
  formacion: 'Formación',
  hito: 'Hito',
  proyecto: 'Proyecto',
  publicacion: 'Publicación',
  aparicion: 'Aparición',
  colaboracion: 'Colaboración',
}

/**
 * Entradas de la trayectoria, de la más antigua a la más reciente.
 * Las cuatro entradas actuales son de muestra: sustitúyelas por datos confirmados.
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'muestra-formacion',
    period: 'TODO: año',
    kind: 'formacion',
    title: 'TODO: Titulación o formación',
    description: 'TODO: Centro, programa y qué aportó a su forma de trabajar.',
    placeholder: true,
  },
  {
    id: 'muestra-proyecto',
    period: 'TODO: año',
    kind: 'proyecto',
    title: 'TODO: Proyecto o hito profesional',
    description: 'TODO: Qué hizo y con quién, solo con datos confirmados.',
    placeholder: true,
  },
  {
    id: 'muestra-publicacion',
    period: 'TODO: año',
    kind: 'publicacion',
    title: 'TODO: Publicación',
    description: 'TODO: Título, medio o editorial.',
    placeholder: true,
  },
  {
    id: 'muestra-aparicion',
    period: 'TODO: año',
    kind: 'aparicion',
    title: 'TODO: Aparición en medios o colaboración',
    description: 'TODO: Medio, programa o entidad.',
    placeholder: true,
  },
]
