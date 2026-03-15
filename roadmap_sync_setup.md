# LearnCraft Roadmap — Guide de déploiement synchro
## Temps estimé : 20 minutes

---

## ✅ DÉJÀ FAIT (dans ce dossier)

- **Étape 1** — Table Supabase créée (tu l’as faite).
- **Étape 2** — Secret généré : `328b5c4b6066c9d41822fb05ea73bfbfe705b09d1c0cc0b395207ced40a5cb59`
- **Étape 3** — `.env.local` créé ici (à copier ou à ajouter dans LearnCraft).
- **Étape 4** — Route API prête : `app/api/roadmap/route.ts` (à copier dans ton projet LearnCraft).
- **Étape 6** — Le secret est déjà dans `LearnCraft_Roadmap_Guide.html` ; il reste à mettre la bonne **API_URL** (ton URL Vercel).

**Pour que l’assistant copie tout dans LearnCraft à ta place :** donne-lui le **chemin complet** de ton projet LearnCraft (ex. `C:\Users\venan\OneDrive\Desktop\LearnCraft`). Il y mettra `app/api/roadmap/route.ts` et ajoutera `ROADMAP_SECRET` dans ton `.env.local`.

---

## ÉTAPE 1 — Créer la table Supabase (2 min) — FAIT

1. Va sur **supabase.com** → ton projet LearnCraft
2. Clique sur **SQL Editor** → **New query**
3. Copie-colle tout le contenu de `roadmap_schema.sql`
4. Clique **Run**
5. Tu dois voir : "Success. No rows returned"

---

## ÉTAPE 2 — Générer un secret (1 min) — FAIT

Dans le terminal de Cursor, tape :
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Tu obtiens une chaîne comme : `a3f8c2d1e4b7...`
**Note cette chaîne — tu en as besoin aux étapes 3 et 4.**

---

## ÉTAPE 3 — Ajouter le secret dans .env.local (1 min)

Ouvre `.env.local` et ajoute à la fin :
```
ROADMAP_SECRET=ta_chaine_generee_a_letape_2
```

---

## ÉTAPE 4 — Créer l'API route (2 min)

1. Dans ton projet LearnCraft, crée le dossier : `app/api/roadmap/`
2. Copie le fichier `roadmap_route.ts` dedans
3. Renomme-le **`route.ts`** (pas roadmap_route.ts)

Le fichier doit être à : `app/api/roadmap/route.ts`

---

## ÉTAPE 5 — Déployer sur Vercel (5 min)

1. **Commit et push** sur GitHub :
   ```
   git add app/api/roadmap/route.ts
   git commit -m "feat: roadmap sync API"
   git push
   ```
   Vercel déploie automatiquement.

2. **Ajouter le secret dans Vercel** :
   - Va sur vercel.com → ton projet → **Settings → Environment Variables**
   - Ajoute : `ROADMAP_SECRET` = ta chaîne générée à l'étape 2
   - Clique **Save**
   - Va dans **Deployments → Redeploy** (pour que la variable soit prise en compte)

---

## ÉTAPE 6 — Configurer le HTML (2 min)

Ouvre `LearnCraft_Roadmap_Guide.html` dans un éditeur de texte.

Trouve les 2 lignes en haut du script (vers la ligne 475) :
```javascript
const API_URL = 'https://learncraft.app/api/roadmap';
const SECRET  = 'REMPLACE_PAR_TON_SECRET';
```

Remplace :
- `learncraft.app` par ton URL Vercel réelle (ex: `learncraft.vercel.app` si le domaine custom n'est pas encore configuré)
- `REMPLACE_PAR_TON_SECRET` par ta chaîne générée à l'étape 2

**Sauvegarde le fichier.**

---

## ÉTAPE 7 — Tester (5 min)

1. Ouvre `LearnCraft_Roadmap_Guide.html` dans Chrome sur ton ordinateur principal
2. Coche 3 ou 4 tâches
3. Attends 1 seconde — tu dois voir "✓ Synchronisé" en haut
4. Ouvre le même fichier HTML sur un autre appareil (ou un autre navigateur)
5. Les coches doivent apparaître automatiquement

---

## COMMENT ÇA MARCHE

```
Appareil A                    Vercel API              Supabase
────────────                  ──────────              ────────
Tu coches une tâche
→ localStorage mis à jour
→ debounce 800ms
→ POST /api/roadmap  ──────→  Vérif SECRET
                              ↓
                              UPDATE roadmap_progress ──→ BDD
                              ↓
                    ←──────  { ok: true }
"✓ Synchronisé" affiché

Appareil B (60s plus tard)
→ GET /api/roadmap   ──────→  Vérif SECRET
                              ↓
                              SELECT checked ──────────→ BDD
                              ↓
                    ←──────  { checked: [...] }
Coches fusionnées et affichées
```

**Fusion intelligente :**
Si tu coches des choses sur les 2 appareils sans connexion internet,
les coches sont **mergées** (union) au lieu d'être écrasées.
Tu ne perds jamais une coche.

---

## EN CAS DE PROBLÈME

**"⚠ Erreur synchro HTTP 401"**
→ Le secret dans le HTML ne correspond pas à ROADMAP_SECRET dans Vercel.
→ Vérifie les 2 valeurs, elles doivent être identiques.

**"⚠ Erreur synchro HTTP 500"**
→ La table `roadmap_progress` n'existe pas dans Supabase.
→ Réexécute `roadmap_schema.sql` dans SQL Editor.

**"◌ Hors-ligne"**
→ L'API Vercel n'est pas accessible (pas de connexion, ou URL incorrecte).
→ Les coches restent sauvegardées en local. Elles se synchroniseront au retour en ligne.

**Les coches n'apparaissent pas sur le 2ème appareil**
→ La synchro se fait toutes les 60 secondes. Attends un peu ou recharge la page.
→ Vérifie dans Supabase → Table Editor → roadmap_progress que les données sont bien là.
