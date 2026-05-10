'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  console.log('[Auth Action] Starting login attempt...');
  console.log('[Auth Action] NEXT_PUBLIC_SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const traceId = Math.random().toString(16).slice(2) + Date.now().toString(16)
    console.error('[Supabase Auth Error - Login]:', {
      traceId,
      message: error.message,
      status: error.status,
      name: error.name,
      cause: (error as any).cause,
      code: (error as any).code
    });
    redirect('/login?error=' + encodeURIComponent(error.message) + '&trace=' + encodeURIComponent(traceId))
  }

  revalidatePath('/', 'layout')
  redirect('/workspace')
}

export async function signup(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  console.log('[Auth Action] Starting signup attempt...');
  console.log('[Auth Action] NEXT_PUBLIC_SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('[Supabase Auth Error - Signup]:', {
      message: error.message,
      status: error.status,
      name: error.name,
      cause: (error as any).cause,
      code: (error as any).code
    });
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=' + encodeURIComponent('Check your email to confirm your account.'))
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
