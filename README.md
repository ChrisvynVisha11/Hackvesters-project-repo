# Grind and Crumb: café chain ops dashboard and £1.5m investment planner

**Live web app:** [WEB_APP_URL](WEB_APP_URL)
**Executive report (2 pages):** [Grind_and_Crumb_Report.pdf](./Grind_and_Crumb_Report.pdf)

Built for the Code & Consult Hackathon client brief. Grind & Crumb is a fictional 12-café chain in the north of England. Its board has £1.5m to invest, and the CEO asked:

> *"Sales are up, but profit doesn't feel like it… I need to see what's actually going on, store by store, and I need a tool my ops team can keep using after you leave."*

This repo contains the web app, which answers that question and lets the ops team keep tracking it, and the report with our recommendation.

---

## The answer in one minute

Sales rose **14%** (July 2025 to June 2026), but store margin fell from **14.1% to 12.3%**. The growth came through the most expensive routes:

| Finding | What the data shows |
|---|---|
| **Piccadilly, the biggest café, loses money** | −£48k on £1.11m of sales. Rent is 33% of sales (chain median 14%). Only 33% of lunch visitors buy, against 41–46% elsewhere. Staff turnover is 230%. |
| **Delivery dilutes the margin** | Delivery rose from 11% to 23% of sales, but each £1 keeps only 59p after commission, packaging and staff time. Dashly's rise from 27% to 33% commission costs about £42k a year. |
| **The app relaunch lost orders** | App sales are still 18% down since v3.0 (about £188k a year). App and stamp complaints went from 0 to 71. |
| **Leeds Trinity took trade from Briggate** | Briggate's sales fell 22% and combined Leeds profit fell 35%, while the other cafés' profit rose 17%. |
| **Hull over-orders** | It bins 21% of the food it prepares (chain rate 9%), repair bills are 3× the median, and all 43 hygiene complaints are about Hull. |

### Recommendation: commit £1.225m now, hold £275k until a month-6 check

| Investment | £ | Extra profit/yr (planner) | Extra profit/yr (our stress test) |
|---|---:|---:|---:|
| New café: Manchester Oxford Road (CS3) | 240,000 | 192,478 | 135,000 |
| New café: York Railway Station kiosk (CS4) | 180,000 | 134,778 | 77,000 |
| Digital: fix the app + par-level forecasting | 160,000 | 62,000 | 62,000 |
| York Stonegate refit (S04) | 160,000 | 45,000 | 45,000 |
| Piccadilly pickup hatch + lunch staff (S07) | 90,000 | 65,000 | 44,000 |
| Energy-saving equipment, all cafés | 85,000 | 21,000 | 21,000 |
| Spinningfields grab-and-go lunch (S06) | 60,000 | 32,000 | 32,000 |
| Hull refurbishment (S10) | 50,000 | 18,000 | 18,000 |
| Capital contingency reserve | 200,000 | – | – |
| **Committed** | **1,225,000** | **+570,256 (2.15-yr payback)** | **+434,000 (2.8-yr payback)** |

The remaining **£275k** is released at month 6 only if both new cafés are trading at ≥90% of plan. If they are, it goes to Leeds Headingley. If Manchester staff turnover is still above 100%, it goes to a lunch retention premium instead. Otherwise it returns to the board. The full evidence, risks, data issues and assumptions are in the report.

---

## What the app does

| Page | Purpose |
|---|---|
| **Overview** | Chain revenue, profit, biggest loss, best team and a sortable store table with a status for each café |
| **Store Timeline** | Sales, costs and profit per store by day, week, month or year |
| **Store Deep Dive** | Full P&L, rent share, waste, staff turnover, reviews and a diagnosis for each café |
| **Costs & Savings** | Cost breakdown and a savings simulator (delivery minimum, Dashly renegotiation, prep levels and more) |
| **Income & Menu** | Top products by category and full menu margins |
| **Delivery** | Channel mix, commission, small-order economics and a delivery pricing calculator |
| **Staff & Rota** | Headcount, leavers, turnover, survey scores and exit reasons |
| **Food Waste** | Waste rate and cost by store and category |
| **Upload Data** | The ops team uploads new monthly CSVs (sales, waste, rota, costs) and every page recalculates in the browser, with no code needed |
| **Investment plan** | The £1.5m planner: tick options in or out, edit amounts, add your own ideas, see payback and 5-year gain, open a risk review for each option |
| **Chatbot** | An AI advisor (Gemini via the Lovable AI gateway) that answers questions about the data and reviews the plan |

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React, file-based routing) with Vite
- Tailwind CSS v4 and Radix UI components
- Recharts for charts
- Vercel AI SDK with an OpenAI-compatible Lovable AI gateway for the chatbot
- Vitest for tests
- Built with [Lovable](https://lovable.dev)

## Running locally

You need [Bun](https://bun.sh) or Node.js 20+.

```sh
git clone <this-repo-url>
cd grind-and-crumb-final-main
bun install        # or: npm install
bun run dev        # or: npm run dev
```

Then open the local URL Vite prints, usually `http://localhost:5173`.

The chatbot needs an API key. Create a `.env` file in the project root containing:

```
LOVABLE_API_KEY=your_key_here
```

Every other page works without it.

Other scripts:

```sh
bun run build      # production build
bun run test       # run unit tests (models, timeline, upload)
bun run lint       # lint
```

## Project structure

```
src/
  routes/            one file per page (index, stores, timeline, costs, income,
                     delivery, staff, waste, upload, invest) and api/chat.ts
  components/        dashboard primitives, advisor (chatbot) panel, layout, UI kit
  data/
    dashboard.json   pre-computed store and chain figures from the data pack
    daily.json       daily figures behind the timeline
    investment-options.ts   planner options and the risk library
  lib/
    models.ts        payback, plan portfolio, cost-saving and delivery models
    upload.ts        in-browser CSV re-import
    ai/              chatbot prompt and gateway
```

## Data

The app is built on the Grind & Crumb data pack (1 July 2025 to 30 June 2026, GBP, net of VAT). Data issues we handled include:

- duplicate receipts and refund rows
- a mixed date format in Hull's waste log
- a broken door counter at Northern Quarter
- a footfall spike in Harrogate
- duplicate loyalty IDs
- 31 spellings of the 12 store names in reviews

The report lists every issue and assumption.

Cost assumptions follow the client brief:

- labour = scheduled hours × wage × 1.13
- delivery cost = platform commission + £0.45 packaging + 4 minutes of staff time per order
- head office costs and tax are excluded
