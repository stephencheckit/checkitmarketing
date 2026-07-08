import { inngest } from '@/lib/inngest';
import { runLeadScoring } from '@/lib/lead-scoring';

// Scores a single lead asynchronously so intake forms stay fast.
// Triggered by `lead/score.requested` on intake and by the manual backfill.
export const leadScore = inngest.createFunction(
  { id: 'lead-score', concurrency: 5, retries: 2 },
  { event: 'lead/score.requested' },
  async ({ event }) => {
    const email = event.data?.email as string | undefined;
    if (!email) return { error: 'no email provided' };

    const result = await runLeadScoring(email);
    return result || { error: 'lead not found' };
  }
);
