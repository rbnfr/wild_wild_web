import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1c3a34',
      }}
    >
      <div
        style={{
          width: 112,
          height: 112,
          borderRadius: 56,
          background: '#e3a52b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 54, height: 54, borderRadius: 27, background: '#1c3a34' }} />
      </div>
    </div>,
    size,
  )
}
