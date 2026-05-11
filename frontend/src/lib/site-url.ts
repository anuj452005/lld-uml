import { headers } from 'next/headers'

/** Strip trailing slash; ensure scheme for bare host or host:port strings. */
function normalizeBaseUrl(url: string): string {
  const t = url.trim().replace(/\/$/, '')
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

/**
 * Canonical browser origin for this deployment (OAuth redirect_to, email links).
 * Prefer NEXT_PUBLIC_SITE_URL in production so server actions work when Origin is absent.
 */
export async function getAppBaseUrl(): Promise<string> {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (site) return normalizeBaseUrl(site)

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return normalizeBaseUrl(vercel)

  const h = await headers()
  const origin = h.get('origin')
  if (origin && /^https?:\/\//i.test(origin)) {
    return origin.replace(/\/$/, '')
  }

  const rawProto = h.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const proto =
    rawProto === 'http' || rawProto === 'https' ? rawProto : 'https'
  const host =
    h.get('x-forwarded-host')?.split(',')[0]?.trim() || h.get('host')?.trim()
  if (host) {
    return `${proto}://${host}`.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}
