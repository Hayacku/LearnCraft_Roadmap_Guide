# Ce qu’il te reste à faire — Roadmap synchro

**Ce dossier est maintenant un vrai projet Next.js.** Tu n’as pas besoin d’un autre dossier LearnCraft : tout est ici.

---

## 1. Renseigner Supabase dans `.env.local`

Ouvre **`.env.local`** et remplace les 2 premières lignes par tes vraies valeurs Supabase :

- Va sur **supabase.com** → ton projet → **Settings** → **API**
- **Project URL** → colle dans `NEXT_PUBLIC_SUPABASE_URL=`
- **service_role** (secret) → colle dans `SUPABASE_SERVICE_ROLE_KEY=`

(Garde la ligne `ROADMAP_SECRET=...` telle quelle.)

---

## 2. Installer et lancer en local (optionnel)

Dans le terminal, à la racine de ce dossier :

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000 — la page d’accueil s’affiche. L’API est sur http://localhost:3000/api/roadmap.

---

## 3. Déployer sur Vercel

1. **Crée un projet sur Vercel**  
   - va sur **vercel.com** → **Add New** → **Project**  
   - importe ce dossier (ou pousse d’abord sur GitHub puis connecte le repo).

2. **Variables d’environnement sur Vercel**  
   Dans le projet Vercel → **Settings** → **Environment Variables**, ajoute **exactement** les 3 mêmes que dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ROADMAP_SECRET` = `328b5c4b6066c9d41822fb05ea73bfbfe705b09d1c0cc0b395207ced40a5cb59`

3. **Déploiement**  
   Après le premier déploiement, note l’URL du projet (ex. `learncraft-roadmap-api.vercel.app`).

---

## 4. Configurer l’URL dans le HTML

Ouvre **`LearnCraft_Roadmap_Guide.html`** et remplace l’URL de l’API (vers la ligne 473) :

- mets : `https://TON-URL-VERCEL.vercel.app/api/roadmap`  
  (avec ton URL Vercel réelle).

Le secret y est déjà renseigné.

---

## 5. Tester

1. Ouvre `LearnCraft_Roadmap_Guide.html` dans Chrome.
2. Coche quelques tâches → tu dois voir « ✓ Synchronisé ».
3. Ouvre le même fichier sur un autre appareil ou navigateur → les coches doivent se synchroniser.

---

## Récap des fichiers

| Fichier / Dossier | Rôle |
|-------------------|------|
| `package.json` | Projet Next.js (ce dossier = projet déployable) |
| `app/api/roadmap/route.ts` | Route API synchro |
| `app/layout.tsx`, `app/page.tsx` | Page d’accueil minimale |
| `.env.local` | Variables (Supabase + ROADMAP_SECRET) — à recopier dans Vercel |
| `LearnCraft_Roadmap_Guide.html` | Guide à ouvrir dans le navigateur (URL à configurer après déploiement) |
| `roadmap_schema.sql` | Déjà exécuté dans Supabase |
| `roadmap_sync_setup.md` | Guide détaillé |
