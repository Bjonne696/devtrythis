# Subscription System Implementation

## Overview
This document describes the subscription-based payment system implemented for cabin owners on the Berge Hyttene platform. The system requires hosts to have an active paid subscription before their cabin listings become visible to renters.

## System Architecture

### Technology Stack
- **Frontend**: React 19 (Vite), styled-components
- **Backend**: Supabase (PostgreSQL with RLS), Supabase Edge Functions (Deno)
- **Payment Provider**: Vipps MobilePay Recurring (with mock provider for development)
- **Abstraction Layer**: Clean payment provider interface for easy provider switching

### Database Schema

#### New Tables
1. **subscriptions**
   - Tracks owner subscriptions with status, plan type, and billing periods
   - Links to cabin and owner via foreign keys
   - Status: `pending`, `active`, `past_due`, `canceled`
   - Plans: `basic` (99 NOK), `premium` (149 NOK)

2. **payment_events**
   - Logs all webhook events for idempotency
   - Stores provider event IDs to prevent duplicate processing
   - Contains full webhook payload for audit trail

3. **merchant_settings**
   - Stores encrypted payment provider credentials
   - Supports multiple providers (currently Vipps)
   - Managed via service role only

#### Modified Tables
- **cabins**: Added `subscription_id` and `is_active` columns
  - `is_active`: Boolean flag for cabin visibility
  - `subscription_id`: Links cabin to subscription

### Backend (Edge Functions)

#### 1. create-agreement
- **Path**: `/functions/v1/create-agreement`
- **Method**: POST
- **Auth**: Required (user token)
- **Purpose**: Initiates subscription and returns Vipps payment URL
- **Request**:
  ```json
  {
    "cabinId": "uuid",
    "planType": "basic" | "premium"
  }
  ```
- **Response**:
  ```json
  {
    "subscriptionId": "uuid",
    "redirectUrl": "https://...",
    "agreementId": "vipps_agreement_id"
  }
  ```

#### 2. webhook-payments
- **Path**: `/functions/v1/webhook-payments`
- **Method**: POST
- **Auth**: Webhook signature verification
- **Purpose**: Handles payment callbacks from Vipps
- **Features**:
  - Idempotent processing via payment_events table
  - Automatic cabin activation/deactivation
  - Supports events: AGREEMENT_ACTIVATED, CHARGE_SUCCESS, CHARGE_FAILED, etc.

#### 3. cancel-subscription
- **Path**: `/functions/v1/cancel-subscription`
- **Method**: POST
- **Auth**: Required (user token)
- **Purpose**: Cancels recurring subscription via Vipps API
- **Grace Period**: Cabin stays active until current period ends

### Frontend Components

#### 1. SubscriptionPaywall (`src/components/subscription/SubscriptionPaywall.jsx`)
- Displays plan selection UI (Standard/Premium)
- Handles payment initiation
- Shows mock payment flow in development mode

#### 2. SubscriptionStatus (`src/components/subscription/SubscriptionStatus.jsx`)
- Displays current subscription status in user profile
- Shows plan details, pricing, and next billing date
- Provides cancel subscription option
- Real-time status updates via Supabase Realtime

#### 3. useSubscription Hook (`src/hooks/useSubscription.js`)
- Fetches and monitors subscription status
- Provides helper functions for subscription management
- Real-time subscription updates

### Payment Flow

#### Cabin Creation Flow
1. Host fills out cabin creation form
2. On submit, cabin is created with `is_active = false` (if no subscription)
3. System shows SubscriptionPaywall component
4. Host selects plan (Standard or Premium)
5. Edge Function creates subscription and Vipps agreement
6. Host redirected to Vipps payment page
7. After payment, Vipps sends webhook
8. Webhook updates subscription status to `active`
9. Cabin `is_active` set to `true`
10. Cabin becomes visible to renters

#### Subscription Cancellation Flow
1. Host clicks "Cancel subscription" in profile
2. Edge Function calls Vipps API to stop recurring payments
3. Subscription status updated to `canceled`
4. Cabin stays active until `current_period_end`
5. After period ends, cabin becomes inactive

### Security & Compliance

#### Security Measures
1. **RLS Policies**: All subscription data protected by Row Level Security
2. **Service Role Only**: Payment operations use service role key, not client key
3. **Webhook Verification**: HMAC-SHA256 signature verification prevents webhook forgery
   - **MANDATORY**: `VIPPS_WEBHOOK_SECRET` environment variable must be set
   - Webhook endpoint fails completely if secret is missing (no bypass)
   - Rejects all webhooks without valid signature (401 Unauthorized)
4. **Event ID Validation**: All webhooks must include unique `eventId` from provider
5. **No Sensitive Data**: Card details never stored, only provider IDs
6. **Idempotent Webhooks**: Duplicate events safely ignored via provider event ID

#### GDPR Compliance
- Privacy policy updated with payment data section
- Data retention: 5 years after cancellation (Norwegian accounting law)
- Users can request data export/deletion
- Clear explanation of what data is stored
- Third-party processor disclosure (Vipps)

### Cabin Visibility Logic

#### Public View
- Only cabins with `is_active = true` are visible
- Applied to: HomePage, TilLeiePage, PopularPage, NyeHytterPage

#### Owner View
- Owners can see their own cabins regardless of status
- MyCabins component shows all owner's cabins
- ShowCabinPage allows owners to view inactive cabins

#### RLS Policy
```sql
-- Public can only see active cabins
CREATE POLICY "Active cabins are viewable by everyone" ON cabins
  FOR SELECT USING (is_active = true);

-- Owners can see their own cabins
CREATE POLICY "Owners can view own cabins" ON cabins
  FOR SELECT USING (auth.uid() = owner_id);
```

### Payment Provider Abstraction

#### Interface
```typescript
interface PaymentProvider {
  createAgreement(params): Promise<AgreementResponse>;
  cancelAgreement(agreementId): Promise<void>;
  verifyWebhookSignature(payload, signature): boolean;
}
```

#### Implementations
1. **VippsProvider**: Real Vipps MobilePay integration
2. **MockProvider**: Development/testing without real payments

#### Switching Providers
To add a new provider (e.g., Stripe):
1. Implement `PaymentProvider` interface
2. Update `getPaymentProvider()` factory function
3. Add provider config to `merchant_settings` table
4. No frontend changes required

## Setup Instructions

### 1. Database Setup
```bash
# Run migration in Supabase SQL Editor
# Copy contents of supabase/migrations/001_create_subscriptions.sql
# Execute in Supabase Dashboard > SQL Editor
```

### 2. Edge Functions Deployment
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy create-agreement
supabase functions deploy webhook-payments
supabase functions deploy cancel-subscription

# Set environment variables
# In Supabase Dashboard > Project Settings > Edge Functions
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 3. Vipps Configuration

#### Development (Mock Mode)
- No configuration needed
- System automatically uses MockProvider
- Payments auto-approve after 1 second

#### Production (Real Vipps)
1. Get Vipps merchant account and API keys
2. Add credentials to `merchant_settings`:
   ```sql
   INSERT INTO merchant_settings (provider, settings, is_active)
   VALUES (
     'vipps',
     '{
       "clientId": "your_client_id",
       "clientSecret": "your_client_secret",
       "merchantSerialNumber": "your_msn",
       "subscriptionKey": "your_subscription_key",
       "testMode": false
     }'::jsonb,
     true
   );
   ```

3. Configure webhook URL in Vipps portal:
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-payments
   ```

## Testing

### Manual Testing Checklist
- [ ] Create cabin without subscription → Shows paywall
- [ ] Select plan and activate → Mock payment succeeds
- [ ] Cabin becomes visible on public pages
- [ ] Subscription status shows in profile
- [ ] Cancel subscription → Stays active until period end
- [ ] Payment failure → Cabin becomes inactive

### Test Scenarios
1. **New Cabin Creation**
   - User without subscription creates cabin
   - Paywall appears with plan selection
   - After activation, cabin is visible

2. **Subscription Management**
   - View subscription status in profile
   - Cancel subscription
   - Verify grace period behavior

3. **Cabin Visibility**
   - Inactive cabins hidden from public
   - Owners can see their inactive cabins
   - Active cabins visible on all listing pages

## Future Enhancements

### Phase 2
- [ ] Implement real Vipps webhook signature verification
- [ ] Add subscription upgrade/downgrade flow
- [ ] Email notifications for payment failures
- [ ] Admin dashboard for subscription management
- [ ] Analytics and reporting

### Phase 3
- [ ] Support additional payment providers (Stripe, etc.)
- [ ] Annual billing option with discount
- [ ] Multiple cabins per subscription
- [ ] Promotional codes and discounts

## Troubleshooting

### Common Issues

#### Cabin not visible after payment
1. Check subscription status in database
2. Verify `is_active` column on cabin
3. Check browser console for errors
4. Review Edge Function logs

#### Webhook not processing
1. Verify webhook URL in Vipps portal
2. Check `payment_events` table for duplicates
3. Review Edge Function logs for errors
4. Ensure signature verification is passing

#### Subscription status not updating
1. Check Supabase Realtime is enabled
2. Verify RLS policies allow reads
3. Refresh subscription data manually

## Support
For questions or issues:
- Email: support@berge-hyttene.no
- Documentation: See `supabase/SETUP.md`
