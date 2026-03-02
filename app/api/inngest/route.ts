import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import {
  nurtureDailySend,
  nurtureDailyRecap,
  nurturContactEnrolled,
  nurturResendWebhook,
} from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    nurtureDailySend,
    nurtureDailyRecap,
    nurturContactEnrolled,
    nurturResendWebhook,
  ],
});
