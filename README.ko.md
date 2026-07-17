# Reddit-Sourced PPC Blog Engine

[English](README.md) | [Français](README.fr.md) | [Español](README.es.md) | [中文](README.zh.md) | [Nederlands](README.nl.md) | [Русский](README.ru.md) | [한국어](README.ko.md)

**Reddit에서 Google Ads 및 PPC 질문을 발견하고, Claude로 전문가 수준의 기사를 생성하며, Cloudflare Pages에 배포하는 자동화된 AI 블로그 파이프라인 — 하루 두 번, 완전 무인 운영.**

[![Live Blog](https://img.shields.io/badge/Live_Blog-googleadsagent.ai-f0a830?style=for-the-badge)](https://googleadsagent.ai/blog/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-7C3AED?style=for-the-badge)](https://anthropic.com)
[![Reddit](https://img.shields.io/badge/Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com/r/PPC)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 이 프로젝트가 하는 일

이 엔진은 Cloudflare Worker에서 실행되며, cron으로 하루 두 번 트리거됩니다. 각 실행 시:

1. **발견** — SearchAPI를 통해 Reddit의 트렌딩 PPC 질문 발견 (SERP 기반, Reddit API 불필요)
2. **필터링** — 최소 참여도, 차단 목록, NSFW 건너뛰기, 중복 감지로 품질 필터링
3. **중복 제거** — Vectorize 의미적 유사도를 사용하여 동일 주제의 중복 게시 방지
4. **생성** — Claude(Anthropic)를 사용한 1,500~3,000 단어의 전문가 기사 생성
5. **검증** — HTML 검증: JSON-LD 스키마, GTM, 메타 태그, AI 공개, Reddit 출처 표시
6. **게시** — GitHub API 커밋을 통해 Cloudflare Pages 배포 트리거
7. **확인** — 라이브 URL이 200을 반환하는지 확인 후 게시 완료 표시
8. **알림** — 이메일 + SMS 알림 (AT&T 게이트웨이, Twilio 불필요)
9. **핑** — IndexNow에 핑을 보내 몇 시간 내 인덱싱

생성된 모든 기사에는 완전한 SEO 구조화 데이터(`BlogPosting`, `QAPage`, `BreadcrumbList`), E-E-A-T 저자 시그널, AI 공개, Reddit 소스 토론 링크가 포함됩니다.

---

## 크레딧 및 커뮤니티 소스

이 프로젝트는 Reddit, LinkedIn, Quora 등의 훌륭한 PPC 실무자 커뮤니티 덕분에 존재합니다. 이 엔진이 생성하는 모든 기사는 소스 토론을 명시하고 원본 스레드로 링크합니다.

### Reddit 커뮤니티

| 서브레딧 | 주제 | 링크 |
|----------|------|------|
| **r/PPC** | 클릭당 지불 광고, Google Ads, Meta Ads | [reddit.com/r/PPC](https://www.reddit.com/r/PPC/) |
| **r/googleads** | Google Ads 전문 질문 및 전략 | [reddit.com/r/googleads](https://www.reddit.com/r/googleads/) |
| **r/digital_marketing** | 유료 미디어 포함 디지털 마케팅 전반 | [reddit.com/r/digital_marketing](https://www.reddit.com/r/digital_marketing/) |
| **r/adwords** | 레거시 Google AdWords 커뮤니티 (여전히 활성) | [reddit.com/r/adwords](https://www.reddit.com/r/adwords/) |
| **r/marketing** | 일반 마케팅 전략 및 업계 토론 | [reddit.com/r/marketing](https://www.reddit.com/r/marketing/) |
| **r/SEO** | 검색 엔진 최적화 (크로스 채널 맥락) | [reddit.com/r/SEO](https://www.reddit.com/r/SEO/) |
| **r/DigitalMarketing** | 디지털 전략, 분석, 유료 미디어 | [reddit.com/r/DigitalMarketing](https://www.reddit.com/r/DigitalMarketing/) |
| **r/FacebookAds** | Meta/Facebook 광고 | [reddit.com/r/FacebookAds](https://www.reddit.com/r/FacebookAds/) |
| **r/AmazonSeller** | Amazon PPC 및 마켓플레이스 광고 | [reddit.com/r/AmazonSeller](https://www.reddit.com/r/AmazonSeller/) |

### 이 프로젝트에 영감을 준 인기 r/PPC 스레드

- [광범위 일치와 정확 일치 중 어떤 것을 사용해야 할까?](https://www.reddit.com/r/PPC/) — 영원한 일치 유형 논쟁
- [소규모 비즈니스에서 Google Ads에 얼마를 써야 할까?](https://www.reddit.com/r/PPC/) — 예산 책정 질문
- [Performance Max vs 검색 캠페인](https://www.reddit.com/r/PPC/) — 캠페인 유형 선택
- [CPC가 계속 올라가는데 어떻게 해야 할까?](https://www.reddit.com/r/PPC/) — 비용 최적화
- [신규 비즈니스에 Google Ads가 가치가 있을까?](https://www.reddit.com/r/PPC/) — ROI 정당성
- [스마트 입찰이 효과가 없어요](https://www.reddit.com/r/PPC/) — 입찰 전략 문제 해결
- [Google Ads 계정을 어떻게 구조화해야 할까?](https://www.reddit.com/r/PPC/) — 계정 조직

### LinkedIn 커뮤니티 및 오피니언 리더

- [LinkedIn Google Ads Community](https://www.linkedin.com/groups/2517/) — 활발한 전문가 그룹
- [PPC Chat Community](https://www.linkedin.com/groups/4043498/) — 주간 Twitter/X 채팅 커뮤니티
- [Digital Marketing Professionals](https://www.linkedin.com/groups/62821/) — 디지털 마케팅 그룹
- [Paid Search Association](https://www.linkedin.com/company/paid-search-association/) — 업계 조직
- [Google Ads Help Community](https://support.google.com/google-ads/community) — Google 공식 포럼

### Quora 주제

- [Google Ads (Quora)](https://www.quora.com/topic/Google-Ads) — Google Ads 전략 Q&A
- [PPC Advertising (Quora)](https://www.quora.com/topic/Pay-Per-Click-Advertising) — 클릭당 지불 토론
- [Digital Marketing (Quora)](https://www.quora.com/topic/Digital-Marketing) — 마케팅 전반 Q&A
- [SEM (Quora)](https://www.quora.com/topic/Search-Engine-Marketing-SEM) — 검색 엔진 마케팅

### 참조된 오픈소스 도구

| 프로젝트 | 설명 | 링크 |
|----------|------|------|
| **Google Ads MCP** | Google Ads API용 29개 도구를 갖춘 Python MCP 서버 | [github.com/itallstartedwithaidea/google-ads-mcp](https://github.com/itallstartedwithaidea/google-ads-mcp) |
| **Google Ads Gemini Extension** | 22개 도구를 갖춘 Gemini CLI 확장 | [github.com/itallstartedwithaidea/google-ads-gemini-extension](https://github.com/itallstartedwithaidea/google-ads-gemini-extension) |
| **Google Ads Skills** | Google Ads용 Anthropic Claude Agent 스킬 | [github.com/itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) |
| **Google Ads API Agent** | 28개 액션을 갖춘 완전한 Python 에이전트 | [github.com/itallstartedwithaidea/google-ads-api-agent](https://github.com/itallstartedwithaidea/google-ads-api-agent) |
| **GoogleAdsAgent.ai** | 전체 웹사이트 및 도구 | [googleadsagent.ai](https://googleadsagent.ai) |

---

## 아키텍처

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

### 상태 머신

모든 게시물은 다음 상태를 거칩니다:

```
discovered → queued → generating → draft_ready → published
                │                       │
                ▼                       ▼
             skipped                  failed
         (filtered out)          (retryable error)
```

### 사용된 Cloudflare 서비스

| 서비스 | 용도 |
|--------|------|
| **Workers** | 블로그 엔진 런타임 (cron 트리거) |
| **D1** | 게시물 추적 데이터베이스 (SQLite) — 상태, 예산, 실행 로그 |
| **KV** | 동적 인덱스 페이지를 위한 블로그 매니페스트 |
| **R2** | 히어로 이미지 저장소 |
| **Workers AI** | 임베딩 (bge-base-en-v1.5) + 이미지 생성 (Stable Diffusion XL) |
| **Vectorize** | 의미적 중복 제거 인덱스 (blog-topics의 코사인 유사도) |
| **Pages** | 정적 사이트 호스팅 + Functions |

---

## 빠른 시작

### 사전 요구사항

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Workers 유료 플랜이 포함된 Cloudflare 계정
- [Anthropic API 키](https://console.anthropic.com/)
- [SearchAPI 키](https://www.searchapi.io/)
- [GitHub 개인 액세스 토큰](https://github.com/settings/tokens) (repo 범위)
- Buddy를 통한 Google OAuth (이메일/SMS 알림용 — Gmail API 사용, 추가 서비스 불필요)

### 1단계: 저장소 클론

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

### 2단계: Cloudflare 리소스 생성

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

### 3단계: wrangler.toml 구성

2단계의 값으로 `wrangler.toml`의 바인딩 ID를 업데이트합니다:

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "YOUR_D1_ID_HERE"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "YOUR_KV_ID_HERE"
```

### 4단계: 시크릿 설정

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

### 5단계: 데이터베이스 초기화

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

### 6단계: 배포

```bash
wrangler deploy
```

### 7단계: 드라이 런 테스트

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### 8단계: 실제 실행 트리거

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET"
```

---

## 프로젝트 구조

```
reddit/
├── src/
│   ├── index.ts          # Worker 진입점 — cron 핸들러, HTTP 라우트, 파이프라인 오케스트레이션
│   ├── types.ts           # 모든 데이터 타입의 TypeScript 인터페이스
│   ├── db.ts              # D1 데이터베이스 작업 — 게시물, 예산, 실행 로그
│   ├── ingest.ts          # SearchAPI SERP를 통한 Reddit 스레드 발견
│   ├── gates.ts           # 품질 필터, 차단 목록, Vectorize 의미적 중복 제거
│   ├── topics.ts          # 12개 PPC 클러스터로 주제 분류
│   ├── generate.ts        # Claude 기사 생성 + 관련 게시물 연결
│   ├── template.ts        # 전체 HTML 템플릿 (googleadsagent.ai 디자인 매칭)
│   ├── images.ts          # Workers AI 히어로 이미지 생성 (Stable Diffusion XL)
│   ├── validate.ts        # 생성 후 검증 (10개 이상의 검사)
│   ├── publish.ts         # GitHub API 커밋 + 배포 확인
│   ├── notify.ts          # 이메일 + SMS 알림 + IndexNow
│   └── budget.ts          # 비용 추적, 일일/월별 상한선
├── schema.sql             # D1 데이터베이스 스키마
├── wrangler.toml          # Cloudflare Worker 구성
├── package.json
├── tsconfig.json
└── README.md
```

---

## 구성

### 환경 변수 (wrangler.toml)

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `MAX_POSTS_PER_RUN` | `2` | cron 실행당 최대 게시물 수 |
| `MAX_DAILY_GENERATIONS` | `4` | 일일 최대 게시물 수 (2회 실행 x 2개 게시물) |
| `MAX_MONTHLY_USD` | `50` | 월간 예산 상한선 (Claude + SearchAPI 비용) |
| `SITE_URL` | `https://googleadsagent.ai` | 사이트 기본 URL |
| `GITHUB_REPO` | `itallstartedwithaidea/googleadsagent-site` | git 커밋용 GitHub 저장소 |
| `GITHUB_BRANCH` | `main` | 커밋할 브랜치 |

### 주제 클러스터

모든 기사는 12개 PPC 주제 클러스터 중 하나로 분류됩니다:

| 클러스터 | 키워드 |
|----------|--------|
| 입찰 | bid, tCPA, tROAS, smart bidding, 수동 CPC |
| 크리에이티브 | RSA, 헤드라인, 광고 카피, 확장, 사이트링크 |
| 오디언스 | 타겟팅, 리마케팅, 맞춤 세그먼트, 광범위 일치 |
| 측정 | 전환 추적, GA4, 기여, 향상된 전환 |
| 자동화 | 스크립트, 규칙, API, AI Max, 최적화 점수 |
| 정책 | 비승인, 일시중지, 상표, 이의 신청 |
| 쇼핑 | shopping, merchant center, PMax, 제품 피드 |
| 동영상 | YouTube, demand gen, bumper, TrueView |
| 로컬 | 로컬 캠페인, GMB, 위치 확장 |
| 예산 | CPC, CPA, ROAS, 일일 예산, 페이싱 |
| 계정 구조 | 광고 그룹, 명명 규칙, SKAG, Hagakure |
| 일반 | 일반 전략 질문을 위한 범용 카테고리 |

---

## 기사 생성 방식

### 프롬프트 엔지니어링

각 기사는 다음과 같은 시스템 프롬프트로 Claude가 생성합니다:
- John Williams의 목소리 설정 — 시니어 유료 미디어 전문가 (관리 규모 $350M+)
- Reddit 스레드 컨텍스트 제공 (제목, 서브레딧, 스니펫)
- 1,500~3,000 단어의 실질적이고 실행 가능한 콘텐츠 요구
- 콜아웃 박스, 비교 표, 통계 카드 의무화
- 구체적인 벤치마크와 실제 캠페인 데이터 범위 요구
- 조작된 Redditor 인용 금지
- 번호가 매겨진 액션 아이템이 포함된 "결론" 섹션 의무화

### HTML 템플릿

모든 기사에 포함되는 항목:
- **3개의 JSON-LD 블록**: `BlogPosting` (전체 저자 엔티티 + sameAs), `BreadcrumbList`, `QAPage`
- **전체 메타 태그**: og:*, twitter:*, canonical, robots
- **GTM 추적**: GTM-NR7F6P92
- **AI 공개**: Reddit 소스 + AI 지원을 표시하는 가시적 블록
- **저자 E-E-A-T 시그널**: Person 스키마 (이름, jobTitle, sameAs 링크)
- **반응형 디자인**: googleadsagent.ai와 일치하는 다크 테마

### 검증 체크 (10개 이상)

게시 전 모든 기사에 대해 다음을 검증합니다:

1. 단어 수가 범위 내 (800-5,000)
2. GTM 스니펫 존재
3. BlogPosting JSON-LD 존재 및 유효한 JSON
4. BreadcrumbList JSON-LD 존재
5. QAPage JSON-LD 존재
6. 기사 본문에 Reddit 소스 URL 포함
7. AI 공개 블록 존재
8. 캐노니컬 URL에 `.html` 접미사 없음
9. og:image 및 twitter:image 태그 존재
10. 저자 이름 존재
11. 공유 스크립트 (사이트 검색, 쿠키 동의, 채팅 위젯)

---

## 알림

### 이메일
```
From: blog-engine@googleadsagent.ai
To: your@email.com
Subject: New post live: {title}
Body: {title}\n{live URL}
```

### SMS (통신사 이메일 게이트웨이 사용 — Twilio 불필요)
```
To: 5551234567@txt.att.net
Body: New post: {title} {url}
```

### 예산 알림
- **월간 예산 80%**: 이메일 + SMS 경고
- **월간 예산 100%**: 이메일 + SMS, 파이프라인이 다음 달까지 일시 중지

### 오류 알림
- 파이프라인 실패: 이메일만 (잠을 깨우지 않기 위해 SMS 없음)

---

## 보호 장치

| 위험 | 보호 |
|------|------|
| 중복 게시물 | reddit_id에 대한 D1 고유 제약 + Vectorize 코사인 유사도 (임계값 0.85) |
| 게시 후 404 | 5회 재시도 확인 (캐시 우회 GET, 200 + 콘텐츠 > 1KB 확인) |
| 비용 폭주 | `MAX_POSTS_PER_RUN`, `MAX_DAILY_GENERATIONS`, `MAX_MONTHLY_USD` — 모두 안전하게 실패 |
| "generating" 상태 고착 | 다음 실행 시 2시간 이상 "generating" 상태인 게시물 자동 리셋 |
| 유해 콘텐츠 | 차단 목록 + 최소 품질 임계값 |
| Reddit 이용약관 | 읽기 전용 SERP 발견 (Reddit API 호출 없음), 모든 기사에 출처 표시 |
| 잘못된 HTML | 게시 시도 전 10개 이상의 검증 체크 |
| API 장애 | 지수 백오프, 제한된 재시도, 깔끔한 오류 로깅 |

---

## 라이브 예시

이 기사들은 이 엔진으로 생성되었으며 [googleadsagent.ai](https://googleadsagent.ai)에서 운영 중입니다:

1. [Should I Use Broad Match or Exact Match in Google Ads in 2026?](https://googleadsagent.ai/blog/reddit/broad-match-vs-exact-match-google-ads-2026)
2. [How Much Should I Spend on Google Ads? The Small Business Reality Check](https://googleadsagent.ai/blog/reddit/how-much-should-i-spend-on-google-ads-small-business)
3. [Performance Max vs Search Campaigns: When to Use Which](https://googleadsagent.ai/blog/reddit/performance-max-vs-search-campaigns-when-to-use-which)

---

## 법적 고지 및 규정 준수

- **Reddit**: 이 엔진은 스레드 발견을 위해 SearchAPI(Google SERP)를 사용합니다 — Reddit API를 직접 호출하지 않습니다. 모든 기사는 소스 스레드로 링크하고 커뮤니티 토론에 콘텐츠를 귀속합니다. Reddit 사용자 콘텐츠는 그대로 복사되지 않습니다.
- **AI 공개**: 모든 기사에 가시적인 AI 공개 블록이 포함됩니다. 어떤 콘텐츠도 인간만이 작성한 것으로 표시되지 않습니다.
- **저작권**: 기사는 커뮤니티 질문에서 영감을 받은 AI 생성 원본 분석입니다. Reddit 게시물이나 댓글을 재생산하지 않습니다.
- **개인정보**: Reddit 사용자 이름, IP 또는 개인 데이터는 저장되지 않습니다. 스레드 ID와 URL만 추적됩니다.

---

## 저자

**John Williams** — 시니어 유료 미디어 전문가, $350M+ 관리

- [googleadsagent.ai](https://googleadsagent.ai)
- [GitHub](https://github.com/itallstartedwithaidea)
- [LinkedIn](https://www.linkedin.com/in/johnmwilliams/)
- [Substack](https://itallstartedwithaidea.substack.com)
- [Twitter/X](https://twitter.com/_johnmwilliams)

---

## 라이선스

MIT 라이선스 — 자세한 내용은 [LICENSE](LICENSE)를 참조하세요.
