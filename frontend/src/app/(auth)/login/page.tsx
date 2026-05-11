import Link from 'next/link'
import { login } from '../actions'
import { OAuthProviderButtons } from '../OAuthProviderButtons'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; trace?: string }>
}) {
  const { error, message, trace } = await searchParams;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="backdrop-blur-xl bg-bg-surface-primary/70 border border-border-primary/50 shadow-2xl rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col gap-3 mb-10 text-center">
          <div className="mx-auto w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-accent-primary/20">
            <svg className="w-7 h-7 text-text-inverse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary">Enter your credentials to access your workspace</p>
        </div>

        <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-bg-canvas/50 border border-border-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 focus:outline-none transition-all placeholder:text-text-tertiary"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-text-secondary" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-xs text-accent-primary hover:text-accent-primary-hover transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              className="w-full rounded-xl px-4 py-3 bg-bg-canvas/50 border border-border-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 focus:outline-none transition-all placeholder:text-text-tertiary"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-status-error/10 border border-status-error/30 text-status-error rounded-xl text-sm animate-shake">
              <div className="flex gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Authentication failed</span>
                  <p className="opacity-90">{error}</p>
                  {trace && (
                    <p className="mt-2 text-[10px] uppercase tracking-wider opacity-60 font-mono">ID: {trace}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="p-4 bg-status-success/10 border border-status-success/30 text-status-success rounded-xl text-sm">
              <div className="flex gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{message}</p>
              </div>
            </div>
          )}

          <button
            formAction={login}
            className="w-full bg-accent-primary hover:bg-accent-primary-hover active:bg-accent-primary-active text-text-inverse font-bold rounded-xl px-4 py-3.5 transition-all shadow-lg shadow-accent-primary/25 flex items-center justify-center gap-2 group"
          >
            <span>Sign In</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-primary"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-surface-primary/70 px-2 text-text-tertiary">Or continue with</span>
            </div>
          </div>

          <OAuthProviderButtons />

          <p className="text-sm text-text-tertiary text-center mt-4">
            New to UML Architect?{' '}
            <Link href="/signup" className="text-accent-primary font-semibold hover:text-accent-primary-hover transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-[10px] text-text-tertiary uppercase tracking-widest opacity-50">
        &copy; 2024 UML Architect &bull; Secure Enterprise Design
      </div>
    </div>
  )
}
