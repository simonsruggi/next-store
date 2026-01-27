# Environment variables

Queste variabili servono per eseguire e deployare l'app (es. su Vercel).

## Supabase

- `NEXT_PUBLIC_SUPABASE_URL`: URL del progetto Supabase (Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key (Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY`: service role key (Settings → API)  
  Necessaria per webhook e operazioni server privilegiate. **Non** deve essere esposta al client.

## Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## PayPal

- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID`

## (Opzionale) URL sito

- `NEXT_PUBLIC_SITE_URL`: utile in produzione per costruire URL assoluti.

