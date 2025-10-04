# Supabase Subscription System Setup

This guide explains how to set up the subscription-based payment system for cabin owners.

## Prerequisites

1. A Supabase project with existing tables: `profiles`, `cabins`
2. Vipps MobilePay merchant account (or use test mode)
3. Supabase CLI installed (optional, for local development)

## Setup Steps

### 1. Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# Copy the contents of supabase/migrations/001_create_subscriptions.sql
# Paste into Supabase Dashboard > SQL Editor > New Query
# Run the query
```

This will create:
- `subscriptions` table
- `payment_events` table
- `merchant_settings` table
- Add `subscription_id` and `is_active` columns to `cabins`
- Set up Row Level Security (RLS) policies

### 2. Deploy Edge Functions

Deploy the Edge Functions to Supabase:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy create-agreement
supabase functions deploy webhook-payments
supabase functions deploy cancel-subscription
```

### 3. Configure Environment Variables

Set the following secrets in Supabase Dashboard > Project Settings > Edge Functions:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Configure Vipps (Optional - for production)

If using real Vipps integration, add merchant settings via SQL:

```sql
INSERT INTO merchant_settings (provider, settings, is_active)
VALUES (
  'vipps',
  '{
    "clientId": "your_vipps_client_id",
    "clientSecret": "your_vipps_client_secret",
    "merchantSerialNumber": "your_merchant_serial",
    "subscriptionKey": "your_subscription_key",
    "testMode": true
  }'::jsonb,
  true
);
```

**For development**: The system uses a mock provider by default if Vipps credentials are not configured.

### 5. Configure Vipps Webhooks

In your Vipps merchant portal, set the webhook URL to:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-payments
```

## Testing the System

### Test with Mock Provider (Development)

1. User creates a cabin (no subscription required yet)
2. System shows paywall: "Activate your listing for NOK 99/month"
3. User clicks "Activate listing"
4. Mock provider auto-approves
5. Cabin becomes active

### Test with Real Vipps (Production)

1. Ensure Vipps credentials are configured in `merchant_settings`
2. User clicks "Activate listing"
3. User is redirected to Vipps payment page
4. User approves payment in Vipps app
5. Webhook receives confirmation
6. Cabin becomes active

## Edge Functions Overview

### `create-agreement`
- **Method**: POST
- **Auth**: Required (user token)
- **Body**: `{ cabinId: string, planType: 'basic' | 'premium' }`
- **Response**: `{ subscriptionId, redirectUrl, agreementId }`

### `webhook-payments`
- **Method**: POST
- **Auth**: None (verified via signature)
- **Body**: Vipps webhook payload
- **Response**: `{ received: true, subscriptionStatus }`

### `cancel-subscription`
- **Method**: POST
- **Auth**: Required (user token)
- **Body**: `{ subscriptionId: string }`
- **Response**: `{ success: true, message, currentPeriodEnd }`

## Subscription Statuses

- `pending`: Subscription created, awaiting payment
- `active`: Payment successful, cabin is visible
- `past_due`: Payment failed, cabin is paused
- `canceled`: User canceled, cabin active until period end

## Security Notes

1. All payment logic runs in Edge Functions with service role key
2. RLS policies prevent direct access to subscription data
3. Webhook signature verification should be implemented for production
4. No card details are stored - only provider IDs and status
5. GDPR compliant - includes data retention and export/deletion rights
