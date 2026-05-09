import Link from 'next/link'
import { signup } from '../actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <div className="flex flex-col gap-2 mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Create Account</h1>
        <p className="text-text-secondary">Join the developer-focused UML editor</p>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-6 text-text-primary">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-secondary" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-bg-surface-secondary border border-border-primary focus:border-border-active focus:outline-none transition-colors"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-secondary" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-bg-surface-secondary border border-border-primary focus:border-border-active focus:outline-none transition-colors"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-status-error/10 border border-status-error/20 text-status-error rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          formAction={signup}
          className="bg-accent-primary hover:bg-accent-primary-hover text-text-inverse font-semibold rounded-md px-4 py-2 transition-colors"
        >
          Create Account
        </button>

        <p className="text-sm text-text-tertiary text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-primary hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
