-- Subscription System for Cabin Owners
-- This migration creates tables for managing host subscriptions and payments

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cabin_id UUID REFERENCES cabins(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, active, past_due, canceled
  plan_type VARCHAR(50) NOT NULL DEFAULT 'basic', -- basic (99 NOK), premium (149 NOK)
  price_nok INTEGER NOT NULL,
  payment_provider VARCHAR(50) NOT NULL DEFAULT 'vipps',
  provider_agreement_id TEXT, -- Vipps agreement ID
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_events table for webhook idempotency
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  provider_event_id TEXT UNIQUE, -- For idempotency
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create merchant_settings table for payment provider credentials
CREATE TABLE IF NOT EXISTS merchant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL UNIQUE,
  settings JSONB NOT NULL, -- Encrypted API keys and settings
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add subscription tracking columns to cabins table
ALTER TABLE cabins 
  ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_owner_id ON subscriptions(owner_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_cabins_is_active ON cabins(is_active);
CREATE INDEX IF NOT EXISTS idx_cabins_subscription_id ON cabins(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_subscription_id ON payment_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_provider_id ON payment_events(provider_event_id);

-- RLS Policies for subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = owner_id);

-- Only service role can insert subscriptions (via Edge Functions)
CREATE POLICY "Service role can insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Only service role can update subscriptions (via Edge Functions)
CREATE POLICY "Service role can update subscriptions" ON subscriptions
  FOR UPDATE USING (auth.role() = 'service_role');

-- RLS Policies for payment_events table
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access payment events (security)
CREATE POLICY "Service role can access payment events" ON payment_events
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for merchant_settings table
ALTER TABLE merchant_settings ENABLE ROW LEVEL SECURITY;

-- Only service role can access merchant settings
CREATE POLICY "Service role can access merchant settings" ON merchant_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Update cabins RLS policy to check subscription status
-- Drop existing policy if it exists and recreate with subscription check
DROP POLICY IF EXISTS "Public cabins are viewable by everyone" ON cabins;

CREATE POLICY "Active cabins are viewable by everyone" ON cabins
  FOR SELECT USING (is_active = true);

-- Policy for owners to view their own cabins (even if inactive)
CREATE POLICY "Owners can view own cabins" ON cabins
  FOR SELECT USING (auth.uid() = owner_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on merchant_settings
CREATE TRIGGER update_merchant_settings_updated_at
  BEFORE UPDATE ON merchant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
