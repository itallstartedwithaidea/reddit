# Reddit-Sourced PPC Blog Engine

[English](README.md) | [Français](README.fr.md) | [Español](README.es.md) | [中文](README.zh.md) | [Nederlands](README.nl.md) | [Русский](README.ru.md) | [한국어](README.ko.md)

**Geautomatiseerde AI-blogpipeline die Google Ads- en PPC-vragen van Reddit ontdekt, expertartikelen genereert met Claude, en deployt naar Cloudflare Pages — twee keer per dag, volledig onbeheerd.**

[![Live Blog](https://img.shields.io/badge/Live_Blog-googleadsagent.ai-f0a830?style=for-the-badge)](https://googleadsagent.ai/blog/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-7C3AED?style=for-the-badge)](https://anthropic.com)
[![Reddit](https://img.shields.io/badge/Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com/r/PPC)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## Wat dit project doet

Deze engine draait op een Cloudflare Worker, twee keer per dag getriggerd door cron. Elke run:

1. **Ontdekt** trending PPC-vragen van Reddit via SearchAPI (SERP-gebaseerd, geen Reddit API nodig)
2. **Filtert** op kwaliteit — minimale engagement, blokkeerlijst, NSFW-uitsluiting, duplicaatdetectie
3. **Ontdubbelt** met Vectorize semantische gelijkenis om te voorkomen dat hetzelfde onderwerp twee keer wordt gepubliceerd
4. **Genereert** een volledig expertartikel van 1.500-3.000 woorden met Claude (Anthropic)
5. **Valideert** de HTML — JSON-LD-schema's, GTM, metatags, AI-vermelding, Reddit-bronvermelding
6. **Publiceert** via GitHub API-commit, wat een Cloudflare Pages-deploy triggert
7. **Verifieert** dat de live URL een 200-status retourneert voordat het als gepubliceerd wordt gemarkeerd
8. **Notificeert** via e-mail + SMS (AT&T-gateway, geen Twilio nodig)
9. **Pingt** IndexNow om het artikel binnen enkele uren te indexeren

Elk gegenereerd artikel bevat volledige SEO-gestructureerde data (`BlogPosting`, `QAPage`, `BreadcrumbList`), E-E-A-T-auteurssignalen, AI-vermelding en een link naar de Reddit-brondiscussie.

---

## Credits en communitybronnen

Dit project bestaat dankzij de geweldige PPC-gemeenschappen op Reddit, LinkedIn, Quora en daarbuiten. Elk artikel dat door deze engine wordt gegenereerd, crediteert de brondiscussie en linkt terug naar de originele thread.

### Reddit-gemeenschappen

| Subreddit | Focus | Link |
|-----------|-------|------|
| **r/PPC** | Pay-per-click-advertenties, Google Ads, Meta Ads | [reddit.com/r/PPC](https://www.reddit.com/r/PPC/) |
| **r/googleads** | Google Ads-specifieke vragen en strategieën | [reddit.com/r/googleads](https://www.reddit.com/r/googleads/) |
| **r/digital_marketing** | Breed digitale marketing inclusief betaalde media | [reddit.com/r/digital_marketing](https://www.reddit.com/r/digital_marketing/) |
| **r/adwords** | Historische Google AdWords-community (nog steeds actief) | [reddit.com/r/adwords](https://www.reddit.com/r/adwords/) |
| **r/marketing** | Algemene marketingstrategie en sectordiscussie | [reddit.com/r/marketing](https://www.reddit.com/r/marketing/) |
| **r/SEO** | Zoekmachineoptimalisatie (cross-channel context) | [reddit.com/r/SEO](https://www.reddit.com/r/SEO/) |
| **r/DigitalMarketing** | Digitale strategie, analytics, betaalde media | [reddit.com/r/DigitalMarketing](https://www.reddit.com/r/DigitalMarketing/) |
| **r/FacebookAds** | Meta/Facebook-advertenties | [reddit.com/r/FacebookAds](https://www.reddit.com/r/FacebookAds/) |
| **r/AmazonSeller** | Amazon PPC en marketplace-advertenties | [reddit.com/r/AmazonSeller](https://www.reddit.com/r/AmazonSeller/) |

### Populaire r/PPC-threads die dit project inspireerden

- [Moet ik breed of exact matchen gebruiken?](https://www.reddit.com/r/PPC/) — Het eeuwige match-type-debat
- [Hoeveel moet ik uitgeven aan Google Ads voor een klein bedrijf?](https://www.reddit.com/r/PPC/) — Budgetbepalingsvragen
- [Performance Max vs zoekadvertentiecampagnes](https://www.reddit.com/r/PPC/) — Campagnetype-selectie
- [Mijn CPC blijft stijgen, wat moet ik doen?](https://www.reddit.com/r/PPC/) — Kostenoptimalisatie
- [Is Google Ads het waard voor een nieuw bedrijf?](https://www.reddit.com/r/PPC/) — ROI-rechtvaardiging
- [Smart Bidding werkt niet voor mij](https://www.reddit.com/r/PPC/) — Biedstrategie-probleemoplossing
- [Hoe structureer je een Google Ads-account?](https://www.reddit.com/r/PPC/) — Accountorganisatie

### LinkedIn-gemeenschappen en thought leaders

- [Google Ads Community op LinkedIn](https://www.linkedin.com/groups/2517/) — Actieve professionele groep
- [PPC Chat Community](https://www.linkedin.com/groups/4043498/) — Wekelijkse Twitter/X-chatcommunity
- [Digital Marketing Professionals](https://www.linkedin.com/groups/62821/) — Brede digitale marketinggroep
- [Paid Search Association](https://www.linkedin.com/company/paid-search-association/) — Brancheorganisatie
- [Google Ads Help Community](https://support.google.com/google-ads/community) — Officieel Google-forum

### Quora-onderwerpen

- [Google Ads (Quora)](https://www.quora.com/topic/Google-Ads) — Vragen en antwoorden over Google Ads-strategie
- [PPC Advertising (Quora)](https://www.quora.com/topic/Pay-Per-Click-Advertising) — Pay-per-click-discussies
- [Digital Marketing (Quora)](https://www.quora.com/topic/Digital-Marketing) — Brede marketing Q&A
- [SEM (Quora)](https://www.quora.com/topic/Search-Engine-Marketing-SEM) — Zoekmachinemarketing

### Gerefereerde open-source tools

| Project | Beschrijving | Link |
|---------|-------------|------|
| **Google Ads MCP** | Python MCP-server met 29 tools voor de Google Ads API | [github.com/itallstartedwithaidea/google-ads-mcp](https://github.com/itallstartedwithaidea/google-ads-mcp) |
| **Google Ads Gemini Extension** | Gemini CLI-extensie met 22 tools | [github.com/itallstartedwithaidea/google-ads-gemini-extension](https://github.com/itallstartedwithaidea/google-ads-gemini-extension) |
| **Google Ads Skills** | Anthropic Claude Agent Skills voor Google Ads | [github.com/itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) |
| **Google Ads API Agent** | Volledige Python-agent met 28 acties | [github.com/itallstartedwithaidea/google-ads-api-agent](https://github.com/itallstartedwithaidea/google-ads-api-agent) |
| **GoogleAdsAgent.ai** | De volledige website en tools | [googleadsagent.ai](https://googleadsagent.ai) |

---

## Architectuur

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

### Statusmachine

Elk artikel doorloopt deze statussen:

```
discovered → queued → generating → draft_ready → published
                │                       │
                ▼                       ▼
             skipped                  failed
         (filtered out)          (retryable error)
```

### Gebruikte Cloudflare-services

| Service | Doel |
|---------|------|
| **Workers** | Blog engine runtime (cron-getriggerd) |
| **D1** | Artikeltrackingdatabase (SQLite) — status, budgetten, runlogs |
| **KV** | Blogmanifest voor dynamische indexpagina |
| **R2** | Hero-afbeeldingopslag |
| **Workers AI** | Embeddings (bge-base-en-v1.5) + afbeeldingsgeneratie (Stable Diffusion XL) |
| **Vectorize** | Semantische ontdubbelingsindex (cosinus-gelijkenis op blog-topics) |
| **Pages** | Statische sitehosting + Functions |

---

## Snelstart

### Vereisten

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Cloudflare-account met betaald Workers-plan
- [Anthropic API-sleutel](https://console.anthropic.com/)
- [SearchAPI-sleutel](https://www.searchapi.io/)
- [GitHub personal access token](https://github.com/settings/tokens) (repo-scope)
- Google OAuth via Buddy (voor e-mail/SMS-notificaties — gebruikt Gmail API, geen extra service)

### Stap 1: Kloon de repository

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

### Stap 2: Maak Cloudflare-resources aan

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

### Stap 3: Configureer wrangler.toml

Werk de binding-ID's bij in `wrangler.toml` met de waarden uit Stap 2:

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "YOUR_D1_ID_HERE"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "YOUR_KV_ID_HERE"
```

### Stap 4: Stel geheimen in

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

### Stap 5: Initialiseer de database

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

### Stap 6: Deploy

```bash
wrangler deploy
```

### Stap 7: Test met een dry run

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### Stap 8: Trigger een echte run

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET"
```

---

## Projectstructuur

```
reddit/
├── src/
│   ├── index.ts          # Worker-entrypoint — cron-handler, HTTP-routes, pipeline-orkestratie
│   ├── types.ts           # TypeScript-interfaces voor alle datatypen
│   ├── db.ts              # D1-databasebewerkingen — artikelen, budget, runlogs
│   ├── ingest.ts          # Reddit-threadontdekking via SearchAPI SERP
│   ├── gates.ts           # Kwaliteitsfilters, blokkeerlijst, Vectorize semantische ontdubbeling
│   ├── topics.ts          # Onderwerpclassificatie in 12 PPC-clusters
│   ├── generate.ts        # Claude-artikelgeneratie + gerelateerde artikelkoppelingen
│   ├── template.ts        # Volledig HTML-template (overeenkomend met googleadsagent.ai-ontwerp)
│   ├── images.ts          # Workers AI hero-afbeeldingsgeneratie (Stable Diffusion XL)
│   ├── validate.ts        # Post-generatievalidatie (10+ controles)
│   ├── publish.ts         # GitHub API-commit + deployverificatie
│   ├── notify.ts          # E-mail + SMS-notificaties + IndexNow
│   └── budget.ts          # Kostentracking, dagelijkse/maandelijkse limieten
├── schema.sql             # D1-databaseschema
├── wrangler.toml          # Cloudflare Worker-configuratie
├── package.json
├── tsconfig.json
└── README.md
```

---

## Configuratie

### Omgevingsvariabelen (wrangler.toml)

| Variabele | Standaard | Beschrijving |
|-----------|-----------|-------------|
| `MAX_POSTS_PER_RUN` | `2` | Maximum artikelen per cron-run |
| `MAX_DAILY_GENERATIONS` | `4` | Maximum artikelen per dag (2 runs x 2 artikelen) |
| `MAX_MONTHLY_USD` | `50` | Maandelijks budgetlimiet (Claude + SearchAPI-kosten) |
| `SITE_URL` | `https://googleadsagent.ai` | Basis-URL van je site |
| `GITHUB_REPO` | `itallstartedwithaidea/googleadsagent-site` | GitHub-repo voor git-commits |
| `GITHUB_BRANCH` | `main` | Branch om naar te committen |

### Onderwerpsclusters

Elk artikel wordt geclassificeerd in een van de 12 PPC-onderwerpsclusters:

| Cluster | Zoekwoorden |
|---------|-------------|
| Bieden | bid, tCPA, tROAS, smart bidding, handmatige CPC |
| Creatief | RSA, koppen, advertentietekst, extensies, sitelinks |
| Doelgroepen | targeting, remarketing, aangepaste segmenten, breed matchen |
| Meting | conversietracking, GA4, attributie, verbeterde conversies |
| Automatisering | scripts, regels, API, AI Max, optimalisatiescore |
| Beleid | afgekeurd, geschorst, handelsmerk, beroep |
| Shopping | shopping, merchant center, PMax, productfeed |
| Video | YouTube, demand gen, bumper, TrueView |
| Lokaal | lokale campagnes, GMB, locatie-extensies |
| Budget | CPC, CPA, ROAS, dagbudget, pacing |
| Accountstructuur | advertentiegroepen, naamgevingsconventies, SKAG, Hagakure |
| Algemeen | Vangnet voor brede strategievragen |

---

## Hoe artikelen worden gegenereerd

### Prompt-engineering

Elk artikel wordt gegenereerd door Claude met een systeemprompt die:
- De stem instelt als John Williams, Senior Paid Media Specialist ($350M+ beheerd)
- De Reddit-threadcontext biedt (titel, subreddit, fragment)
- 1.500-3.000 woorden substantiële, actiegerichte inhoud vereist
- Callout-boxen, vergelijkingstabellen, statistiekkaarten verplicht stelt
- Specifieke benchmarks en echte campagnedataranges vereist
- Verzonnen Redditor-citaten verbiedt
- Een "Conclusie"-sectie met genummerde actiepunten verplicht stelt

### HTML-template

Elk artikel bevat:
- **3 JSON-LD-blokken**: `BlogPosting` (met volledige auteursentiteit + sameAs), `BreadcrumbList`, `QAPage`
- **Volledige metatags**: og:*, twitter:*, canonical, robots
- **GTM-tracking**: GTM-NR7F6P92
- **AI-vermelding**: Zichtbaar blok dat Reddit-bron + AI-assistentie crediteert
- **Auteurs-E-E-A-T-signalen**: Person-schema met naam, jobTitle, sameAs-links
- **Responsive ontwerp**: Donker thema dat overeenkomt met googleadsagent.ai

### Validatiecontroles (10+)

Vóór publicatie wordt elk artikel gevalideerd op:

1. Woordenaantal binnen grenzen (800-5.000)
2. GTM-snippet aanwezig
3. BlogPosting JSON-LD aanwezig en geldig JSON
4. BreadcrumbList JSON-LD aanwezig
5. QAPage JSON-LD aanwezig
6. Reddit-bron-URL in de artikeltekst
7. AI-vermeldingsblok aanwezig
8. Canonical URL zonder `.html`-suffix
9. og:image en twitter:image tags aanwezig
10. Auteursnaam aanwezig
11. Gedeelde scripts (sitezoeken, cookietoestemming, chatwidget)

---

## Notificaties

### E-mail
```
From: blog-engine@googleadsagent.ai
To: your@email.com
Subject: New post live: {title}
Body: {title}\n{live URL}
```

### SMS (via provider-e-mailgateway — geen Twilio nodig)
```
To: 5551234567@txt.att.net
Body: New post: {title} {url}
```

### Budgetwaarschuwingen
- **80% maandbudget**: E-mail + SMS-waarschuwing
- **100% maandbudget**: E-mail + SMS, pipeline pauzeert tot volgende maand

### Foutwaarschuwingen
- Pipeline-fouten: Alleen e-mail (geen SMS om je niet wakker te maken)

---

## Beveiligingen

| Risico | Bescherming |
|--------|-------------|
| Dubbele artikelen | D1 unieke constraint op reddit_id + Vectorize cosinus-gelijkenis (drempel 0,85) |
| 404 na publicatie | 5-keer verificatie (GET met cache-bypass, controleert 200 + inhoud > 1KB) |
| Ongecontroleerde kosten | `MAX_POSTS_PER_RUN`, `MAX_DAILY_GENERATIONS`, `MAX_MONTHLY_USD` — alles faalt veilig |
| Vastgelopen "generating"-status | Auto-reset van artikelen die > 2 uur in "generating" staan bij de volgende run |
| Giftige inhoud | Blokkeerlijst + minimale kwaliteitsdrempels |
| Reddit TOS | Alleen-lezen SERP-ontdekking (geen Reddit API-aanroepen), bronvermelding in elk artikel |
| Ongeldige HTML | 10+ validatiecontroles vóór elke publicatiepoging |
| API-storingen | Exponentiële backoff, begrensde retries, nette foutlogging |

---

## Live voorbeelden

Deze artikelen zijn gegenereerd door deze engine en zijn live op [googleadsagent.ai](https://googleadsagent.ai):

1. [Should I Use Broad Match or Exact Match in Google Ads in 2026?](https://googleadsagent.ai/blog/reddit/broad-match-vs-exact-match-google-ads-2026)
2. [How Much Should I Spend on Google Ads? The Small Business Reality Check](https://googleadsagent.ai/blog/reddit/how-much-should-i-spend-on-google-ads-small-business)
3. [Performance Max vs Search Campaigns: When to Use Which](https://googleadsagent.ai/blog/reddit/performance-max-vs-search-campaigns-when-to-use-which)

---

## Juridisch en compliance

- **Reddit**: Deze engine gebruikt SearchAPI (Google SERP) voor threadontdekking — het roept NIET rechtstreeks de Reddit API aan. Alle artikelen linken terug naar de bronthread en schrijven inhoud toe aan de communitydiscussie. Geen Reddit-gebruikersinhoud wordt letterlijk gekopieerd.
- **AI-vermelding**: Elk artikel bevat een zichtbaar AI-vermeldingsblok. Geen inhoud wordt gepresenteerd als uitsluitend door mensen geschreven.
- **Auteursrecht**: Artikelen zijn originele AI-gegenereerde analyses geïnspireerd door communityvragen. Ze reproduceren geen Reddit-posts of -reacties.
- **Privacy**: Geen Reddit-gebruikersnamen, IP-adressen of persoonsgegevens worden opgeslagen. Alleen thread-ID's en URL's worden bijgehouden.

---

## Auteur

**John Williams** — Senior Paid Media Specialist, $350M+ beheerd

- [googleadsagent.ai](https://googleadsagent.ai)
- [GitHub](https://github.com/itallstartedwithaidea)
- [LinkedIn](https://www.linkedin.com/in/johnmwilliams/)
- [Substack](https://itallstartedwithaidea.substack.com)
- [Twitter/X](https://twitter.com/_johnmwilliams)

---

## Licentie

MIT-licentie — zie [LICENSE](LICENSE) voor details.
