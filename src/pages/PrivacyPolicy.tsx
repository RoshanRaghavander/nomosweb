import LegalPage from '@/components/LegalPage'

const sections = [
  {
    title: 'Information we collect',
    paragraphs: [
      'Nomos collects information needed to operate the website and account experience. This may include account identifiers, billing-related status, product usage signals, support interactions, and technical data required to secure and deliver the service.',
    ],
    bullets: [
      'Account information such as email address and authentication state',
      'Usage records connected to product features and account activity',
      'Billing status and subscription-related identifiers',
      'Basic device, browser, and diagnostics data needed for reliability and security',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use this information to provide account access, operate billing, maintain service security, diagnose issues, improve product performance, and communicate important account or service updates.',
      'We do not need unrelated personal data to run the core Nomos experience, and we aim to collect only what is reasonably necessary for the service.',
    ],
  },
  {
    title: 'How information is shared',
    paragraphs: [
      'Nomos may share limited information with infrastructure, authentication, analytics, and billing providers only to the extent necessary to operate the service. We may also disclose information when required by law, to enforce our terms, or to protect users and the service.',
    ],
  },
  {
    title: 'Data retention',
    paragraphs: [
      'We retain information for as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and maintain security and auditability. Retention periods can vary based on the type of record and the product function involved.',
    ],
  },
  {
    title: 'Your choices',
    paragraphs: [
      'You can stop using the service, manage account preferences, and exercise any rights available under applicable privacy law. Some technical and billing records may still be retained where necessary for security, fraud prevention, accounting, or legal compliance.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Privacy"
      intro="This policy explains how Nomos handles information connected to the website, account access, billing, and product operations."
      lastUpdated="July 5, 2026"
      sections={sections}
      title="Privacy policy"
    />
  )
}
