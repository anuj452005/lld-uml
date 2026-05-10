import Link from 'next/link'
import { signup } from '../actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="backdrop-blur-xl bg-bg-surface-primary/70 border border-border-primary/50 shadow-2xl rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col gap-3 mb-10 text-center">
          <div className="mx-auto w-12 h-12 bg-status-success rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-status-success/20">
            <svg className="w-7 h-7 text-text-inverse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Create Account</h1>
          <p className="text-text-secondary">Join 500+ architects building better systems</p>
        </div>

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
            <label className="text-sm font-medium text-text-secondary ml-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-bg-canvas/50 border border-border-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 focus:outline-none transition-all placeholder:text-text-tertiary"
              type="password"
              name="password"
              placeholder="Create a strong password"
              required
              minLength={6}
            />
            <p className="text-[10px] text-text-tertiary ml-1">Must be at least 6 characters long.</p>
          </div>

          <div className="flex items-start gap-3 ml-1">
             <input type="checkbox" id="terms" required className="mt-1 rounded border-border-primary bg-bg-canvas text-accent-primary focus:ring-accent-primary/20" />
             <label htmlFor="terms" className="text-xs text-text-secondary leading-normal">
               I agree to the <Link href="#" className="text-accent-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-accent-primary hover:underline">Privacy Policy</Link>.
             </label>
          </div>

          {error && (
            <div className="p-4 bg-status-error/10 border border-status-error/30 text-status-error rounded-xl text-sm animate-shake">
              <div className="flex gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Registration failed</span>
                  <p className="opacity-90">{error}</p>
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
            formAction={signup}
            className="w-full bg-accent-primary hover:bg-accent-primary-hover active:bg-accent-primary-active text-text-inverse font-bold rounded-xl px-4 py-3.5 transition-all shadow-lg shadow-accent-primary/25 flex items-center justify-center gap-2 group"
          >
            <span>Create Free Account</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <p className="text-sm text-text-tertiary text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-primary font-semibold hover:text-accent-primary-hover transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      </div>
      
      <div className="mt-8 text-center text-[10px] text-text-tertiary uppercase tracking-widest opacity-50">
        Trusted by engineers at top tech companies
      </div>
    </div>
  )
}
