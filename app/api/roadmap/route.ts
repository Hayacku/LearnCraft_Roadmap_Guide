// ═══════════════════════════════════════════════════════════════
// app/api/roadmap/route.ts
// À placer dans ton projet LearnCraft Next.js
// ═══════════════════════════════════════════════════════════════
//
// Variables d'environnement requises (.env.local + Vercel Dashboard) :
//   ROADMAP_SECRET=une_longue_chaine_aleatoire_generee_avec_openssl
//   (les variables Supabase sont déjà là depuis la Phase 1)
//
// Générer un secret : openssl rand -hex 32
// ───────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Client Supabase avec service_role — accès complet, côté serveur uniquement
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const USER_ID = 'victor'  // identifiant fixe — change si tu veux multi-users
const SECRET  = process.env.ROADMAP_SECRET!

// ── Vérification du secret partagé ──────────────────────────────
function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('x-roadmap-secret')
  return typeof SECRET === 'string' && SECRET.length > 0 && header === SECRET
}

// ── GET /api/roadmap ─────────────────────────────────────────────
// Retourne les tâches cochées sauvegardées en base
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('roadmap_progress')
    .select('checked, updated_at')
    .eq('user_id', USER_ID)
    .single()

  // PGRST116 = ligne non trouvée (première visite) → retourner tableau vide
  if (error && error.code !== 'PGRST116') {
    console.error('[roadmap GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    checked:    data?.checked    ?? [],
    updated_at: data?.updated_at ?? null,
  })
}

// ── POST /api/roadmap ────────────────────────────────────────────
// Sauvegarde les tâches cochées (upsert)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { checked?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const checked = Array.isArray(body.checked) ? body.checked : []

  const { error } = await supabase
    .from('roadmap_progress')
    .upsert(
      { user_id: USER_ID, checked, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('[roadmap POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
