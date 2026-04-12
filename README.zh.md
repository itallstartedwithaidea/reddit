# Reddit-Sourced PPC Blog Engine

[English](README.md) | [Français](README.fr.md) | [Español](README.es.md) | [中文](README.zh.md) | [Nederlands](README.nl.md) | [Русский](README.ru.md) | [한국어](README.ko.md)

**自动化 AI 博客流水线：从 Reddit 发现 Google Ads 和 PPC 问题，使用 Claude 生成专家级文章，部署到 Cloudflare Pages — 每天两次，完全无人值守。**

[![Live Blog](https://img.shields.io/badge/Live_Blog-googleadsagent.ai-f0a830?style=for-the-badge)](https://googleadsagent.ai/blog/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-7C3AED?style=for-the-badge)](https://anthropic.com)
[![Reddit](https://img.shields.io/badge/Source-Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com/r/PPC)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 功能介绍

本引擎运行在 Cloudflare Worker 上，由 cron 每天触发两次。每次运行：

1. **发现** Reddit 上的热门 PPC 问题（通过 SearchAPI，基于 SERP，无需 Reddit API）
2. **过滤** 质量 — 最低互动量、黑名单、NSFW 跳过、重复检测
3. **去重** 使用 Vectorize 语义相似度，避免发布相同主题
4. **生成** 一篇完整的 1,500-3,000 字专家文章（使用 Claude / Anthropic）
5. **验证** HTML — JSON-LD 架构、GTM、meta 标签、AI 披露、Reddit 归属
6. **发布** 通过 GitHub API 提交，触发 Cloudflare Pages 部署
7. **验证** 线上 URL 返回 200 状态码后才标记为已发布
8. **通知** 通过电子邮件 + 短信（AT&T 网关，无需 Twilio）
9. **Ping** IndexNow 以在数小时内完成索引

每篇生成的文章都包含完整的 SEO 结构化数据（`BlogPosting`、`QAPage`、`BreadcrumbList`）、E-E-A-T 作者信号、AI 披露声明，以及指向 Reddit 源讨论的链接。

---

## 致谢与社区来源

本项目的存在要归功于 Reddit、LinkedIn、Quora 等平台上出色的 PPC 从业者社区。本引擎生成的每篇文章都会标注其讨论来源并链接到原始帖子。

### Reddit 社区

| 子版块 | 主题 | 链接 |
|--------|------|------|
| **r/PPC** | 按点击付费广告、Google Ads、Meta Ads | [reddit.com/r/PPC](https://www.reddit.com/r/PPC/) |
| **r/googleads** | Google Ads 专题问题与策略 | [reddit.com/r/googleads](https://www.reddit.com/r/googleads/) |
| **r/digital_marketing** | 广义数字营销，包括付费媒体 | [reddit.com/r/digital_marketing](https://www.reddit.com/r/digital_marketing/) |
| **r/adwords** | Google AdWords 历史社区（仍然活跃） | [reddit.com/r/adwords](https://www.reddit.com/r/adwords/) |
| **r/marketing** | 一般营销策略与行业讨论 | [reddit.com/r/marketing](https://www.reddit.com/r/marketing/) |
| **r/SEO** | 搜索引擎优化（跨渠道背景） | [reddit.com/r/SEO](https://www.reddit.com/r/SEO/) |
| **r/DigitalMarketing** | 数字策略、分析、付费媒体 | [reddit.com/r/DigitalMarketing](https://www.reddit.com/r/DigitalMarketing/) |
| **r/FacebookAds** | Meta/Facebook 广告 | [reddit.com/r/FacebookAds](https://www.reddit.com/r/FacebookAds/) |
| **r/AmazonSeller** | Amazon PPC 与市场广告 | [reddit.com/r/AmazonSeller](https://www.reddit.com/r/AmazonSeller/) |

### 启发本项目的热门 r/PPC 帖子

- [该使用广泛匹配还是精确匹配？](https://www.reddit.com/r/PPC/) — 永恒的匹配类型之争
- [小企业在 Google Ads 上应该花多少钱？](https://www.reddit.com/r/PPC/) — 预算规划问题
- [Performance Max vs 搜索广告系列](https://www.reddit.com/r/PPC/) — 广告系列类型选择
- [我的 CPC 一直在涨，该怎么办？](https://www.reddit.com/r/PPC/) — 成本优化
- [Google Ads 对新企业值得吗？](https://www.reddit.com/r/PPC/) — ROI 论证
- [智能出价对我不起作用](https://www.reddit.com/r/PPC/) — 出价策略排错
- [如何构建 Google Ads 账户结构？](https://www.reddit.com/r/PPC/) — 账户组织

### LinkedIn 社区与意见领袖

- [LinkedIn Google Ads 社区](https://www.linkedin.com/groups/2517/) — 活跃的专业人士群组
- [PPC Chat Community](https://www.linkedin.com/groups/4043498/) — 每周 Twitter/X 聊天社区
- [Digital Marketing Professionals](https://www.linkedin.com/groups/62821/) — 广义数字营销群组
- [Paid Search Association](https://www.linkedin.com/company/paid-search-association/) — 行业组织
- [Google Ads Help Community](https://support.google.com/google-ads/community) — Google 官方论坛

### Quora 话题

- [Google Ads (Quora)](https://www.quora.com/topic/Google-Ads) — Google Ads 策略问答
- [PPC Advertising (Quora)](https://www.quora.com/topic/Pay-Per-Click-Advertising) — 按点击付费讨论
- [Digital Marketing (Quora)](https://www.quora.com/topic/Digital-Marketing) — 广义营销问答
- [SEM (Quora)](https://www.quora.com/topic/Search-Engine-Marketing-SEM) — 搜索引擎营销

### 引用的开源工具

| 项目 | 描述 | 链接 |
|------|------|------|
| **Google Ads MCP** | Python MCP 服务器，包含 29 个 Google Ads API 工具 | [github.com/itallstartedwithaidea/google-ads-mcp](https://github.com/itallstartedwithaidea/google-ads-mcp) |
| **Google Ads Gemini Extension** | Gemini CLI 扩展，包含 22 个工具 | [github.com/itallstartedwithaidea/google-ads-gemini-extension](https://github.com/itallstartedwithaidea/google-ads-gemini-extension) |
| **Google Ads Skills** | Anthropic Claude Agent 的 Google Ads 技能 | [github.com/itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) |
| **Google Ads API Agent** | 完整的 Python 代理，包含 28 个操作 | [github.com/itallstartedwithaidea/google-ads-api-agent](https://github.com/itallstartedwithaidea/google-ads-api-agent) |
| **GoogleAdsAgent.ai** | 完整网站及工具 | [github.com/itallstartedwithaidea/googleadsagent-site](https://github.com/itallstartedwithaidea/googleadsagent-site) |

---

## 架构

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

### 状态机

每篇文章经过以下状态流转：

```
discovered → queued → generating → draft_ready → published
                │                       │
                ▼                       ▼
             skipped                  failed
         (filtered out)          (retryable error)
```

### 使用的 Cloudflare 服务

| 服务 | 用途 |
|------|------|
| **Workers** | 博客引擎运行环境（cron 触发） |
| **D1** | 文章跟踪数据库（SQLite）— 状态、预算、运行日志 |
| **KV** | 博客清单，用于动态索引页 |
| **R2** | 主图存储 |
| **Workers AI** | 嵌入向量（bge-base-en-v1.5）+ 图片生成（Stable Diffusion XL） |
| **Vectorize** | 语义去重索引（blog-topics 上的余弦相似度） |
| **Pages** | 静态网站托管 + Functions |

---

## 快速开始

### 前提条件

- [Node.js](https://nodejs.org/) 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- 带有付费 Workers 方案的 Cloudflare 账户
- [Anthropic API 密钥](https://console.anthropic.com/)
- [SearchAPI 密钥](https://www.searchapi.io/)
- [GitHub 个人访问令牌](https://github.com/settings/tokens)（repo 范围）
- 通过 Buddy 的 Google OAuth（用于邮件/短信通知 — 使用 Gmail API，无需额外服务）

### 步骤 1：克隆仓库

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

### 步骤 2：创建 Cloudflare 资源

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

### 步骤 3：配置 wrangler.toml

用步骤 2 中的值更新 `wrangler.toml` 中的绑定 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "YOUR_D1_ID_HERE"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "YOUR_KV_ID_HERE"
```

### 步骤 4：设置密钥

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

### 步骤 5：初始化数据库

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

### 步骤 6：部署

```bash
wrangler deploy
```

### 步骤 7：试运行测试

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### 步骤 8：触发正式运行

```bash
curl -X POST "https://your-worker.workers.dev/run?key=YOUR_CRON_SECRET"
```

---

## 项目结构

```
reddit/
├── src/
│   ├── index.ts          # Worker 入口 — cron 处理器、HTTP 路由、流水线编排
│   ├── types.ts           # 所有数据类型的 TypeScript 接口
│   ├── db.ts              # D1 数据库操作 — 文章、预算、运行日志
│   ├── ingest.ts          # 通过 SearchAPI SERP 发现 Reddit 帖子
│   ├── gates.ts           # 质量过滤器、黑名单、Vectorize 语义去重
│   ├── topics.ts          # 将主题分类到 12 个 PPC 聚类
│   ├── generate.ts        # Claude 文章生成 + 相关文章链接
│   ├── template.ts        # 完整 HTML 模板（匹配 googleadsagent.ai 设计）
│   ├── images.ts          # Workers AI 主图生成（Stable Diffusion XL）
│   ├── validate.ts        # 生成后验证（10+ 项检查）
│   ├── publish.ts         # GitHub API 提交 + 部署验证
│   ├── notify.ts          # 邮件 + 短信通知 + IndexNow
│   └── budget.ts          # 成本跟踪、每日/每月上限
├── schema.sql             # D1 数据库架构
├── wrangler.toml          # Cloudflare Worker 配置
├── package.json
├── tsconfig.json
└── README.md
```

---

## 配置

### 环境变量（wrangler.toml）

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `MAX_POSTS_PER_RUN` | `2` | 每次 cron 运行发布的最大文章数 |
| `MAX_DAILY_GENERATIONS` | `4` | 每天最大文章数（2 次运行 x 2 篇文章） |
| `MAX_MONTHLY_USD` | `50` | 月度预算上限（Claude + SearchAPI 费用） |
| `SITE_URL` | `https://googleadsagent.ai` | 您网站的基础 URL |
| `GITHUB_REPO` | `itallstartedwithaidea/googleadsagent-site` | 用于 git 提交的 GitHub 仓库 |
| `GITHUB_BRANCH` | `main` | 提交的分支 |

### 主题聚类

每篇文章被分类到 12 个 PPC 主题聚类之一：

| 聚类 | 关键词 |
|------|--------|
| 出价 | bid、tCPA、tROAS、smart bidding、手动 CPC |
| 创意 | RSA、标题、广告文案、附加信息、站点链接 |
| 受众 | 定向、再营销、自定义细分、广泛匹配 |
| 衡量 | 转化跟踪、GA4、归因、增强型转化 |
| 自动化 | 脚本、规则、API、AI Max、优化得分 |
| 政策 | 被拒登、被暂停、商标、申诉 |
| 购物 | shopping、merchant center、PMax、产品 Feed |
| 视频 | YouTube、demand gen、bumper、TrueView |
| 本地 | 本地广告系列、GMB、地理位置附加信息 |
| 预算 | CPC、CPA、ROAS、每日预算、预算节奏 |
| 账户结构 | 广告组、命名规范、SKAG、Hagakure |
| 综合 | 通用策略问题 |

---

## 文章生成方式

### 提示工程

每篇文章由 Claude 使用系统提示生成，该提示：
- 设定 John Williams 的声音，资深付费媒体专家（管理超过 3.5 亿美元）
- 提供 Reddit 帖子上下文（标题、子版块、摘要）
- 要求 1,500-3,000 字的实质性、可操作内容
- 强制要求高亮框、对比表、统计卡片
- 要求具体基准和真实广告系列数据范围
- 禁止伪造 Redditor 引言
- 强制要求"总结"部分，附带编号的行动项

### HTML 模板

每篇文章包含：
- **3 个 JSON-LD 块**：`BlogPosting`（含完整作者实体 + sameAs）、`BreadcrumbList`、`QAPage`
- **完整 meta 标签**：og:*、twitter:*、canonical、robots
- **GTM 跟踪**：GTM-NR7F6P92
- **AI 披露**：可见区块，标注 Reddit 来源 + AI 辅助
- **作者 E-E-A-T 信号**：Person schema，含姓名、jobTitle、sameAs 链接
- **响应式设计**：与 googleadsagent.ai 匹配的深色主题

### 验证检查（10+）

发布前，每篇文章都会验证：

1. 字数在范围内（800-5,000）
2. GTM 代码存在
3. BlogPosting JSON-LD 存在且 JSON 有效
4. BreadcrumbList JSON-LD 存在
5. QAPage JSON-LD 存在
6. 文章正文中有 Reddit 源 URL
7. AI 披露区块存在
8. 规范 URL 无 `.html` 后缀
9. og:image 和 twitter:image 标签存在
10. 作者姓名存在
11. 共享脚本（站内搜索、Cookie 同意、聊天小部件）

---

## 通知

### 电子邮件
```
From: blog-engine@googleadsagent.ai
To: your@email.com
Subject: New post live: {title}
Body: {title}\n{live URL}
```

### 短信（通过运营商邮件网关 — 无需 Twilio）
```
To: 5551234567@txt.att.net
Body: New post: {title} {url}
```

### 预算警报
- **月度预算 80%**：邮件 + 短信警告
- **月度预算 100%**：邮件 + 短信，流水线暂停至下月

### 错误警报
- 流水线故障：仅邮件（不发短信，避免打扰休息）

---

## 安全保障

| 风险 | 防护措施 |
|------|----------|
| 重复文章 | D1 唯一约束（reddit_id）+ Vectorize 余弦相似度（阈值 0.85） |
| 发布后 404 | 5 次重试验证（GET 绕过缓存，检查 200 + 内容 > 1KB） |
| 成本失控 | `MAX_POSTS_PER_RUN`、`MAX_DAILY_GENERATIONS`、`MAX_MONTHLY_USD` — 全部安全失败 |
| "generating" 状态卡住 | 下次运行时自动重置卡在"generating"超过 2 小时的文章 |
| 有害内容 | 黑名单 + 最低质量阈值 |
| Reddit 服务条款 | 只读 SERP 发现（不调用 Reddit API），每篇文章都有归属说明 |
| 无效 HTML | 发布前 10+ 项验证检查 |
| API 故障 | 指数退避、有限重试、干净的错误日志 |

---

## 线上示例

以下文章由本引擎生成，已在 [googleadsagent.ai](https://googleadsagent.ai) 上线：

1. [Should I Use Broad Match or Exact Match in Google Ads in 2026?](https://googleadsagent.ai/blog/reddit/broad-match-vs-exact-match-google-ads-2026)
2. [How Much Should I Spend on Google Ads? The Small Business Reality Check](https://googleadsagent.ai/blog/reddit/how-much-should-i-spend-on-google-ads-small-business)
3. [Performance Max vs Search Campaigns: When to Use Which](https://googleadsagent.ai/blog/reddit/performance-max-vs-search-campaigns-when-to-use-which)

---

## 法律与合规

- **Reddit**：本引擎使用 SearchAPI（Google SERP）进行帖子发现 — 不直接调用 Reddit API。所有文章都链接到源帖子并将内容归属于社区讨论。不会逐字复制任何 Reddit 用户内容。
- **AI 披露**：每篇文章包含可见的 AI 披露区块。没有内容被呈现为纯人工撰写。
- **版权**：文章是由 AI 生成的原创分析，灵感来源于社区问题。不会复制 Reddit 帖子或评论。
- **隐私**：不存储任何 Reddit 用户名、IP 或个人数据。仅跟踪帖子 ID 和 URL。

---

## 作者

**John Williams** — 资深付费媒体专家，管理超过 3.5 亿美元

- [googleadsagent.ai](https://googleadsagent.ai)
- [GitHub](https://github.com/itallstartedwithaidea)
- [LinkedIn](https://www.linkedin.com/in/johnmwilliams/)
- [Substack](https://itallstartedwithaidea.substack.com)
- [Twitter/X](https://twitter.com/_johnmwilliams)

---

## 许可证

MIT 许可证 — 详见 [LICENSE](LICENSE)。
