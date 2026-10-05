import { ImageResponse } from 'next/og'

import { seo } from '@/content/site'
import { BrandCard } from '@/lib/seo/brand-card'

export const alt = seo.ogImageAlt
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(<BrandCard />, size)
}
