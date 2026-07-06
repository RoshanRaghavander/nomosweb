import { type NomosPlan } from '@/lib/supabase'

export function formatPlanLabel(plan: NomosPlan) {
  if (plan === 'plus') return 'Plus'
  if (plan === 'pro') return 'Pro'
  if (plan === 'pro_max') return 'Pro max'
  return 'Free'
}

export function formatRelativeTime(value: string) {
  const then = new Date(value).getTime()
  const delta = Date.now() - then

  if (Number.isNaN(then)) {
    return 'Unknown time'
  }

  const minutes = Math.floor(delta / 60000)

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatDate(value: string | null) {
  if (!value) {
    return 'Not available'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

export function formatCapability(capability: string) {
  return capability === 'image' ? 'Image generation' : 'Chat request'
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}
