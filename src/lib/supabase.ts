import { createClient, type Session } from '@supabase/supabase-js'

export type NomosPlan = 'free' | 'plus' | 'pro' | 'pro_max'
export type NomosPaidPlan = Exclude<NomosPlan, 'free'>

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

export function extractHandoffId(returnTo: string | null): string | null {
  const target = getDesktopReturnTarget(returnTo)
  return target?.searchParams.get('handoff') ?? null
}

// Cursor/Windsurf-style handoff: instead of putting tokens in the nomos:// URL,
// store the session server-side under the desktop's opaque handoff code, then
// hand the desktop only that code (already inside returnTo). The desktop
// exchanges the code for the session over HTTPS via auth-claim.
// Returns { deepLink } on success or { error } on failure (plain nullable
// fields rather than a discriminated union, since this project builds with
// strict:false where boolean-discriminant narrowing is unreliable).
export async function completeDesktopHandoff(
  session: Session,
  returnTo: string,
): Promise<{ deepLink: string | null; error: string | null }> {
  const target = getDesktopReturnTarget(returnTo)
  const handoffId = target?.searchParams.get('handoff')
  if (!target || !handoffId) {
    return { deepLink: null, error: 'This sign-in link is missing its desktop handoff code. Restart sign-in from the app.' }
  }
  if (!supabaseUrl || !supabasePublishableKey) {
    return { deepLink: null, error: 'Server is not configured for desktop sign-in.' }
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/auth-handoff`, {
      method: 'POST',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handoffId,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in ?? 3600,
      }),
    })
    if (!res.ok) {
      return { deepLink: null, error: 'Could not hand the session back to the desktop app. Try signing in again.' }
    }
    // returnTo already carries the handoff code and no tokens -- it IS the deep link.
    return { deepLink: target.toString(), error: null }
  } catch {
    return { deepLink: null, error: 'Could not reach Nomos servers to complete desktop sign-in.' }
  }
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
