# Reddit-Sourced PPC Blog Engine

[English](README.md) | [Français](README.fr.md) | [Español](README.es.md) | [中文](README.zh.md) | [Nederlands](README.nl.md) | [Русский](README.ru.md) | [한국어](README.ko.md)

**Автоматизированный AI-конвейер для блога, который находит вопросы о Google Ads и PPC на Reddit, генерирует экспертные статьи с помощью Claude и развёртывает на Cloudflare Pages — дважды в день, полностью автономно.**

[![Live Blog](https://img.shields.io/badge/Live_Blog-googleadsagent.ai-f0a830?style=for-the-badge)](https://googleadsagent.ai/blog/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-7C3AED?style=for-the-badge)](https://anthropic.com)
[![Reddit](https://img.shields.io/badge/Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com/r/PPC)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## Что делает этот проект

Движок работает на Cloudflare Worker и запускается по cron дважды в день. Каждый запуск:

1. **Обнаруживает** трендовые PPC-вопросы на Reddit через SearchAPI (на основе SERP, Reddit API не требуется)
2. **Фильтрует** по качеству — минимальная вовлечённость, чёрный список, пропуск NSFW, обнаружение дубликатов
3. **Дедуплицирует** с помощью семантического сходства Vectorize, чтобы избежать повторной публикации одной и той же темы
4. **Генерирует** полноценную экспертную статью на 1 500–3 000 слов с помощью Claude (Anthropic)
5. **Валидирует** HTML — JSON-LD-схемы, GTM, мета-теги, раскрытие ИИ, атрибуция Reddit
6. **Публикует** через коммит в GitHub API, запуская деплой на Cloudflare Pages
7. **Проверяет**, что рабочий URL возвращает статус 200, прежде чем пометить как опубликованное
8. **Уведомляет** по e-mail + SMS (шлюз AT&T, Twilio не нужен)
9. **Отправляет пинг** в IndexNow для индексации статьи в течение нескольких часов

Каждая сгенерированная статья включает полные структурированные SEO-данные (`BlogPosting`, `QAPage`, `BreadcrumbList`), сигналы E-E-A-T автора, раскрытие ИИ и ссылку на исходное обсуждение на Reddit.

---

## Благодарности и источники из сообщества

Этот проект существует благодаря невероятным сообществам PPC-специалистов на Reddit, LinkedIn, Quora и других платформах. Каждая статья, сгенерированная этим движком, указывает источник обсуждения и ссылается на оригинальный тред.

### Сообщества Reddit

| Сабреддит | Тематика | Ссылка |
|-----------|----------|--------|
| **r/PPC** | Контекстная реклама, Google Ads, Meta Ads | [reddit.com/r/PPC](https://www.reddit.com/r/PPC/) |
| **r/googleads** | Вопросы и стратегии по Google Ads | [reddit.com/r/googleads](https://www.reddit.com/r/googleads/) |
| **r/digital_marketing** | Цифровой маркетинг в широком смысле, включая платные медиа | [reddit.com/r/digital_marketing](https://www.reddit.com/r/digital_marketing/) |
| **r/adwords** | Историческое сообщество Google AdWords (по-прежнему активно) | [reddit.com/r/adwords](https://www.reddit.com/r/adwords/) |
| **r/marketing** | Общая маркетинговая стратегия и отраслевые обсуждения | [reddit.com/r/marketing](https://www.reddit.com/r/marketing/) |
| **r/SEO** | Поисковая оптимизация (кросс-канальный контекст) | [reddit.com/r/SEO](https://www.reddit.com/r/SEO/) |
| **r/DigitalMarketing** | Цифровая стратегия, аналитика, платные медиа | [reddit.com/r/DigitalMarketing](https://www.reddit.com/r/DigitalMarketing/) |
| **r/FacebookAds** | Реклама Meta/Facebook | [reddit.com/r/FacebookAds](https://www.reddit.com/r/FacebookAds/) |
| **r/AmazonSeller** | Amazon PPC и реклама на маркетплейсах | [reddit.com/r/AmazonSeller](https://www.reddit.com/r/AmazonSeller/) |

### Популярные треды r/PPC, вдохновившие этот проект

- [Использовать широкое или точное соответствие?](https://www.reddit.com/r/PPC/) — Вечный спор о типах соответствия
- [Сколько тратить на Google Ads для малого бизнеса?](https://www.reddit.com/r/PPC/) — Вопросы определения бюджета
- [Performance Max vs поисковые кампании](https://www.reddit.com/r/PPC/) — Выбор типа кампании
- [Мой CPC постоянно растёт, что делать?](https://www.reddit.com/r/PPC/) — Оптимизация затрат
- [Стоит ли Google Ads для нового бизнеса?](https://www.reddit.com/r/PPC/) — Обоснование ROI
- [Smart Bidding у меня не работает](https://www.reddit.com/r/PPC/) — Решение проблем со стратегиями ставок
- [Как структурировать аккаунт Google Ads?](https://www.reddit.com/r/PPC/) — Организация аккаунта

### Сообщества LinkedIn и лидеры мнений

- [Google Ads Community в LinkedIn](https://www.linkedin.com/groups/2517/) — Активная профессиональная группа
- [PPC Chat Community](https://www.linkedin.com/groups/4043498/) — Еженедельный чат в Twitter/X
- [Digital Marketing Professionals](https://www.linkedin.com/groups/62821/) — Широкая группа цифрового маркетинга
- [Paid Search Association](https://www.linkedin.com/company/paid-search-association/) — Отраслевая организация
- [Google Ads Help Community](https://support.google.com/google-ads/community) — Официальный форум Google

### Темы на Quora

- [Google Ads (Quora)](https://www.quora.com/topic/Google-Ads) — Вопросы и ответы по стратегиям Google Ads
- [PPC Advertising (Quora)](https://www.quora.com/topic/Pay-Per-Click-Advertising) — Обсуждения контекстной рекламы
- [Digital Marketing (Quora)](https://www.quora.com/topic/Digital-Marketing) — Общие вопросы маркетинга
- [SEM (Quora)](https://www.quora.com/topic/Search-Engine-Marketing-SEM) — Маркетинг в поисковых системах

### Упомянутые open-source инструменты

| Проект | Описание | Ссылка |
|--------|----------|--------|
| **Google Ads MCP** | Python MCP-сервер с 29 инструментами для Google Ads API | [github.com/itallstartedwithaidea/google-ads-mcp](https://github.com/itallstartedwithaidea/google-ads-mcp) |
| **Google Ads Gemini Extension** | Расширение Gemini CLI с 22 инструментами | [github.com/itallstartedwithaidea/google-ads-gemini-extension](https://github.com/itallstartedwithaidea/google-ads-gemini-extension) |
| **Google Ads Skills** | Навыки Anthropic Claude Agent для Google Ads | [github.com/itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) |
| **Google Ads API Agent** | Полноценный Python-агент с 28 действиями | [github.com/itallstartedwithaidea/google-ads-api-agent](https://github.com/itallstartedwithaidea/google-ads-api-agent) |
| **GoogleAdsAgent.ai** | Полный сайт и инструменты | [googleadsagent.ai](https://googleadsagent.ai) |

---

## Архитектура

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

### Конечный автомат

Каждая статья проходит через следующие статусы:

```
discovered → queued → generating → draft_ready → published
                │                       │
                ▼                       ▼
             skipped                  failed
         (filtered out)          (retryable error)
```

### Используемые сервисы Cloudflare

| Сервис | Назначение |
|--------|-----------|
| **Workers** | Среда выполнения движка блога (запуск по cron) |
| **D1** | База данных отслеживания статей (SQLite) — статусы, бюджеты, логи запусков |
| **KV** | Манифест блога для динамической индексной страницы |
| **R2** | Хранилище главных изображений |
| **Workers AI** | Эмбеддинги (bge-base-en-v1.5) + генерация изображений (Stable Diffusion XL) |
| **Vectorize** | Индекс семантической дедупликации (косинусное сходство на blog-topics) |
| **Pages** | Хостинг статического сайта + Functions |

---

## Быстрый старт

### Предварительные требования

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Аккаунт Cloudflare с платным планом Workers
- [Ключ API Anthropic](https://console.anthropic.com/)
- [Ключ SearchAPI](https://www.searchapi.io/)
- [Персональный токен доступа GitHub](https://github.com/settings/tokens) (scope repo)
- Google OAuth через Buddy (для уведомлений по e-mail/SMS — используется Gmail API, дополнительные сервисы не нужны)

### Шаг 1: Клонируйте репозиторий

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

### Шаг 2: Создайте ресурсы Cloudflare

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

### Шаг 3: Настройте wrangler.toml

Обновите ID привязок в `wrangler.toml` значениями из Шага 2:

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "YOUR_D1_ID_HERE"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "YOUR_KV_ID_HERE"
```

### Шаг 4: Задайте секреты

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

### Шаг 5: Инициализируйте базу данных

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

### Шаг 6: Деплой

```bash
wrangler deploy
```

### Шаг 7: Тестовый запуск

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### Шаг 8: Запустите боевой прогон

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET"
```

---

## Структура проекта

```
reddit/
├── src/
│   ├── index.ts          # Точка входа Worker — обработчик cron, HTTP-маршруты, оркестрация конвейера
│   ├── types.ts           # TypeScript-интерфейсы для всех типов данных
│   ├── db.ts              # Операции с базой данных D1 — статьи, бюджет, логи запусков
│   ├── ingest.ts          # Обнаружение тредов Reddit через SearchAPI SERP
│   ├── gates.ts           # Фильтры качества, чёрный список, семантическая дедупликация Vectorize
│   ├── topics.ts          # Классификация тем по 12 PPC-кластерам
│   ├── generate.ts        # Генерация статей Claude + связывание похожих статей
│   ├── template.ts        # Полный HTML-шаблон (дизайн googleadsagent.ai)
│   ├── images.ts          # Генерация главных изображений Workers AI (Stable Diffusion XL)
│   ├── validate.ts        # Валидация после генерации (10+ проверок)
│   ├── publish.ts         # Коммит через GitHub API + проверка деплоя
│   ├── notify.ts          # Уведомления по e-mail + SMS + IndexNow
│   └── budget.ts          # Отслеживание затрат, дневные/месячные лимиты
├── schema.sql             # Схема базы данных D1
├── wrangler.toml          # Конфигурация Cloudflare Worker
├── package.json
├── tsconfig.json
└── README.md
```

---

## Конфигурация

### Переменные окружения (wrangler.toml)

| Переменная | По умолчанию | Описание |
|------------|-------------|----------|
| `MAX_POSTS_PER_RUN` | `2` | Максимум статей за один запуск cron |
| `MAX_DAILY_GENERATIONS` | `4` | Максимум статей в день (2 запуска x 2 статьи) |
| `MAX_MONTHLY_USD` | `50` | Месячный бюджетный лимит (затраты на Claude + SearchAPI) |
| `SITE_URL` | `https://googleadsagent.ai` | Базовый URL вашего сайта |
| `GITHUB_REPO` | `itallstartedwithaidea/googleadsagent-site` | GitHub-репозиторий для коммитов |
| `GITHUB_BRANCH` | `main` | Ветка для коммитов |

### Тематические кластеры

Каждая статья классифицируется в один из 12 PPC-кластеров:

| Кластер | Ключевые слова |
|---------|----------------|
| Ставки | bid, tCPA, tROAS, smart bidding, ручной CPC |
| Креатив | RSA, заголовки, текст объявления, расширения, сайтлинки |
| Аудитории | таргетинг, ремаркетинг, пользовательские сегменты, широкое соответствие |
| Измерение | отслеживание конверсий, GA4, атрибуция, расширенные конверсии |
| Автоматизация | скрипты, правила, API, AI Max, показатель оптимизации |
| Политика | отклонено, приостановлено, товарный знак, апелляция |
| Шопинг | shopping, merchant center, PMax, товарный фид |
| Видео | YouTube, demand gen, bumper, TrueView |
| Локальное | локальные кампании, GMB, расширения местоположения |
| Бюджет | CPC, CPA, ROAS, дневной бюджет, темп расходов |
| Структура аккаунта | группы объявлений, соглашения об именах, SKAG, Hagakure |
| Общее | Универсальная категория для стратегических вопросов |

---

## Как генерируются статьи

### Промпт-инжиниринг

Каждая статья генерируется Claude с системным промптом, который:
- Задаёт голос John Williams, старшего специалиста по платным медиа ($350M+ под управлением)
- Предоставляет контекст Reddit-треда (заголовок, сабреддит, фрагмент)
- Требует 1 500–3 000 слов содержательного, практического контента
- Обязывает включать выноски, сравнительные таблицы, карточки со статистикой
- Требует конкретные бенчмарки и диапазоны данных реальных кампаний
- Запрещает выдуманные цитаты реддиторов
- Обязывает раздел «Итог» с нумерованными пунктами действий

### HTML-шаблон

Каждая статья включает:
- **3 блока JSON-LD**: `BlogPosting` (с полной сущностью автора + sameAs), `BreadcrumbList`, `QAPage`
- **Полный набор мета-тегов**: og:*, twitter:*, canonical, robots
- **Отслеживание GTM**: GTM-NR7F6P92
- **Раскрытие ИИ**: Видимый блок с указанием источника Reddit + помощи ИИ
- **Сигналы E-E-A-T автора**: Схема Person с именем, jobTitle, ссылками sameAs
- **Адаптивный дизайн**: Тёмная тема в стиле googleadsagent.ai

### Проверки валидации (10+)

Перед публикацией каждая статья проверяется на:

1. Количество слов в пределах (800–5 000)
2. Наличие сниппета GTM
3. Наличие BlogPosting JSON-LD и валидность JSON
4. Наличие BreadcrumbList JSON-LD
5. Наличие QAPage JSON-LD
6. URL источника Reddit в теле статьи
7. Наличие блока раскрытия ИИ
8. Канонический URL без суффикса `.html`
9. Наличие тегов og:image и twitter:image
10. Наличие имени автора
11. Общие скрипты (поиск по сайту, согласие на cookie, виджет чата)

---

## Уведомления

### E-mail
```
From: blog-engine@googleadsagent.ai
To: your@email.com
Subject: New post live: {title}
Body: {title}\n{live URL}
```

### SMS (через e-mail-шлюз оператора — без Twilio)
```
To: 5551234567@txt.att.net
Body: New post: {title} {url}
```

### Бюджетные оповещения
- **80% месячного бюджета**: Предупреждение по e-mail + SMS
- **100% месячного бюджета**: E-mail + SMS, конвейер приостанавливается до следующего месяца

### Оповещения об ошибках
- Сбои конвейера: Только e-mail (без SMS, чтобы не будить вас)

---

## Защитные механизмы

| Риск | Защита |
|------|--------|
| Дублирование статей | Уникальное ограничение D1 на reddit_id + косинусное сходство Vectorize (порог 0,85) |
| 404 после публикации | Проверка с 5 попытками (GET с обходом кэша, проверяет 200 + контент > 1 КБ) |
| Неконтролируемые расходы | `MAX_POSTS_PER_RUN`, `MAX_DAILY_GENERATIONS`, `MAX_MONTHLY_USD` — всё завершается безопасно |
| Зависший статус «generating» | Автосброс статей, зависших в «generating» более 2 часов, при следующем запуске |
| Токсичный контент | Чёрный список + минимальные пороги качества |
| Условия Reddit | Только чтение через SERP (без вызовов Reddit API), атрибуция в каждой статье |
| Невалидный HTML | 10+ проверок валидации перед любой попыткой публикации |
| Сбои API | Экспоненциальный backoff, ограниченные повторы, чистое логирование ошибок |

---

## Живые примеры

Эти статьи были сгенерированы этим движком и доступны на [googleadsagent.ai](https://googleadsagent.ai):

1. [Should I Use Broad Match or Exact Match in Google Ads in 2026?](https://googleadsagent.ai/blog/reddit/broad-match-vs-exact-match-google-ads-2026)
2. [How Much Should I Spend on Google Ads? The Small Business Reality Check](https://googleadsagent.ai/blog/reddit/how-much-should-i-spend-on-google-ads-small-business)
3. [Performance Max vs Search Campaigns: When to Use Which](https://googleadsagent.ai/blog/reddit/performance-max-vs-search-campaigns-when-to-use-which)

---

## Юридическая информация и соответствие

- **Reddit**: Этот движок использует SearchAPI (Google SERP) для обнаружения тредов — он НЕ вызывает Reddit API напрямую. Все статьи ссылаются на исходный тред и атрибутируют контент обсуждению в сообществе. Контент пользователей Reddit не копируется дословно.
- **Раскрытие ИИ**: Каждая статья содержит видимый блок раскрытия ИИ. Никакой контент не подаётся как написанный исключительно человеком.
- **Авторские права**: Статьи — это оригинальный ИИ-анализ, вдохновлённый вопросами сообщества. Они не воспроизводят публикации или комментарии Reddit.
- **Конфиденциальность**: Никакие имена пользователей Reddit, IP-адреса или персональные данные не хранятся. Отслеживаются только ID тредов и URL.

---

## Автор

**John Williams** — Старший специалист по платным медиа, $350M+ под управлением

- [googleadsagent.ai](https://googleadsagent.ai)
- [GitHub](https://github.com/itallstartedwithaidea)
- [LinkedIn](https://www.linkedin.com/in/johnmwilliams/)
- [Substack](https://itallstartedwithaidea.substack.com)
- [Twitter/X](https://twitter.com/_johnmwilliams)

---

## Лицензия

Лицензия MIT — подробности в [LICENSE](LICENSE).
