import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useState } from "react";

import { Briefing, BriefingPoint, Kpi, PageHeader, Panel, Pill } from "@/components/dash/primitives";
import { useDashboard } from "@/lib/data-context";
import { gbp, gbpPence, n, pct } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/income")({
  head: () => ({
    meta: [
      { title: "Income & Menu — Grind & Crumb CEO Command Centre" },
      {
        name: "description",
        content:
          "Sales by channel, best and worst sellers, and the margin and return on every one of Grind & Crumb's 38 menu items.",
      },
      { property: "og:title", content: "Grind & Crumb — Income & Menu" },
      { property: "og:description", content: "Channel mix, best sellers and menu margins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IncomePage,
});

const EVENTS = [
  { date: "15 Sep 2025", title: "Leeds Trinity opens", body: "0.4 miles from Briggate — took ~22% of Briggate's sales.", tone: "warning" as const },
  { date: "12 Jan 2026", title: "40p oat milk charge", body: "Meant to recover ~£40k. Two days later rival Bean Social scrapped its plant-milk charge.", tone: "negative" as const },
  { date: "2 Mar 2026", title: "App v3.0 launch", body: "Lost loyalty stamps and checkout freezes drove counter complaints until v3.1 on 13 Apr.", tone: "negative" as const },
  { date: "1 Apr 2026", title: "Wage rise & Dashly 33%", body: "National Living Wage up ~6.7%; Dashly commission up from 27% to 33%.", tone: "warning" as const },
];

type SortKey = "annual_revenue" | "annual_profit" | "margin_pct" | "roi_pct" | "annual_qty";

function IncomePage() {
  const { data } = useDashboard();
  const c = data.chain;
  const [sortKey, setSortKey] = useState<SortKey>("annual_profit");
  const [asc, setAsc] = useState(false);
  const byRevenue = [...data.products].sort((a, b) => b.annual_revenue - a.annual_revenue);
  const top = byRevenue.slice(0, 10);
  const bottom = byRevenue.slice(-10).reverse();

  const sorted = useMemo(
    () => [...data.products].sort((a, b) => (asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey])),
    [data.products, sortKey, asc],
  );

  const Th = ({ k, children }: { k: SortKey; children: string }) => (
    <th className="px-3 py-3 text-right font-semibold">
      <button
        type="button"
        onClick={() => (sortKey === k ? setAsc(!asc) : (setSortKey(k), setAsc(false)))}
        className={cn("inline-flex items-center gap-1", sortKey === k && "text-foreground")}
      >
        {children}
        {sortKey === k && (asc ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
      </button>
    </th>
  );

  const ProductList = ({ items, tone }: { items: Product[]; tone: "positive" | "warning" }) => (
    <ol className="divide-y">
      {items.map((p, i) => (
        <li key={p.product_id} className="flex items-center gap-3 py-2.5">
          <span className="num w-6 text-xs text-muted-foreground">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{p.product_name}</div>
            <div className="text-xs text-muted-foreground">
              {p.category} · {gbpPence(p.menu_price_gbp)} · {pct(p.margin_pct)} margin
            </div>
          </div>
          <span className={cn("num text-sm font-semibold", tone === "positive" ? "text-positive" : "text-warning-foreground")}>
            {gbp(p.annual_revenue)}
          </span>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <PageHeader
        eyebrow="Income & menu"
        title="What earns the money"
        description="Coffee carries the business. The menu decisions that matter most are the oat milk charge and lifting basket size."
      />

      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <Kpi label="In-store" value={gbp(c.instore_revenue)} sub={`${pct((c.instore_revenue / c.total_revenue) * 100)} of sales`} />
        <Kpi label="Delivery platforms" value={gbp(c.delivery_revenue)} sub={`${pct((c.delivery_revenue / c.total_revenue) * 100)} of sales`} tone="brand" />
        <Kpi label="App click & collect" value={gbp(c.app_revenue)} sub={`${pct((c.app_revenue / c.total_revenue) * 100)} of sales`} />
      </div>

      <Briefing title="Maximising revenue and margin per item" question="Should we scrap the oat milk surcharge?">
        <div className="grid gap-4 md:grid-cols-3">
          <BriefingPoint title="Scrap the 40p oat milk charge">
            Introduced in January to recover ~£40k, it triggered a wave of angry reviews just as Bean
            Social dropped its own charge. Lost regulars cost more than the fee brings in.
          </BriefingPoint>
          <BriefingPoint title="Push the high-margin hero drinks">
            Lattes, flat whites, Americanos and iced drinks earn 75–85% margins and most of the revenue.
            Make them the first thing suggested at the till and in the app.
          </BriefingPoint>
          <BriefingPoint title="Use meal deals to lift basket size">
            Pairing a drink with a sandwich raises the average spend while keeping a healthy blended
            margin — and helps sell lunch stock before it's binned.
          </BriefingPoint>
        </div>
      </Briefing>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top 10 sellers" subtitle="By annual revenue">
          <ProductList items={top} tone="positive" />
        </Panel>
        <Panel title="Bottom 10 sellers" subtitle="Candidates to rethink or remove">
          <ProductList items={bottom} tone="warning" />
        </Panel>
      </div>

      <Panel title="What changed this year" subtitle="Events that moved sales and sentiment">
        <ol className="grid gap-4 md:grid-cols-4">
          {EVENTS.map((e) => (
            <li key={e.title} className="relative border-t-2 border-brand pt-3">
              <div className="num text-xs text-muted-foreground">{e.date}</div>
              <div className="mt-1 flex items-center gap-2">
                <h3 className="text-base font-semibold">{e.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
              <div className="mt-2">
                <Pill tone={e.tone}>{e.tone === "negative" ? "Hurt sales" : "Watch"}</Pill>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Full menu economics" subtitle={`${data.products.length} items · tap a column to sort`} bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Item</th>
                <th className="px-3 py-3 text-right font-semibold">Price</th>
                <th className="px-3 py-3 text-right font-semibold">Unit cost</th>
                <Th k="margin_pct">Margin</Th>
                <Th k="annual_qty">Sold / yr</Th>
                <Th k="annual_revenue">Revenue</Th>
                <Th k="annual_profit">Gross profit</Th>
                <Th k="roi_pct">Return</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.product_id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-2.5">
                    <div className="font-semibold">{p.product_name}</div>
                    <div className="text-xs text-muted-foreground">{p.category}</div>
                  </td>
                  <td className="num px-3 py-2.5 text-right">{gbpPence(p.menu_price_gbp)}</td>
                  <td className="num px-3 py-2.5 text-right text-muted-foreground">{gbpPence(p.unit_cost_gbp)}</td>
                  <td className="num px-3 py-2.5 text-right text-positive">{pct(p.margin_pct)}</td>
                  <td className="num px-3 py-2.5 text-right">{n(p.annual_qty)}</td>
                  <td className="num px-3 py-2.5 text-right">{gbp(p.annual_revenue)}</td>
                  <td className="num px-3 py-2.5 text-right font-semibold">{gbp(p.annual_profit)}</td>
                  <td className="num px-3 py-2.5 text-right text-brand">{p.roi_pct.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
