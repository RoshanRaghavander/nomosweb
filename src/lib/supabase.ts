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

export async function sendMagicLink(email: string, redirectPath = '/auth/callback') {
  if (!supabase) {
    throw new Error('Supabase environment variables are missing.')
  }

  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getAppOrigin()}${redirectPath}`,
    },
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
