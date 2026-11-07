# Hackvesters: Café chain ops dashboard and £1.5m investment planner for Grind & Crumb

**Live web app:** [WEB_APP_URL](https://grind-n-crumb.lovable.app)
**Executive report (2 pages):** [Grind_and_Crumb_Report.pdf](Hackvesters_Grind&Crumb_Report.docx)

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


