import LegalPage from '@/components/LegalPage'

const sections = [
  {
    title: 'What cookies are used for',
    paragraphs: [
      'Cookies and similar browser storage mechanisms help Nomos keep the website working, maintain sign-in state, remember preferences, and understand whether the product is operating reliably.',
    ],
  },
  {
    title: 'Types of cookies',
    paragraphs: [
      'Some cookies are necessary for authentication, navigation, and security. Others may support performance measurement, troubleshooting, or product improvement.',
    ],
    bullets: [
      'Essential cookies required for account access and core site behavior',
      'Preference cookies used to remember basic user choices',
      'Operational cookies or local storage used for performance and reliability diagnostics',
    ],
  },
  {
    title: 'Managing cookies',
    paragraphs: [
      'Most browsers allow you to view, restrict, or delete cookies. If you block essential cookies, parts of the Nomos website or authenticated experience may stop working correctly.',
    ],
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'Some supporting providers may use cookies or equivalent browser storage when delivering authentication, payment, security, or infrastructure functionality tied to the Nomos experience.',
    ],
  },
]

export default function CookiePolicy() {
  return (
    <LegalPage
      eyebrow="Cookies"
      intro="This policy explains how Nomos uses cookies and similar browser storage on nomos.wtf."
      lastUpdated="July 5, 2026"
      sections={sections}
      title="Cookie policy"
    />
  )
}
