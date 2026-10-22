'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { formatWeek, PLAN_WEEKS, type CoveragePlan } from '@/lib/gtm-plan';

// The shared GTM plan as the map needs it: each market's slice of the planned
// ARR and the outreach on its target list. Like Apollo data, it only loads on
// the authenticated map.

export interface MarketPlan {
  focusPct: number | null;
  plannedArr: number | null;
  outreach: { list: string; owner: string; closer: string; perWeek: number; accounts: number; status: string; behind: boolean }[];
}

const PlanContext = createContext<Record<string, MarketPlan>>({});

export const PlanProvider = PlanContext.Provider;

export function useMarketPlan(segmentId: string): MarketPlan | undefined {
  return useContext(PlanContext)[segmentId.replace(/^seg-/, '')];
}

interface PlannerMarket {
  id: string;
  category: 'medical' | 'commercial';
  focusPct: number;
}

export function usePlanOverlay(enabled: boolean): Record<string, MarketPlan> {
  const [byMarket, setByMarket] = useState<Record<string, MarketPlan>>({});

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    Promise.all([
      fetch('/api/gtm-planning/plan').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/gtm-outreach').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([plan, outreach]) => {
        if (cancelled) return;
        const out: Record<string, MarketPlan> = {};
        const planner = plan?.planner as
          | { netNew?: number; expansion?: number; renewal?: number; medicalPct?: number; markets?: PlannerMarket[] }
          | null;
        if (planner?.markets) {
          const total = (planner.netNew ?? 0) + (planner.expansion ?? 0) + (planner.renewal ?? 0);
          const medicalPct = planner.medicalPct ?? 50;
          for (const m of planner.markets) {
            const catArr = total * ((m.category === 'medical' ? medicalPct : 100 - medicalPct) / 100);
            out[m.id] = { focusPct: m.focusPct, plannedArr: catArr * (m.focusPct / 100), outreach: [] };
          }
        }
        for (const l of (outreach?.lists ?? []) as { coverage: CoveragePlan }[]) {
          const c = l.coverage;
          const entry = out[c.list.marketId] ?? { focusPct: null, plannedArr: null, outreach: [] };
          const behind = c.weeksToCover > PLAN_WEEKS;
          entry.outreach.push({
            list: c.list.name,
            owner: c.settings.owner,
            closer: c.settings.closer,
            perWeek: c.settings.perWeek,
            accounts: c.accounts,
            behind,
            status: behind
              ? `${Math.round((c.coveredIn12m / Math.max(1, c.accounts)) * 100)}% in 12 mo`
              : c.accounts > 0
                ? `done w/c ${formatWeek(c.settings.startDate, c.weeksToCover - 1)}`
                : 'no targets',
          });
          out[c.list.marketId] = entry;
        }
        setByMarket(out);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return byMarket;
}
