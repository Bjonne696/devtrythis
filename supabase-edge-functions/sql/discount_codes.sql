-- =============================================
-- Tabell: discount_codes
-- Brukes for rabattkoder i abonnementssystemet
-- =============================================

CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  duration_months INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_until DATE NOT NULL,
  max_uses INTEGER DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for å oppdatere updated_at automatisk
DROP TRIGGER IF EXISTS update_discount_codes_updated_at ON discount_codes;
CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Alle innloggede brukere kan lese aktive rabattkoder (for validering)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'discount_codes' AND policyname = 'Autentiserte brukere kan lese aktive rabattkoder'
  ) THEN
    CREATE POLICY "Autentiserte brukere kan lese aktive rabattkoder"
      ON discount_codes
      FOR SELECT
      TO authenticated
      USING (is_active = true AND valid_until >= CURRENT_DATE);
  END IF;
END $$;

-- Kun admin kan opprette/endre rabattkoder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'discount_codes' AND policyname = 'Admin kan gjøre alt med rabattkoder'
  ) THEN
    CREATE POLICY "Admin kan gjøre alt med rabattkoder"
      ON discount_codes
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- =============================================
-- Oppdater subscriptions-tabellen
-- Legg til vipps_agreement_id og discount_code
-- =============================================

-- Legg til vipps_agreement_id hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'vipps_agreement_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN vipps_agreement_id TEXT UNIQUE;
  END IF;
END $$;

-- Legg til discount_code hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'discount_code'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN discount_code TEXT DEFAULT NULL;
  END IF;
END $$;

-- Indeks for raskere oppslag på vipps_agreement_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_vipps_agreement_id
  ON subscriptions (vipps_agreement_id)
  WHERE vipps_agreement_id IS NOT NULL;

-- =============================================
-- Eksempel: Sett inn en test-rabattkode
-- (Fjern eller endre dette for produksjon)
-- =============================================
-- INSERT INTO discount_codes (code, duration_months, is_active, valid_until, description)
-- VALUES ('WELCOME2025', 1, true, '2025-12-31', 'Velkomsttilbud - 1 mnd gratis');
