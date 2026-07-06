# Nomos web

The `web/` app is the public landing page plus the authenticated dashboard and billing surface for Nomos.

## Stack

- Vite
- React
- TypeScript
- React Router
- Zustand
- Supabase Auth + Edge Functions

## Environment

Create `web/.env.local`:

```bash
VITE_SUPABASE_URL=https://rpnweaekkjoxhgukmazu.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SITE_URL=https://your-deployed-web-domain.com
```

Use the publishable key only. Do not place service role or Stripe secret keys in the web app.
`VITE_SITE_URL` should be the deployed web origin used in magic-link emails and Stripe return URLs.

## Commands

```bash
npm install
npm run dev
npm run check
npm run lint
npm run test
npm run build
```

## Production checklist

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the host environment.
2. Set `VITE_SITE_URL` to the deployed web origin.
3. In Supabase Auth URL configuration, set the Site URL to the same deployed origin and add:

```text
https://your-deployed-web-domain.com/auth/callback
https://your-deployed-web-domain.com/billing
```

4. Apply the Supabase migrations so the web app can read `profiles` and `usage_events`.
5. Deploy the Supabase functions used by billing:
   - `create-checkout-session`
   - `stripe-webhook`
6. Set the server-side Stripe secrets in Supabase:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRO_PRICE_ID`
7. Configure a Stripe webhook endpoint at:

```text
https://rpnweaekkjoxhgukmazu.supabase.co/functions/v1/stripe-webhook
```

8. Validate the production build locally with `npm run build`.

## Routing

This is a client-rendered SPA. The host must rewrite unknown routes such as `/dashboard` and `/billing` back to `index.html`.

`vercel.json` is included for Vercel deployments.

## Billing behavior

- The browser starts checkout by invoking `create-checkout-session`.
- Stripe webhooks are the source of truth for subscription changes.
- The web app reads the current plan from `profiles`.
- Usage metrics come from `usage_events`.
