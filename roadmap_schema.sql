-- ═══════════════════════════════════════════════════════════════
-- LEARNCRAFT ROADMAP — Table de synchro
-- Coller dans Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS roadmap_progress (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT      NOT NULL UNIQUE,  -- identifiant fixe, ex: 'victor'
  checked     JSONB     NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMP DEFAULT now()
);

-- Index pour les lookups par user_id
CREATE INDEX IF NOT EXISTS idx_roadmap_user ON roadmap_progress(user_id);

-- Pas de RLS : la table est accessible uniquement via le service_role côté serveur.
-- L'API Vercel protège l'accès avec le secret ROADMAP_SECRET.
