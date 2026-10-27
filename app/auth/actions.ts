'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// 1. LOG IN ACTION
export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Redirect back to login with the error message in the URL
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Clear the Next.js Router Cache so layouts/pages immediately see the signed-in user
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// 2. SIGN UP ACTION
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // If "Confirm Email" is ON in Supabase, data.session will be null until they click the email link
  if (!data.session) {
    redirect('/login?message=Check your email to confirm your account')
  }

  // If "Confirm Email" is OFF, Supabase creates the session cookie immediately
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// 3. SIGN OUT ACTION
export async function signout() {
  const supabase = await createClient()

  // Clears the auth session in Supabase and deletes the auth cookies from the browser
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}