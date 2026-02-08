-- =============================================
-- Sjekk at payment_events har riktige kolonner
-- for idempotent webhook-håndtering
-- =============================================

-- Legg til provider_event_id hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_events' AND column_name = 'provider_event_id'
  ) THEN
    ALTER TABLE payment_events ADD COLUMN provider_event_id TEXT UNIQUE;
  END IF;
END $$;

-- Legg til event_type hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE payment_events ADD COLUMN event_type TEXT;
  END IF;
END $$;

-- Legg til payload hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_events' AND column_name = 'payload'
  ) THEN
    ALTER TABLE payment_events ADD COLUMN payload JSONB;
  END IF;
END $$;

-- Legg til processed_at hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_events' AND column_name = 'processed_at'
  ) THEN
    ALTER TABLE payment_events ADD COLUMN processed_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Sørg for at UNIQUE-constraint finnes på provider_event_id
-- (dekker tilfellet der kolonnen allerede fantes uten UNIQUE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
      AND tc.table_schema = ccu.table_schema
    WHERE tc.table_schema = 'public'
      AND tc.table_name = 'payment_events'
      AND tc.constraint_type = 'UNIQUE'
      AND ccu.column_name = 'provider_event_id'
  ) THEN
    ALTER TABLE payment_events
      ADD CONSTRAINT payment_events_provider_event_id_unique
      UNIQUE (provider_event_id);
  END IF;
END $$;

-- Indeks for raskere idempotency-sjekk
CREATE INDEX IF NOT EXISTS idx_payment_events_provider_event_id
  ON payment_events (provider_event_id)
  WHERE provider_event_id IS NOT NULL;
