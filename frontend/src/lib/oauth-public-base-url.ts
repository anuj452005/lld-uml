/**
 * Canonical origin for OAuth redirect_to (client-side).
 * Prefer NEXT_PUBLIC_SITE_URL so production builds always match your public URL
 * (Supabase + Google), even when window.location does not reflect it.
 */
export function getOAuthRedirectBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (raw) {
    try {
      const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
      return new URL(withProto).origin
    } catch {
      // fall through
    }
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}
