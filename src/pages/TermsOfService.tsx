import LegalPage from '@/components/LegalPage'

const sections = [
  {
    title: 'Use of the service',
    paragraphs: [
      'Nomos provides a public website, account area, billing surface, and related software experiences for developers and teams. By using the website or creating an account, you agree to use the service lawfully and in a way that does not disrupt other users or the platform.',
      'You are responsible for the actions taken from your account and for the content you choose to upload, generate, or store through Nomos.',
    ],
  },
  {
    title: 'Accounts and access',
    paragraphs: [
      'You must provide accurate account information and keep access to your sign-in email under your control. If you believe your account has been accessed without authorization, you should stop using the affected session and secure your email account immediately.',
    ],
    bullets: [
      'Do not share account access with unauthorized users.',
      'Do not attempt to bypass usage limits, billing controls, or access restrictions.',
      'Do not use Nomos to violate law, third-party rights, or security controls.',
    ],
  },
  {
    title: 'Subscriptions and billing',
    paragraphs: [
      'Paid plans renew according to the billing interval shown at checkout unless cancelled before the next renewal date. Plan changes, upgrades, or cancellations affect future billing according to the terms shown in the billing area.',
      'If payment fails or a subscription ends, Nomos may limit access to paid features while preserving any baseline access associated with the account.',
    ],
  },
  {
    title: 'Intellectual property and content',
    paragraphs: [
      'Nomos retains ownership of the website, product branding, and service materials. You retain your rights in your own code, content, prompts, and project materials, subject to any third-party rights that apply to that material.',
      'You grant Nomos only the rights reasonably necessary to operate, secure, and improve the service for your account.',
    ],
  },
  {
    title: 'Availability and changes',
    paragraphs: [
      'Nomos may update, improve, suspend, or remove features over time. We aim to keep the service available, but uptime is not guaranteed and temporary interruptions may happen for maintenance, security work, or provider issues.',
    ],
  },
  {
    title: 'Termination',
    paragraphs: [
      'We may suspend or terminate access if the service is used in violation of these terms, in a way that creates security or legal exposure, or in a way that materially harms other users or the platform.',
    ],
  },
]

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Terms"
      intro="These terms govern access to the public Nomos website, account surfaces, and related product experiences."
      lastUpdated="July 5, 2026"
      sections={sections}
      title="Terms of service"
    />
  )
}
