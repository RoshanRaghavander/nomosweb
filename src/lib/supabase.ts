import { createClient, type Session } from '@supabase/supabase-js'

export type NomosPlan = 'free' | 'pro'

export interface NomosProfile {
  id: string
  email: string | null
  plan: NomosPlan
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  createdAt: string | null
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
const siteUrlOverride = import.meta.env.VITE_SITE_URL?.trim()

export const hasSupabaseEnv = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

function buildFallbackProfile(session: Session): NomosProfile {
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    plan: 'free',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    createdAt: session.user.created_at ?? null,
  }
}

export async function fetchNomosProfile(session: Session): Promise<NomosProfile> {
  if (!supabase) {
    return buildFallbackProfile(session)
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, plan, stripe_customer_id, stripe_subscription_id, created_at')
    .eq('id', session.user.id)
    .maybeSingle()

  if (error || !data) {
    return buildFallbackProfile(session)
  }

  return {
    id: data.id,
    email: session.user.email ?? null,
    plan: (data.plan as NomosPlan) ?? 'free',
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    createdAt: data.created_at,
  }
}

function normalizeOrigin(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getAppOrigin() {
  if (siteUrlOverride) {
    return normalizeOrigin(siteUrlOverride)
  }

  return normalizeOrigin(window.location.origin)
}

export function getDesktopReturnTarget(value: string | null) {
  if (!value) {
    return null
  }

  try {
    const url = new URL(value)
    if (url.protocol !== 'nomos:') {
      return null
    }

    return url
  } catch {
    return null
  }
}

export function buildDesktopAuthReturnUrl(session: Session, returnTo: string) {
  const target = getDesktopReturnTarget(returnTo)
  if (!target) {
    return null
  }

  target.searchParams.set('access_token', session.access_token)
  target.searchParams.set('refresh_token', session.refresh_token)
  target.searchParams.set('expires_in', String(session.expires_in ?? 3600))
  target.searchParams.set('user_id', session.user.id)

  if (session.user.email) {
    target.searchParams.set('email', session.user.email)
  }

  return target.toString()
}

export async function createAccountWithPassword(email: string, password: string, redirectPath = '/auth/callback') {
  if (!supabase) {
    throw new Error('Supabase environment variables are missing.')
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getAppOrigin()}${redirectPath}`,
    },
  })
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase environment variables are missing.')
  }

  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOutUser() {
  if (!supabase) {
    return
  }

  await supabase.auth.signOut()
}

export function getCheckoutRedirects() {
  const origin = getAppOrigin()

  return {
    successUrl: `${origin}/billing?checkout=success`,
    cancelUrl: `${origin}/billing?checkout=cancelled`,
  }
}
