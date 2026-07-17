# Reddit-Sourced PPC Blog Engine

[English](README.md) | [Français](README.fr.md) | [Español](README.es.md) | [中文](README.zh.md) | [Nederlands](README.nl.md) | [Русский](README.ru.md) | [한국어](README.ko.md)

**Pipeline de blog IA automatisé qui découvre des questions sur Google Ads et le PPC depuis Reddit, génère des articles de niveau expert avec Claude, et déploie sur Cloudflare Pages — deux fois par jour, entièrement autonome.**

[![Live Blog](https://img.shields.io/badge/Live_Blog-googleadsagent.ai-f0a830?style=for-the-badge)](https://googleadsagent.ai/blog/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-7C3AED?style=for-the-badge)](https://anthropic.com)
[![Reddit](https://img.shields.io/badge/Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com/r/PPC)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## Ce que fait ce projet

Ce moteur fonctionne sur un Cloudflare Worker, déclenché deux fois par jour par cron. Chaque exécution :

1. **Découvre** les questions PPC tendances sur Reddit via SearchAPI (basé sur les SERP, aucune API Reddit requise)
2. **Filtre** la qualité — engagement minimum, liste de blocage, exclusion NSFW, détection de doublons
3. **Déduplique** via la similarité sémantique Vectorize pour éviter de publier le même sujet deux fois
4. **Génère** un article expert complet de 1 500 à 3 000 mots avec Claude (Anthropic)
5. **Valide** le HTML — schémas JSON-LD, GTM, balises meta, divulgation IA, attribution Reddit
6. **Publie** via un commit API GitHub, déclenchant le déploiement Cloudflare Pages
7. **Vérifie** que l'URL en production renvoie un code 200 avant de marquer comme publié
8. **Notifie** par e-mail + SMS (passerelle AT&T, sans Twilio)
9. **Ping** IndexNow pour indexer l'article en quelques heures

Chaque article généré inclut des données structurées SEO complètes (`BlogPosting`, `QAPage`, `BreadcrumbList`), des signaux E-E-A-T d'auteur, une divulgation IA, et un lien vers la discussion Reddit source.

---

## Crédits et sources communautaires

Ce projet existe grâce aux incroyables communautés de praticiens PPC sur Reddit, LinkedIn, Quora et au-delà. Chaque article généré par ce moteur crédite sa discussion source et renvoie vers le fil d'origine.

### Communautés Reddit

| Subreddit | Thématique | Lien |
|-----------|------------|------|
| **r/PPC** | Publicité au clic, Google Ads, Meta Ads | [reddit.com/r/PPC](https://www.reddit.com/r/PPC/) |
| **r/googleads** | Questions et stratégies spécifiques à Google Ads | [reddit.com/r/googleads](https://www.reddit.com/r/googleads/) |
| **r/digital_marketing** | Marketing digital au sens large, incluant le paid media | [reddit.com/r/digital_marketing](https://www.reddit.com/r/digital_marketing/) |
| **r/adwords** | Communauté historique Google AdWords (toujours active) | [reddit.com/r/adwords](https://www.reddit.com/r/adwords/) |
| **r/marketing** | Stratégie marketing générale et discussions sectorielles | [reddit.com/r/marketing](https://www.reddit.com/r/marketing/) |
| **r/SEO** | Optimisation pour les moteurs de recherche (contexte cross-canal) | [reddit.com/r/SEO](https://www.reddit.com/r/SEO/) |
| **r/DigitalMarketing** | Stratégie digitale, analytics, paid media | [reddit.com/r/DigitalMarketing](https://www.reddit.com/r/DigitalMarketing/) |
| **r/FacebookAds** | Publicité Meta/Facebook | [reddit.com/r/FacebookAds](https://www.reddit.com/r/FacebookAds/) |
| **r/AmazonSeller** | PPC Amazon et publicité marketplace | [reddit.com/r/AmazonSeller](https://www.reddit.com/r/AmazonSeller/) |

### Fils populaires r/PPC ayant inspiré ce projet

- [Faut-il utiliser le ciblage large ou exact ?](https://www.reddit.com/r/PPC/) — Le débat éternel sur les types de correspondance
- [Combien investir dans Google Ads pour une petite entreprise ?](https://www.reddit.com/r/PPC/) — Questions de dimensionnement budgétaire
- [Performance Max vs campagnes Search](https://www.reddit.com/r/PPC/) — Sélection du type de campagne
- [Mon CPC ne cesse d'augmenter, que faire ?](https://www.reddit.com/r/PPC/) — Optimisation des coûts
- [Google Ads en vaut-il la peine pour une nouvelle entreprise ?](https://www.reddit.com/r/PPC/) — Justification du ROI
- [Les enchères intelligentes ne fonctionnent pas pour moi](https://www.reddit.com/r/PPC/) — Dépannage des stratégies d'enchères
- [Comment structurer un compte Google Ads ?](https://www.reddit.com/r/PPC/) — Organisation du compte

### Communautés LinkedIn et leaders d'opinion

- [Google Ads Community sur LinkedIn](https://www.linkedin.com/groups/2517/) — Groupe actif de professionnels
- [PPC Chat Community](https://www.linkedin.com/groups/4043498/) — Communauté de chat hebdomadaire Twitter/X
- [Digital Marketing Professionals](https://www.linkedin.com/groups/62821/) — Groupe de marketing digital au sens large
- [Paid Search Association](https://www.linkedin.com/company/paid-search-association/) — Organisation sectorielle
- [Google Ads Help Community](https://support.google.com/google-ads/community) — Forum officiel Google

### Sujets Quora

- [Google Ads (Quora)](https://www.quora.com/topic/Google-Ads) — Questions-réponses sur les stratégies Google Ads
- [PPC Advertising (Quora)](https://www.quora.com/topic/Pay-Per-Click-Advertising) — Discussions sur le paiement au clic
- [Digital Marketing (Quora)](https://www.quora.com/topic/Digital-Marketing) — Questions-réponses marketing au sens large
- [SEM (Quora)](https://www.quora.com/topic/Search-Engine-Marketing-SEM) — Marketing sur les moteurs de recherche

### Outils open source référencés

| Projet | Description | Lien |
|--------|-------------|------|
| **Google Ads MCP** | Serveur MCP Python avec 29 outils pour l'API Google Ads | [github.com/itallstartedwithaidea/google-ads-mcp](https://github.com/itallstartedwithaidea/google-ads-mcp) |
| **Google Ads Gemini Extension** | Extension Gemini CLI avec 22 outils | [github.com/itallstartedwithaidea/google-ads-gemini-extension](https://github.com/itallstartedwithaidea/google-ads-gemini-extension) |
| **Google Ads Skills** | Compétences Anthropic Claude Agent pour Google Ads | [github.com/itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) |
| **Google Ads API Agent** | Agent Python complet avec 28 actions | [github.com/itallstartedwithaidea/google-ads-api-agent](https://github.com/itallstartedwithaidea/google-ads-api-agent) |
| **GoogleAdsAgent.ai** | Le site web complet et ses outils | [googleadsagent.ai](https://googleadsagent.ai) |

---

## Architecture

```
                                    ┌─────────────────┐
                                    │  Cron Scheduler  │
                                    │  7am + 7pm ET    │
                                    └────────┬────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Blog Engine Worker                           │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────────┐│
│  │ Discover  │──▶│  Filter  │──▶│ Generate │──▶│    Validate      ││
│  │ (SERP)   │   │ & Dedupe │   │ (Claude) │   │ (schema, links)  ││
│  └──────────┘   └──────────┘   └──────────┘   └────────┬─────────┘│
│       │              │              │                    │          │
│       ▼              ▼              ▼                    ▼          │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────────┐│
│  │SearchAPI │   │Vectorize │   │  Claude   │   │   GitHub API     ││
│  │          │   │ D1 (DB)  │   │  API      │   │   Commit + Push  ││
│  └──────────┘   └──────────┘   └──────────┘   └────────┬─────────┘│
│                                                         │          │
└─────────────────────────────────────────────────────────┼──────────┘
                                                          │
                          ┌───────────────────────────────┼──────────┐
                          │                               ▼          │
                          │  ┌──────────┐   ┌──────────────────────┐ │
                          │  │ Verify   │──▶│ Notify (Email + SMS) │ │
                          │  │ (200 OK) │   │ IndexNow Ping        │ │
                          │  └──────────┘   └──────────────────────┘ │
                          │          Cloudflare Pages Deploy         │
                          └──────────────────────────────────────────┘
```

### Machine à états

Chaque article passe par ces statuts :

```
discovered → queued → generating → draft_ready → published
                │                       │
                ▼                       ▼
             skipped                  failed
         (filtered out)          (retryable error)
```

### Services Cloudflare utilisés

| Service | Fonction |
|---------|----------|
| **Workers** | Environnement d'exécution du moteur de blog (déclenché par cron) |
| **D1** | Base de données de suivi des articles (SQLite) — statuts, budgets, logs d'exécution |
| **KV** | Manifeste du blog pour la page d'index dynamique |
| **R2** | Stockage des images principales |
| **Workers AI** | Embeddings (bge-base-en-v1.5) + génération d'images (Stable Diffusion XL) |
| **Vectorize** | Index de déduplication sémantique (similarité cosinus sur blog-topics) |
| **Pages** | Hébergement de site statique + Functions |

---

## Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Compte Cloudflare avec plan Workers payant
- [Clé API Anthropic](https://console.anthropic.com/)
- [Clé SearchAPI](https://www.searchapi.io/)
- [Token d'accès personnel GitHub](https://github.com/settings/tokens) (scope repo)
- Google OAuth via Buddy (pour les notifications e-mail/SMS — utilise l'API Gmail, aucun service supplémentaire)

### Étape 1 : Cloner le dépôt

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

### Étape 2 : Créer les ressources Cloudflare

```bash
# Create D1 database
wrangler d1 create blog-tracker
# Copy the database_id into wrangler.toml

# Create KV namespace
wrangler kv namespace create BLOG_DATA
# Copy the id into wrangler.toml

# Create R2 bucket
wrangler r2 bucket create blog-assets

# Create Vectorize index
wrangler vectorize create blog-topics --dimensions=768 --metric=cosine
```

### Étape 3 : Configurer wrangler.toml

Mettez à jour les IDs de liaison dans `wrangler.toml` avec les valeurs de l'étape 2 :

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "YOUR_D1_ID_HERE"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "YOUR_KV_ID_HERE"
```

### Étape 4 : Définir les secrets

```bash
wrangler secret put ANTHROPIC_API_KEY
# Paste your Anthropic API key

wrangler secret put SEARCHAPI_KEY
# Paste your SearchAPI key

wrangler secret put GITHUB_TOKEN
# Paste your GitHub personal access token

# Notifications use Gmail API via the admin's Google OAuth session
# No additional API keys needed for email/SMS

wrangler secret put EMAIL_TO
# Enter: your@email.com

wrangler secret put SMS_GATEWAY_TO
# Enter: your 10-digit phone number (e.g. 5551234567)
# SMS is sent via AT&T gateway: number@txt.att.net
# For other carriers:
#   T-Mobile: number@tmomail.net
#   Verizon: number@vtext.com
#   Sprint: number@messaging.sprintpcs.com

wrangler secret put CRON_SECRET
# Enter a random secret string for auth
```

### Étape 5 : Initialiser la base de données

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

### Étape 6 : Déployer

```bash
wrangler deploy
```

### Étape 7 : Tester avec un essai à blanc

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### Étape 8 : Déclencher une exécution réelle

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET"
```

---

## Structure du projet

```
reddit/
├── src/
│   ├── index.ts          # Entrée Worker — gestionnaire cron, routes HTTP, orchestration du pipeline
│   ├── types.ts           # Interfaces TypeScript pour tous les types de données
│   ├── db.ts              # Opérations de base de données D1 — articles, budget, logs d'exécution
│   ├── ingest.ts          # Découverte de fils Reddit via SearchAPI SERP
│   ├── gates.ts           # Filtres de qualité, liste de blocage, déduplication sémantique Vectorize
│   ├── topics.ts          # Classification des sujets en 12 clusters PPC
│   ├── generate.ts        # Génération d'articles Claude + liens vers articles liés
│   ├── template.ts        # Template HTML complet (design googleadsagent.ai)
│   ├── images.ts          # Génération d'images principales Workers AI (Stable Diffusion XL)
│   ├── validate.ts        # Validation post-génération (10+ vérifications)
│   ├── publish.ts         # Commit API GitHub + vérification du déploiement
│   ├── notify.ts          # Notifications e-mail + SMS + IndexNow
│   └── budget.ts          # Suivi des coûts, plafonds quotidiens/mensuels
├── schema.sql             # Schéma de base de données D1
├── wrangler.toml          # Configuration du Cloudflare Worker
├── package.json
├── tsconfig.json
└── README.md
```

---

## Configuration

### Variables d'environnement (wrangler.toml)

| Variable | Par défaut | Description |
|----------|------------|-------------|
| `MAX_POSTS_PER_RUN` | `2` | Nombre maximum d'articles à publier par exécution cron |
| `MAX_DAILY_GENERATIONS` | `4` | Nombre maximum d'articles par jour (2 exécutions x 2 articles) |
| `MAX_MONTHLY_USD` | `50` | Plafond budgétaire mensuel (coûts Claude + SearchAPI) |
| `SITE_URL` | `https://googleadsagent.ai` | URL de base de votre site |
| `GITHUB_REPO` | `itallstartedwithaidea/googleadsagent-site` | Dépôt GitHub pour les commits git |
| `GITHUB_BRANCH` | `main` | Branche sur laquelle committer |

### Clusters de sujets

Chaque article est classé dans l'un des 12 clusters de sujets PPC :

| Cluster | Mots-clés |
|---------|-----------|
| Enchères | bid, tCPA, tROAS, smart bidding, CPC manuel |
| Créatif | RSA, titres, texte publicitaire, extensions, liens annexes |
| Audiences | ciblage, remarketing, segments personnalisés, requête large |
| Mesure | suivi des conversions, GA4, attribution, conversions améliorées |
| Automatisation | scripts, règles, API, AI Max, score d'optimisation |
| Politique | refusé, suspendu, marque déposée, appel |
| Shopping | shopping, merchant center, PMax, flux de produits |
| Vidéo | YouTube, demand gen, bumper, TrueView |
| Local | campagnes locales, GMB, extensions de lieu |
| Budget | CPC, CPA, ROAS, budget quotidien, rythme de dépense |
| Structure de compte | groupes d'annonces, conventions de nommage, SKAG, Hagakure |
| Général | Fourre-tout pour les questions de stratégie générale |

---

## Comment les articles sont générés

### Ingénierie de prompt

Chaque article est généré par Claude avec un prompt système qui :
- Définit la voix de John Williams, Spécialiste Senior Paid Media (350 M$+ gérés)
- Fournit le contexte du fil Reddit (titre, subreddit, extrait)
- Exige 1 500 à 3 000 mots de contenu substantiel et actionnable
- Impose des encadrés, des tableaux comparatifs, des cartes de statistiques
- Exige des benchmarks spécifiques et des fourchettes de données de campagnes réelles
- Interdit les citations de Redditors fabriquées
- Impose une section « Conclusion » avec des points d'action numérotés

### Template HTML

Chaque article comprend :
- **3 blocs JSON-LD** : `BlogPosting` (avec entité auteur complète + sameAs), `BreadcrumbList`, `QAPage`
- **Balises meta complètes** : og:*, twitter:*, canonical, robots
- **Tracking GTM** : GTM-NR7F6P92
- **Divulgation IA** : Bloc visible créditant la source Reddit + l'assistance IA
- **Signaux E-E-A-T d'auteur** : Schema Person avec nom, jobTitle, liens sameAs
- **Design responsive** : Thème sombre correspondant à googleadsagent.ai

### Vérifications de validation (10+)

Avant publication, chaque article est validé pour :

1. Nombre de mots dans les limites (800-5 000)
2. Snippet GTM présent
3. JSON-LD BlogPosting présent et JSON valide
4. JSON-LD BreadcrumbList présent
5. JSON-LD QAPage présent
6. URL source Reddit dans le corps de l'article
7. Bloc de divulgation IA présent
8. URL canonique sans suffixe `.html`
9. Balises og:image et twitter:image présentes
10. Nom de l'auteur présent
11. Scripts partagés (recherche site, consentement cookies, widget chat)

---

## Notifications

### E-mail
```
From: blog-engine@googleadsagent.ai
To: your@email.com
Subject: New post live: {title}
Body: {title}\n{live URL}
```

### SMS (via passerelle e-mail opérateur — sans Twilio)
```
To: 5551234567@txt.att.net
Body: New post: {title} {url}
```

### Alertes budgétaires
- **80 % du budget mensuel** : Avertissement par e-mail + SMS
- **100 % du budget mensuel** : E-mail + SMS, le pipeline s'arrête jusqu'au mois suivant

### Alertes d'erreur
- Échecs du pipeline : E-mail uniquement (pas de SMS pour éviter de vous réveiller)

---

## Protections

| Risque | Protection |
|--------|-----------|
| Articles en double | Contrainte unique D1 sur reddit_id + similarité cosinus Vectorize (seuil 0,85) |
| 404 après publication | Vérification en 5 tentatives (GET sans cache, vérifie 200 + contenu > 1 Ko) |
| Coûts incontrôlés | `MAX_POSTS_PER_RUN`, `MAX_DAILY_GENERATIONS`, `MAX_MONTHLY_USD` — tout échoue de manière sécurisée |
| État "generating" bloqué | Réinitialisation automatique des articles bloqués en "generating" depuis plus de 2 heures lors de la prochaine exécution |
| Contenu toxique | Liste de blocage + seuils de qualité minimum |
| CGU Reddit | Découverte en lecture seule via SERP (aucun appel API Reddit), attribution dans chaque article |
| HTML invalide | 10+ vérifications de validation avant toute tentative de publication |
| Pannes d'API | Backoff exponentiel, tentatives limitées, journalisation propre des erreurs |

---

## Exemples en production

Ces articles ont été générés par ce moteur et sont en ligne sur [googleadsagent.ai](https://googleadsagent.ai) :

1. [Should I Use Broad Match or Exact Match in Google Ads in 2026?](https://googleadsagent.ai/blog/reddit/broad-match-vs-exact-match-google-ads-2026)
2. [How Much Should I Spend on Google Ads? The Small Business Reality Check](https://googleadsagent.ai/blog/reddit/how-much-should-i-spend-on-google-ads-small-business)
3. [Performance Max vs Search Campaigns: When to Use Which](https://googleadsagent.ai/blog/reddit/performance-max-vs-search-campaigns-when-to-use-which)

---

## Mentions légales et conformité

- **Reddit** : Ce moteur utilise SearchAPI (Google SERP) pour la découverte de fils — il n'appelle PAS directement l'API Reddit. Tous les articles renvoient vers le fil source et attribuent le contenu à la discussion communautaire. Aucun contenu d'utilisateur Reddit n'est copié mot pour mot.
- **Divulgation IA** : Chaque article contient un bloc de divulgation IA visible. Aucun contenu n'est présenté comme uniquement rédigé par un humain.
- **Droits d'auteur** : Les articles sont des analyses originales générées par IA, inspirées par des questions communautaires. Ils ne reproduisent pas les publications ou commentaires Reddit.
- **Vie privée** : Aucun nom d'utilisateur Reddit, adresse IP ou donnée personnelle n'est stocké. Seuls les IDs de fils et les URLs sont suivis.

---

## Auteur

**John Williams** — Spécialiste Senior Paid Media, 350 M$+ gérés

- [googleadsagent.ai](https://googleadsagent.ai)
- [GitHub](https://github.com/itallstartedwithaidea)
- [LinkedIn](https://www.linkedin.com/in/johnmwilliams/)
- [Substack](https://itallstartedwithaidea.substack.com)
- [Twitter/X](https://twitter.com/_johnmwilliams)

---

## Licence

Licence MIT — voir [LICENSE](LICENSE) pour les détails.
