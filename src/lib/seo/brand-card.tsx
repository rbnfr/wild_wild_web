import { identity } from '@/content/site'

/** Tarjeta de marca para compartir en redes (Open Graph y Twitter/X), 1200 × 630. */
export function BrandCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        padding: 80,
        background: '#edf0ea',
        color: '#1c3a34',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -140,
          top: -140,
          width: 640,
          height: 640,
          borderRadius: 320,
          background: '#e3a52b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 300, height: 300, borderRadius: 150, background: '#1c3a34' }} />
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 148,
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: -6,
        }}
      >
        {identity.name}
      </div>
      <div style={{ display: 'flex', marginTop: 28, fontSize: 44, color: '#1a2b27' }}>
        {identity.role} de {identity.specialty}
      </div>
    </div>
  )
}
