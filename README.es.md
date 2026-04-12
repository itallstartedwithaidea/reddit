# Reddit-Sourced PPC Blog Engine

[English](README.md) | [Français](README.fr.md) | [Español](README.es.md) | [中文](README.zh.md) | [Nederlands](README.nl.md) | [Русский](README.ru.md) | [한국어](README.ko.md)

**Pipeline de blog con IA automatizado que descubre preguntas sobre Google Ads y PPC en Reddit, genera artículos de nivel experto con Claude, y despliega en Cloudflare Pages — dos veces al día, completamente desatendido.**

[![Live Blog](https://img.shields.io/badge/Live_Blog-googleadsagent.ai-f0a830?style=for-the-badge)](https://googleadsagent.ai/blog/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-7C3AED?style=for-the-badge)](https://anthropic.com)
[![Reddit](https://img.shields.io/badge/Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com/r/PPC)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## Qué hace este proyecto

Este motor funciona en un Cloudflare Worker, activado dos veces al día por cron. Cada ejecución:

1. **Descubre** preguntas PPC tendencia en Reddit a través de SearchAPI (basado en SERP, sin necesidad de API de Reddit)
2. **Filtra** por calidad — engagement mínimo, lista de bloqueo, exclusión NSFW, detección de duplicados
3. **Deduplica** usando similitud semántica de Vectorize para evitar publicar el mismo tema dos veces
4. **Genera** un artículo experto completo de 1.500 a 3.000 palabras con Claude (Anthropic)
5. **Valida** el HTML — esquemas JSON-LD, GTM, meta tags, divulgación de IA, atribución a Reddit
6. **Publica** mediante commit a la API de GitHub, activando el despliegue en Cloudflare Pages
7. **Verifica** que la URL en producción devuelve un código 200 antes de marcarlo como publicado
8. **Notifica** por correo electrónico + SMS (pasarela AT&T, sin Twilio)
9. **Envía ping** a IndexNow para indexar el artículo en horas

Cada artículo generado incluye datos estructurados SEO completos (`BlogPosting`, `QAPage`, `BreadcrumbList`), señales E-E-A-T de autor, divulgación de IA y un enlace a la discusión original en Reddit.

---

## Créditos y fuentes comunitarias

Este proyecto existe gracias a las increíbles comunidades de profesionales PPC en Reddit, LinkedIn, Quora y más. Cada artículo generado por este motor acredita su discusión fuente y enlaza al hilo original.

### Comunidades de Reddit

| Subreddit | Enfoque | Enlace |
|-----------|---------|--------|
| **r/PPC** | Publicidad de pago por clic, Google Ads, Meta Ads | [reddit.com/r/PPC](https://www.reddit.com/r/PPC/) |
| **r/googleads** | Preguntas y estrategias específicas de Google Ads | [reddit.com/r/googleads](https://www.reddit.com/r/googleads/) |
| **r/digital_marketing** | Marketing digital en general, incluyendo medios pagados | [reddit.com/r/digital_marketing](https://www.reddit.com/r/digital_marketing/) |
| **r/adwords** | Comunidad histórica de Google AdWords (aún activa) | [reddit.com/r/adwords](https://www.reddit.com/r/adwords/) |
| **r/marketing** | Estrategia de marketing general y discusión del sector | [reddit.com/r/marketing](https://www.reddit.com/r/marketing/) |
| **r/SEO** | Optimización para motores de búsqueda (contexto cross-canal) | [reddit.com/r/SEO](https://www.reddit.com/r/SEO/) |
| **r/DigitalMarketing** | Estrategia digital, analítica, medios pagados | [reddit.com/r/DigitalMarketing](https://www.reddit.com/r/DigitalMarketing/) |
| **r/FacebookAds** | Publicidad en Meta/Facebook | [reddit.com/r/FacebookAds](https://www.reddit.com/r/FacebookAds/) |
| **r/AmazonSeller** | PPC en Amazon y publicidad en marketplace | [reddit.com/r/AmazonSeller](https://www.reddit.com/r/AmazonSeller/) |

### Hilos populares de r/PPC que inspiraron este proyecto

- [¿Debería usar concordancia amplia o exacta?](https://www.reddit.com/r/PPC/) — El debate perenne sobre tipos de concordancia
- [¿Cuánto debería gastar en Google Ads para una pequeña empresa?](https://www.reddit.com/r/PPC/) — Preguntas sobre dimensionamiento de presupuesto
- [Performance Max vs campañas de búsqueda](https://www.reddit.com/r/PPC/) — Selección del tipo de campaña
- [Mi CPC sigue subiendo, ¿qué hago?](https://www.reddit.com/r/PPC/) — Optimización de costes
- [¿Vale la pena Google Ads para un negocio nuevo?](https://www.reddit.com/r/PPC/) — Justificación del ROI
- [Las pujas inteligentes no me funcionan](https://www.reddit.com/r/PPC/) — Solución de problemas de estrategia de pujas
- [¿Cómo estructurar una cuenta de Google Ads?](https://www.reddit.com/r/PPC/) — Organización de la cuenta

### Comunidades y líderes de opinión en LinkedIn

- [Google Ads Community en LinkedIn](https://www.linkedin.com/groups/2517/) — Grupo activo de profesionales
- [PPC Chat Community](https://www.linkedin.com/groups/4043498/) — Comunidad de chat semanal en Twitter/X
- [Digital Marketing Professionals](https://www.linkedin.com/groups/62821/) — Grupo de marketing digital general
- [Paid Search Association](https://www.linkedin.com/company/paid-search-association/) — Organización sectorial
- [Google Ads Help Community](https://support.google.com/google-ads/community) — Foro oficial de Google

### Temas en Quora

- [Google Ads (Quora)](https://www.quora.com/topic/Google-Ads) — Preguntas y respuestas sobre estrategias de Google Ads
- [PPC Advertising (Quora)](https://www.quora.com/topic/Pay-Per-Click-Advertising) — Discusiones sobre pago por clic
- [Digital Marketing (Quora)](https://www.quora.com/topic/Digital-Marketing) — Preguntas y respuestas de marketing general
- [SEM (Quora)](https://www.quora.com/topic/Search-Engine-Marketing-SEM) — Marketing en motores de búsqueda

### Herramientas open source referenciadas

| Proyecto | Descripción | Enlace |
|----------|-------------|--------|
| **Google Ads MCP** | Servidor MCP en Python con 29 herramientas para la API de Google Ads | [github.com/itallstartedwithaidea/google-ads-mcp](https://github.com/itallstartedwithaidea/google-ads-mcp) |
| **Google Ads Gemini Extension** | Extensión Gemini CLI con 22 herramientas | [github.com/itallstartedwithaidea/google-ads-gemini-extension](https://github.com/itallstartedwithaidea/google-ads-gemini-extension) |
| **Google Ads Skills** | Habilidades de Anthropic Claude Agent para Google Ads | [github.com/itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) |
| **Google Ads API Agent** | Agente Python completo con 28 acciones | [github.com/itallstartedwithaidea/google-ads-api-agent](https://github.com/itallstartedwithaidea/google-ads-api-agent) |
| **GoogleAdsAgent.ai** | El sitio web completo y sus herramientas | [github.com/itallstartedwithaidea/googleadsagent-site](https://github.com/itallstartedwithaidea/googleadsagent-site) |

---

## Arquitectura

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

### Máquina de estados

Cada artículo pasa por estos estados:

```
discovered → queued → generating → draft_ready → published
                │                       │
                ▼                       ▼
             skipped                  failed
         (filtered out)          (retryable error)
```

### Servicios de Cloudflare utilizados

| Servicio | Propósito |
|----------|-----------|
| **Workers** | Entorno de ejecución del motor de blog (activado por cron) |
| **D1** | Base de datos de seguimiento de artículos (SQLite) — estados, presupuestos, logs de ejecución |
| **KV** | Manifiesto del blog para la página de índice dinámica |
| **R2** | Almacenamiento de imágenes principales |
| **Workers AI** | Embeddings (bge-base-en-v1.5) + generación de imágenes (Stable Diffusion XL) |
| **Vectorize** | Índice de deduplicación semántica (similitud coseno en blog-topics) |
| **Pages** | Alojamiento de sitio estático + Functions |

---

## Inicio rápido

### Requisitos previos

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Cuenta de Cloudflare con plan Workers de pago
- [Clave API de Anthropic](https://console.anthropic.com/)
- [Clave de SearchAPI](https://www.searchapi.io/)
- [Token de acceso personal de GitHub](https://github.com/settings/tokens) (scope repo)
- Google OAuth vía Buddy (para notificaciones por correo/SMS — usa la API de Gmail, sin servicios adicionales)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

### Paso 2: Crear los recursos de Cloudflare

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

### Paso 3: Configurar wrangler.toml

Actualiza los IDs de enlace en `wrangler.toml` con los valores del Paso 2:

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "YOUR_D1_ID_HERE"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "YOUR_KV_ID_HERE"
```

### Paso 4: Configurar los secretos

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

### Paso 5: Inicializar la base de datos

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

### Paso 6: Desplegar

```bash
wrangler deploy
```

### Paso 7: Probar con ejecución en seco

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### Paso 8: Ejecutar en producción

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET"
```

---

## Estructura del proyecto

```
reddit/
├── src/
│   ├── index.ts          # Entrada del Worker — manejador cron, rutas HTTP, orquestación del pipeline
│   ├── types.ts           # Interfaces TypeScript para todos los tipos de datos
│   ├── db.ts              # Operaciones de base de datos D1 — artículos, presupuesto, logs de ejecución
│   ├── ingest.ts          # Descubrimiento de hilos de Reddit vía SearchAPI SERP
│   ├── gates.ts           # Filtros de calidad, lista de bloqueo, deduplicación semántica Vectorize
│   ├── topics.ts          # Clasificación de temas en 12 clusters PPC
│   ├── generate.ts        # Generación de artículos con Claude + enlace a artículos relacionados
│   ├── template.ts        # Plantilla HTML completa (diseño de googleadsagent.ai)
│   ├── images.ts          # Generación de imágenes principales con Workers AI (Stable Diffusion XL)
│   ├── validate.ts        # Validación post-generación (10+ verificaciones)
│   ├── publish.ts         # Commit a API de GitHub + verificación de despliegue
│   ├── notify.ts          # Notificaciones por correo + SMS + IndexNow
│   └── budget.ts          # Seguimiento de costes, límites diarios/mensuales
├── schema.sql             # Esquema de base de datos D1
├── wrangler.toml          # Configuración del Cloudflare Worker
├── package.json
├── tsconfig.json
└── README.md
```

---

## Configuración

### Variables de entorno (wrangler.toml)

| Variable | Por defecto | Descripción |
|----------|-------------|-------------|
| `MAX_POSTS_PER_RUN` | `2` | Máximo de artículos a publicar por ejecución cron |
| `MAX_DAILY_GENERATIONS` | `4` | Máximo de artículos por día (2 ejecuciones x 2 artículos) |
| `MAX_MONTHLY_USD` | `50` | Límite presupuestario mensual (costes de Claude + SearchAPI) |
| `SITE_URL` | `https://googleadsagent.ai` | URL base de tu sitio |
| `GITHUB_REPO` | `itallstartedwithaidea/googleadsagent-site` | Repositorio de GitHub para los commits |
| `GITHUB_BRANCH` | `main` | Rama en la que hacer commit |

### Clusters de temas

Cada artículo se clasifica en uno de los 12 clusters de temas PPC:

| Cluster | Palabras clave |
|---------|----------------|
| Pujas | bid, tCPA, tROAS, smart bidding, CPC manual |
| Creatividad | RSA, titulares, texto de anuncio, extensiones, sitelinks |
| Audiencias | segmentación, remarketing, segmentos personalizados, concordancia amplia |
| Medición | seguimiento de conversiones, GA4, atribución, conversiones mejoradas |
| Automatización | scripts, reglas, API, AI Max, puntuación de optimización |
| Política | rechazado, suspendido, marca registrada, apelación |
| Shopping | shopping, merchant center, PMax, feed de productos |
| Vídeo | YouTube, demand gen, bumper, TrueView |
| Local | campañas locales, GMB, extensiones de ubicación |
| Presupuesto | CPC, CPA, ROAS, presupuesto diario, ritmo de gasto |
| Estructura de cuenta | grupos de anuncios, convenciones de nombres, SKAG, Hagakure |
| General | Comodín para preguntas de estrategia general |

---

## Cómo se generan los artículos

### Ingeniería de prompts

Cada artículo es generado por Claude con un prompt de sistema que:
- Establece la voz de John Williams, Especialista Senior en Paid Media ($350M+ gestionados)
- Proporciona el contexto del hilo de Reddit (título, subreddit, fragmento)
- Requiere de 1.500 a 3.000 palabras de contenido sustancial y accionable
- Exige cuadros destacados, tablas comparativas, tarjetas de estadísticas
- Requiere benchmarks específicos y rangos de datos de campañas reales
- Prohíbe citas fabricadas de Redditors
- Obliga a incluir una sección "Conclusión" con puntos de acción numerados

### Plantilla HTML

Cada artículo incluye:
- **3 bloques JSON-LD**: `BlogPosting` (con entidad de autor completa + sameAs), `BreadcrumbList`, `QAPage`
- **Meta tags completos**: og:*, twitter:*, canonical, robots
- **Tracking GTM**: GTM-NR7F6P92
- **Divulgación de IA**: Bloque visible acreditando la fuente de Reddit + asistencia IA
- **Señales E-E-A-T de autor**: Schema Person con nombre, jobTitle, enlaces sameAs
- **Diseño responsive**: Tema oscuro que coincide con googleadsagent.ai

### Verificaciones de validación (10+)

Antes de publicar, cada artículo se valida para:

1. Recuento de palabras dentro de los límites (800-5.000)
2. Snippet GTM presente
3. JSON-LD BlogPosting presente y JSON válido
4. JSON-LD BreadcrumbList presente
5. JSON-LD QAPage presente
6. URL fuente de Reddit en el cuerpo del artículo
7. Bloque de divulgación de IA presente
8. URL canónica sin sufijo `.html`
9. Etiquetas og:image y twitter:image presentes
10. Nombre del autor presente
11. Scripts compartidos (búsqueda del sitio, consentimiento de cookies, widget de chat)

---

## Notificaciones

### Correo electrónico
```
From: blog-engine@googleadsagent.ai
To: your@email.com
Subject: New post live: {title}
Body: {title}\n{live URL}
```

### SMS (vía pasarela de correo del operador — sin Twilio)
```
To: 5551234567@txt.att.net
Body: New post: {title} {url}
```

### Alertas de presupuesto
- **80% del presupuesto mensual**: Advertencia por correo + SMS
- **100% del presupuesto mensual**: Correo + SMS, el pipeline se pausa hasta el mes siguiente

### Alertas de error
- Fallos del pipeline: Solo correo (sin SMS para no despertarte)

---

## Protecciones

| Riesgo | Protección |
|--------|-----------|
| Artículos duplicados | Restricción única D1 en reddit_id + similitud coseno Vectorize (umbral 0,85) |
| 404 tras publicación | Verificación con 5 reintentos (GET sin caché, comprueba 200 + contenido > 1 KB) |
| Costes descontrolados | `MAX_POSTS_PER_RUN`, `MAX_DAILY_GENERATIONS`, `MAX_MONTHLY_USD` — todo falla de forma segura |
| Estado "generating" bloqueado | Reinicio automático de artículos atascados en "generating" durante más de 2 horas en la siguiente ejecución |
| Contenido tóxico | Lista de bloqueo + umbrales mínimos de calidad |
| TOS de Reddit | Descubrimiento de solo lectura vía SERP (sin llamadas a la API de Reddit), atribución en cada artículo |
| HTML inválido | 10+ verificaciones de validación antes de cualquier intento de publicación |
| Caídas de API | Backoff exponencial, reintentos limitados, registro limpio de errores |

---

## Ejemplos en producción

Estos artículos fueron generados por este motor y están en producción en [googleadsagent.ai](https://googleadsagent.ai):

1. [Should I Use Broad Match or Exact Match in Google Ads in 2026?](https://googleadsagent.ai/blog/reddit/broad-match-vs-exact-match-google-ads-2026)
2. [How Much Should I Spend on Google Ads? The Small Business Reality Check](https://googleadsagent.ai/blog/reddit/how-much-should-i-spend-on-google-ads-small-business)
3. [Performance Max vs Search Campaigns: When to Use Which](https://googleadsagent.ai/blog/reddit/performance-max-vs-search-campaigns-when-to-use-which)

---

## Legal y cumplimiento

- **Reddit**: Este motor utiliza SearchAPI (Google SERP) para el descubrimiento de hilos — NO llama directamente a la API de Reddit. Todos los artículos enlazan al hilo fuente y atribuyen el contenido a la discusión comunitaria. Ningún contenido de usuario de Reddit se copia textualmente.
- **Divulgación de IA**: Cada artículo contiene un bloque visible de divulgación de IA. Ningún contenido se presenta como escrito exclusivamente por humanos.
- **Derechos de autor**: Los artículos son análisis originales generados por IA inspirados en preguntas de la comunidad. No reproducen publicaciones ni comentarios de Reddit.
- **Privacidad**: No se almacenan nombres de usuario de Reddit, IPs ni datos personales. Solo se rastrean IDs de hilos y URLs.

---

## Autor

**John Williams** — Especialista Senior en Paid Media, $350M+ gestionados

- [googleadsagent.ai](https://googleadsagent.ai)
- [GitHub](https://github.com/itallstartedwithaidea)
- [LinkedIn](https://www.linkedin.com/in/johnmwilliams/)
- [Substack](https://itallstartedwithaidea.substack.com)
- [Twitter/X](https://twitter.com/_johnmwilliams)

---

## Licencia

Licencia MIT — consulta [LICENSE](LICENSE) para más detalles.
