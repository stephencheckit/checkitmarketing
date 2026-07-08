// Ramp spend snapshot for the GTM hub.
//
// This is a point-in-time snapshot pulled from Ramp via the Cursor MCP
// connection, not a live feed. The deployed app has no Ramp credentials, so
// the data below is baked in. To refresh, ask the agent to re-pull from Ramp
// and replace the `transactions` array + `meta` block.
//
// All rollups (by category, by vendor, summary) are computed from the
// transactions array at render time — nothing is hardcoded, so swapping the
// data is all that's needed on refresh.

export interface RampTransaction {
  id: string;
  /** ISO 8601 timestamp */
  date: string;
  merchant: string;
  category: string;
  /** USD, positive number */
  amount: number;
  spentBy: string;
  memo: string | null;
  link: string;
}

export interface RampSnapshotMeta {
  /** When this snapshot was pulled from Ramp (ISO 8601) */
  lastUpdated: string;
  /** Start of the pulled window (ISO date) */
  windowStart: string;
  /** End of the pulled window (ISO date) */
  windowEnd: string;
  /** Total cleared transactions Ramp reported for the window */
  totalAvailable: number;
  /** Scope of the data (Ramp role-limits this to the connected user) */
  scope: string;
  /** True when `transactions` is a subset of `totalAvailable` */
  partial: boolean;
}

export const rampSnapshotMeta: RampSnapshotMeta = {
  lastUpdated: '2026-07-08T12:48:48.654Z',
  windowStart: '2026-04-01',
  windowEnd: '2026-07-07',
  totalAvailable: 182,
  scope: 'Stephen Newman (marketing spend)',
  partial: false,
};

export const rampTransactions: RampTransaction[] = [
  { id: '38fc474b-91ba-472d-bd3b-0f9370808bdc', date: '2026-07-07T23:11:26.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.6, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/38fc474b-91ba-472d-bd3b-0f9370808bdc' },
  { id: '2341b825-e99e-45c5-b39a-b6897f2ed9e5', date: '2026-07-07T19:04:26.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.18, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/2341b825-e99e-45c5-b39a-b6897f2ed9e5' },
  { id: 'fa0781cd-f633-4d41-9930-8f22ffd1bac7', date: '2026-07-07T15:49:45.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.53, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/fa0781cd-f633-4d41-9930-8f22ffd1bac7' },
  { id: 'a6a6dc35-84ff-4ad1-919e-8b8f3efb45a7', date: '2026-07-07T14:28:29.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.16, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a6a6dc35-84ff-4ad1-919e-8b8f3efb45a7' },
  { id: '6429b79c-bde0-406f-9b1d-5df052c1319c', date: '2026-07-07T12:42:19.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.77, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/6429b79c-bde0-406f-9b1d-5df052c1319c' },
  { id: 'ebcd0d16-4267-47c2-b8c5-97af296d44c1', date: '2026-07-07T12:32:57.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.99, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/ebcd0d16-4267-47c2-b8c5-97af296d44c1' },
  { id: '055272b7-c674-47d6-8251-2bd2e5d4e507', date: '2026-07-07T01:31:29.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.01, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/055272b7-c674-47d6-8251-2bd2e5d4e507' },
  { id: 'b02f050e-7de8-4705-92ab-049bdbb811a6', date: '2026-07-06T14:01:06.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.74, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/b02f050e-7de8-4705-92ab-049bdbb811a6' },
  { id: '3278b1f9-a10a-4ea4-a055-ceea28391982', date: '2026-07-05T21:49:49.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 99.99, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/3278b1f9-a10a-4ea4-a055-ceea28391982' },
  { id: 'd4cf0163-3a43-42bd-9658-ff63c047869c', date: '2026-07-05T12:38:38.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.34, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/d4cf0163-3a43-42bd-9658-ff63c047869c' },
  { id: '8cd16ba7-45cb-4641-a8d3-5bf9d742722a', date: '2026-07-04T15:10:19.000Z', merchant: 'Smallpdf', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/8cd16ba7-45cb-4641-a8d3-5bf9d742722a' },
  { id: '8145496c-b56b-44fd-b896-aab72a68fad4', date: '2026-07-04T14:53:06.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/8145496c-b56b-44fd-b896-aab72a68fad4' },
  { id: 'af36c1e4-5cc5-4794-b03c-e0a7947923be', date: '2026-07-04T12:45:31.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 7.43, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/af36c1e4-5cc5-4794-b03c-e0a7947923be' },
  { id: 'd1c3d560-9d43-4be1-a461-92c2469f730e', date: '2026-07-04T11:33:40.000Z', merchant: 'Supabase', category: 'SaaS / Software', amount: 34.35, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/d1c3d560-9d43-4be1-a461-92c2469f730e' },
  { id: 'b791b4d0-3a53-40f2-bb28-838453cc0b78', date: '2026-07-03T16:45:25.000Z', merchant: 'Canva', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/b791b4d0-3a53-40f2-bb28-838453cc0b78' },
  { id: '8d597b9e-55f5-4cba-8fd4-5de62ced303d', date: '2026-07-03T12:42:32.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.19, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/8d597b9e-55f5-4cba-8fd4-5de62ced303d' },
  { id: '9a39be7a-f4e5-4ac9-8ec7-b99c1360bffd', date: '2026-07-03T12:34:17.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.63, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/9a39be7a-f4e5-4ac9-8ec7-b99c1360bffd' },
  { id: '7b410a4f-0dbd-464e-b61a-b7213fc56239', date: '2026-07-02T16:18:13.000Z', merchant: 'Semrush', category: 'SaaS / Software', amount: 199, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/7b410a4f-0dbd-464e-b61a-b7213fc56239' },
  { id: '8bfb618a-91e2-431c-a1be-06b6ae3cff5f', date: '2026-07-02T12:35:56.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.28, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/8bfb618a-91e2-431c-a1be-06b6ae3cff5f' },
  { id: '4fb56a31-73fa-4573-b0a1-035dddd6cd4b', date: '2026-07-02T12:08:39.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 200, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/4fb56a31-73fa-4573-b0a1-035dddd6cd4b' },
  { id: '17768b9a-5345-468c-bb9e-62b93f8d7c63', date: '2026-07-01T15:55:24.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 402.21, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/17768b9a-5345-468c-bb9e-62b93f8d7c63' },
  { id: '6ee8232e-566f-4e32-ac4f-f13d2f03b94b', date: '2026-07-01T12:41:31.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.34, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/6ee8232e-566f-4e32-ac4f-f13d2f03b94b' },
  { id: 'ea623351-54fb-4696-ba64-c82a3791251b', date: '2026-07-01T11:37:44.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 74.73, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/ea623351-54fb-4696-ba64-c82a3791251b' },
  { id: '9bf9b0b6-9506-4eb8-a95f-03ca5d24e666', date: '2026-07-01T11:23:56.000Z', merchant: 'Capterra', category: 'Advertising', amount: 42, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/9bf9b0b6-9506-4eb8-a95f-03ca5d24e666' },
  { id: 'f4ceaafc-f259-4ac7-97d1-89f8c28ce4fa', date: '2026-07-01T06:20:42.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 55.12, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/f4ceaafc-f259-4ac7-97d1-89f8c28ce4fa' },
  { id: 'a927065b-655b-4d13-8034-2ebc698afcd3', date: '2026-06-30T20:15:55.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.6, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/a927065b-655b-4d13-8034-2ebc698afcd3' },
  { id: 'a49afa2e-83e8-4a82-bfdc-0d2906f8d080', date: '2026-06-30T20:05:09.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.6, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a49afa2e-83e8-4a82-bfdc-0d2906f8d080' },
  { id: 'c283761c-24ee-4d97-ab65-9cf199acea6d', date: '2026-06-29T20:59:23.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.27, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/c283761c-24ee-4d97-ab65-9cf199acea6d' },
  { id: 'aba766a4-0a21-4c33-9910-2db6c3fd9c87', date: '2026-06-29T14:03:32.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/aba766a4-0a21-4c33-9910-2db6c3fd9c87' },
  { id: '254230c1-64ba-4b10-b970-f940d1f5a59b', date: '2026-06-29T07:16:46.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 100, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/254230c1-64ba-4b10-b970-f940d1f5a59b' },
  { id: '49f11fea-3fa5-4019-8c25-2d02c87b1e95', date: '2026-06-27T10:56:18.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 263.58, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/49f11fea-3fa5-4019-8c25-2d02c87b1e95' },
  { id: 'c16b6ac2-c24b-4462-a97b-ab0a9672be48', date: '2026-06-26T17:03:21.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.03, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/c16b6ac2-c24b-4462-a97b-ab0a9672be48' },
  { id: '056e02fa-ad7a-4603-ae91-e5713afc94a2', date: '2026-06-25T15:02:23.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.12, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/056e02fa-ad7a-4603-ae91-e5713afc94a2' },
  { id: 'd790a72a-bc49-41ca-9757-3358fb092cb4', date: '2026-06-25T10:55:05.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 100, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/d790a72a-bc49-41ca-9757-3358fb092cb4' },
  { id: '0213278e-2641-4ce8-ac53-e6dc5cdb73a6', date: '2026-06-24T17:06:04.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.28, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/0213278e-2641-4ce8-ac53-e6dc5cdb73a6' },
  { id: '56ff5798-1c2a-41c7-a517-98a869dfd03e', date: '2026-06-24T12:47:08.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.4, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/56ff5798-1c2a-41c7-a517-98a869dfd03e' },
  { id: '182d057d-b14d-45f6-a626-83b999ef8bc9', date: '2026-06-22T23:13:50.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 103.14, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/182d057d-b14d-45f6-a626-83b999ef8bc9' },
  { id: 'a318405b-29d5-4256-b684-d9772b361bb8', date: '2026-06-22T14:29:04.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.61, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a318405b-29d5-4256-b684-d9772b361bb8' },
  { id: '2124238a-6563-4eac-9adb-2918a5ce160e', date: '2026-06-22T14:11:12.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.08, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/2124238a-6563-4eac-9adb-2918a5ce160e' },
  { id: '1ad6537f-9c7a-47b8-81c7-7fa38b1968d2', date: '2026-06-21T00:04:09.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 50, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/1ad6537f-9c7a-47b8-81c7-7fa38b1968d2' },
  { id: 'fa514a01-a14d-4647-9d06-10da4dc3c9d5', date: '2026-06-20T14:56:10.000Z', merchant: 'Anthropic', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/fa514a01-a14d-4647-9d06-10da4dc3c9d5' },
  { id: '87bfbc44-a802-41b0-8c0b-c15c72b7e1b6', date: '2026-06-19T10:34:22.000Z', merchant: 'Empowerkit', category: 'SaaS / Software', amount: 14.95, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/87bfbc44-a802-41b0-8c0b-c15c72b7e1b6' },
  { id: 'ac236d73-6f48-4169-8555-a4213edf50e5', date: '2026-06-19T02:07:09.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.07, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/ac236d73-6f48-4169-8555-a4213edf50e5' },
  { id: '9de8558d-91e1-4e04-81d4-aae2c49ed2de', date: '2026-06-19T01:30:38.000Z', merchant: 'Vercel', category: 'SaaS / Software', amount: 40, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/9de8558d-91e1-4e04-81d4-aae2c49ed2de' },
  { id: '4ea8259b-e26c-4d96-acd0-ca02c121ea83', date: '2026-06-18T21:07:45.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.19, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/4ea8259b-e26c-4d96-acd0-ca02c121ea83' },
  { id: '370470dd-5190-4bad-b3a7-4ea67c8eb934', date: '2026-06-18T16:23:22.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.5, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/370470dd-5190-4bad-b3a7-4ea67c8eb934' },
  { id: '39213b36-e01e-4176-84a6-046d3d71a37c', date: '2026-06-18T16:13:04.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.83, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/39213b36-e01e-4176-84a6-046d3d71a37c' },
  { id: 'af0692ec-6f9f-40f4-b61f-8873af603ca2', date: '2026-06-18T16:03:05.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.64, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/af0692ec-6f9f-40f4-b61f-8873af603ca2' },
  { id: '89fff4d0-a473-40f7-b179-5a33ad599bf4', date: '2026-06-18T15:51:37.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 7.17, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/89fff4d0-a473-40f7-b179-5a33ad599bf4' },
  { id: 'bae66c5b-76b1-4447-83ed-d226fd04bebd', date: '2026-06-18T15:43:44.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.16, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/bae66c5b-76b1-4447-83ed-d226fd04bebd' },
  { id: 'a8f88568-37cc-4835-8be9-084d6145a73c', date: '2026-06-18T15:06:36.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 50, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/a8f88568-37cc-4835-8be9-084d6145a73c' },
  { id: 'd39da5d5-4a57-45c2-8b01-bc3337cb5d3b', date: '2026-06-17T13:57:28.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.28, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/d39da5d5-4a57-45c2-8b01-bc3337cb5d3b' },
  { id: 'b23b2a5d-dc46-4f74-8638-3e8b788371f6', date: '2026-06-16T23:12:20.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.37, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/b23b2a5d-dc46-4f74-8638-3e8b788371f6' },
  { id: '13808443-7d32-44e1-abcf-d63406cc16be', date: '2026-06-16T16:48:36.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.83, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/13808443-7d32-44e1-abcf-d63406cc16be' },
  { id: 'd5918b46-edc6-458d-bbc0-55f92ce29c61', date: '2026-06-16T16:12:22.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.26, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/d5918b46-edc6-458d-bbc0-55f92ce29c61' },
  { id: 'cc8b6823-313f-4e5c-b621-6523fb9d0be1', date: '2026-06-16T16:03:05.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.65, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/cc8b6823-313f-4e5c-b621-6523fb9d0be1' },
  { id: '5ddc78e6-20d3-4061-bd6a-98b4d0d08a45', date: '2026-06-16T14:26:48.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 500, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/5ddc78e6-20d3-4061-bd6a-98b4d0d08a45' },
  { id: 'bfff6939-c13c-49db-8547-e0152477c58f', date: '2026-06-15T21:13:00.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.46, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/bfff6939-c13c-49db-8547-e0152477c58f' },
  { id: 'eda1764e-f862-4529-8f47-4261f15d5785', date: '2026-06-15T14:37:00.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.71, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/eda1764e-f862-4529-8f47-4261f15d5785' },
  { id: '67f2f931-fedc-43b3-aebc-a1fd006b51ad', date: '2026-06-15T13:41:00.000Z', merchant: 'Apollo.io', category: 'SaaS / Software', amount: 695, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/67f2f931-fedc-43b3-aebc-a1fd006b51ad' },
  { id: '1ac9d6d2-c16c-437e-bd4a-863816782fa3', date: '2026-06-15T13:18:38.000Z', merchant: 'Calendly', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/1ac9d6d2-c16c-437e-bd4a-863816782fa3' },
  { id: 'd9aa086b-6459-4b30-bc6c-93c26f8550a1', date: '2026-06-14T20:55:47.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 50, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/d9aa086b-6459-4b30-bc6c-93c26f8550a1' },
  { id: 'a6ce52de-c242-438e-b4bf-840e9b7a6462', date: '2026-06-14T11:18:34.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 263.91, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a6ce52de-c242-438e-b4bf-840e9b7a6462' },
  { id: '2c43e217-861c-423b-88ef-4a15e845564e', date: '2026-06-13T21:54:12.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.9, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/2c43e217-861c-423b-88ef-4a15e845564e' },
  { id: '59b85b54-d6a9-4f64-9701-f03c82db907d', date: '2026-06-13T20:57:44.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 25, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/59b85b54-d6a9-4f64-9701-f03c82db907d' },
  { id: '288842dc-1496-46a7-ab4b-52b0c49acd88', date: '2026-06-12T13:23:57.000Z', merchant: 'Phantombuster', category: 'SaaS / Software', amount: 159, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/288842dc-1496-46a7-ab4b-52b0c49acd88' },
  { id: '486984fa-fb49-4eef-a9bb-5a16273c136e', date: '2026-06-11T16:22:53.000Z', merchant: 'Buffer', category: 'SaaS / Software', amount: 18, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/486984fa-fb49-4eef-a9bb-5a16273c136e' },
  { id: '80849157-5878-4d25-8373-18ff9d17b1f2', date: '2026-06-11T12:56:11.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.61, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/80849157-5878-4d25-8373-18ff9d17b1f2' },
  { id: 'f90af694-2af5-4ffa-84ff-ab5737a7ec3d', date: '2026-06-11T11:57:14.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.25, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/f90af694-2af5-4ffa-84ff-ab5737a7ec3d' },
  { id: 'c9de9f0d-df2c-4550-917b-77a12bc8bbf3', date: '2026-06-10T18:27:42.000Z', merchant: 'Phantombuster', category: 'SaaS / Software', amount: 69, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/c9de9f0d-df2c-4550-917b-77a12bc8bbf3' },
  { id: 'b1d14852-c28b-4f62-ae01-028a20bd7887', date: '2026-06-10T12:56:49.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.22, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/b1d14852-c28b-4f62-ae01-028a20bd7887' },
  { id: 'cc3023c9-a500-43ca-aa49-b53746a6089b', date: '2026-06-10T11:46:58.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.21, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/cc3023c9-a500-43ca-aa49-b53746a6089b' },
  { id: '9518d100-8799-4b26-ba44-ef021900f487', date: '2026-06-09T20:42:11.000Z', merchant: 'Zapier', category: 'SaaS / Software', amount: 58.5, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/9518d100-8799-4b26-ba44-ef021900f487' },
  { id: '69b57993-fc7b-4dad-b13f-b062f88a2e6a', date: '2026-06-09T18:07:11.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 103.13, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/69b57993-fc7b-4dad-b13f-b062f88a2e6a' },
  { id: '8ff50ef3-82d2-46d6-b5b5-f3b9a9e3bebf', date: '2026-06-09T13:29:16.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.12, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/8ff50ef3-82d2-46d6-b5b5-f3b9a9e3bebf' },
  { id: 'a2352ff7-129d-4344-aa5e-83c486e5bbfa', date: '2026-06-08T19:25:33.000Z', merchant: 'Adobe', category: 'SaaS / Software', amount: 36.98, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a2352ff7-129d-4344-aa5e-83c486e5bbfa' },
  { id: '761c262c-8585-4486-acc2-e9d5230a90f6', date: '2026-06-08T15:06:19.000Z', merchant: 'Figma', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/761c262c-8585-4486-acc2-e9d5230a90f6' },
  { id: '05090ba9-0ed3-4177-87f4-05eda16ff5d8', date: '2026-06-08T12:09:55.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.57, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/05090ba9-0ed3-4177-87f4-05eda16ff5d8' },
  { id: '937a6f62-463d-4542-884f-72f57bf9ae8f', date: '2026-06-07T18:26:32.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 103.05, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/937a6f62-463d-4542-884f-72f57bf9ae8f' },
  { id: 'fbf82412-0e5c-48cd-976c-82923f312e5c', date: '2026-06-06T17:45:34.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.26, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/fbf82412-0e5c-48cd-976c-82923f312e5c' },
  { id: '2044d98c-6298-4665-8fc0-066bdb5b5c84', date: '2026-06-06T14:30:33.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.15, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/2044d98c-6298-4665-8fc0-066bdb5b5c84' },
  { id: '8e9d3060-b195-4e6b-b956-5882236a6f16', date: '2026-06-05T21:49:56.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 99.99, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/8e9d3060-b195-4e6b-b956-5882236a6f16' },
  { id: 'fc97486a-421f-4a76-9361-aefd44b33053', date: '2026-06-05T21:36:57.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.1, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/fc97486a-421f-4a76-9361-aefd44b33053' },
  { id: '4118ff21-4eb1-4b36-8d68-11db856cc6bc', date: '2026-06-05T21:20:37.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.09, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/4118ff21-4eb1-4b36-8d68-11db856cc6bc' },
  { id: 'dcdb5e03-301c-468e-a53b-1011257a8938', date: '2026-06-05T16:17:53.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.59, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/dcdb5e03-301c-468e-a53b-1011257a8938' },
  { id: 'a3ed3ea8-f0b0-49f7-abb3-989b74194830', date: '2026-06-05T13:38:19.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.17, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/a3ed3ea8-f0b0-49f7-abb3-989b74194830' },
  { id: 'b92d087d-a6e2-483f-88b5-cda73efaa018', date: '2026-06-04T19:18:59.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.35, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/b92d087d-a6e2-483f-88b5-cda73efaa018' },
  { id: 'ad2b18e9-a8f3-4a8c-9f49-bca8c8a71560', date: '2026-06-04T17:17:15.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/ad2b18e9-a8f3-4a8c-9f49-bca8c8a71560' },
  { id: 'd75b1cd5-129e-4c05-9cef-c7c5e22f91d3', date: '2026-06-04T15:10:18.000Z', merchant: 'Smallpdf', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/d75b1cd5-129e-4c05-9cef-c7c5e22f91d3' },
  { id: '271df433-916b-4a49-b927-7958f4db8b38', date: '2026-06-04T12:20:53.000Z', merchant: 'Supabase', category: 'SaaS / Software', amount: 35, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/271df433-916b-4a49-b927-7958f4db8b38' },
  { id: 'c3de5c73-bcc6-488c-a3d5-8d154df8749a', date: '2026-06-03T21:25:50.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.54, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/c3de5c73-bcc6-488c-a3d5-8d154df8749a' },
  { id: 'b70a82ed-c4fd-4653-af5d-8905b934d573', date: '2026-06-03T18:33:02.000Z', merchant: 'Apollo.io', category: 'SaaS / Software', amount: 37.68, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/b70a82ed-c4fd-4653-af5d-8905b934d573' },
  { id: '71bf861c-f890-431e-835f-a164d331d76f', date: '2026-06-03T17:15:21.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.48, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/71bf861c-f890-431e-835f-a164d331d76f' },
  { id: '8600a439-54fa-40da-8069-c3e43bb7e839', date: '2026-06-03T16:45:18.000Z', merchant: 'Canva', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/8600a439-54fa-40da-8069-c3e43bb7e839' },
  { id: '24544140-6397-47c4-ac64-fa55eb4e3243', date: '2026-06-03T13:09:01.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.03, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/24544140-6397-47c4-ac64-fa55eb4e3243' },
  { id: '777cc890-3099-46df-b105-09c427d8ca49', date: '2026-06-03T12:15:31.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 1.59, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/777cc890-3099-46df-b105-09c427d8ca49' },
  { id: '70a706e7-6229-4700-a3b3-f45d4d2ab776', date: '2026-06-03T12:10:15.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 25, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/70a706e7-6229-4700-a3b3-f45d4d2ab776' },
  { id: '7cb04f60-ca52-4c3e-b92c-5d673bca6d06', date: '2026-06-03T01:21:51.000Z', merchant: 'Apollo.io', category: 'SaaS / Software', amount: 200, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/7cb04f60-ca52-4c3e-b92c-5d673bca6d06' },
  { id: 'c1fd4ca3-52ad-4fec-bbaa-92ad9a502d58', date: '2026-06-02T20:25:27.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 6.79, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/c1fd4ca3-52ad-4fec-bbaa-92ad9a502d58' },
  { id: '7504baac-aa00-4803-a017-3014eae6ed78', date: '2026-06-02T19:47:26.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.31, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/7504baac-aa00-4803-a017-3014eae6ed78' },
  { id: 'aa63ae35-0df9-49ac-bad7-3af3e6d41f16', date: '2026-06-02T16:18:12.000Z', merchant: 'Semrush', category: 'SaaS / Software', amount: 199, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/aa63ae35-0df9-49ac-bad7-3af3e6d41f16' },
  { id: '2b6dd84c-8a03-4ed0-bd0d-16c997afd7b7', date: '2026-06-02T12:09:24.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 200, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/2b6dd84c-8a03-4ed0-bd0d-16c997afd7b7' },
  { id: 'f3d838f3-3405-4744-b25a-8fa3b92f8254', date: '2026-06-02T11:03:31.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.71, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/f3d838f3-3405-4744-b25a-8fa3b92f8254' },
  { id: '551ad157-19a8-47d7-8d66-1654c3cce48f', date: '2026-06-01T19:27:06.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 5.46, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/551ad157-19a8-47d7-8d66-1654c3cce48f' },
  { id: '03334033-cc1d-4e51-b140-e74986ff7982', date: '2026-06-01T17:20:55.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.44, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/03334033-cc1d-4e51-b140-e74986ff7982' },
  { id: 'e13ebca8-c018-4f99-b746-77098824894d', date: '2026-06-01T16:17:14.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 361.39, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/e13ebca8-c018-4f99-b746-77098824894d' },
  { id: '353c1b6a-a5e3-4472-8f9a-1b849626fd69', date: '2026-06-01T11:42:01.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 206.42, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/353c1b6a-a5e3-4472-8f9a-1b849626fd69' },
  { id: '6e8a8673-3a7c-42fe-b084-452a0f719ee0', date: '2026-06-01T11:27:22.000Z', merchant: 'Capterra', category: 'Advertising', amount: 111.25, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/6e8a8673-3a7c-42fe-b084-452a0f719ee0' },
  { id: '6e5f6f94-ea0d-41d2-b999-c5d5bcbf70bf', date: '2026-05-31T20:41:11.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.72, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/6e5f6f94-ea0d-41d2-b999-c5d5bcbf70bf' },
  { id: '9078835f-2883-4bc4-8484-b4e9bc37ac93', date: '2026-05-29T19:57:40.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.62, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/9078835f-2883-4bc4-8484-b4e9bc37ac93' },
  { id: '4f909a08-bbfc-41f9-9c93-1e1d02070c75', date: '2026-05-29T14:03:10.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/4f909a08-bbfc-41f9-9c93-1e1d02070c75' },
  { id: '939a259f-31e6-4135-8793-98fc3dff9d0d', date: '2026-05-29T13:22:31.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 104.82, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/939a259f-31e6-4135-8793-98fc3dff9d0d' },
  { id: '233b4873-96ca-4ba4-84be-cd09abcb7b9c', date: '2026-05-28T21:45:55.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.39, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/233b4873-96ca-4ba4-84be-cd09abcb7b9c' },
  { id: 'a7ef47e0-3589-45dd-b53e-da355afa109f', date: '2026-05-28T13:02:20.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.63, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a7ef47e0-3589-45dd-b53e-da355afa109f' },
  { id: '97fd149a-4e84-4654-b86e-ec109efad78f', date: '2026-05-27T16:55:46.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.8, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/97fd149a-4e84-4654-b86e-ec109efad78f' },
  { id: 'a9ac05f1-1563-4b5c-ba1f-aa8ba0876205', date: '2026-05-27T11:16:00.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.2, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a9ac05f1-1563-4b5c-ba1f-aa8ba0876205' },
  { id: '9f6989f3-9e9e-4708-921f-6e6d81babf17', date: '2026-05-26T13:23:26.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.95, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/9f6989f3-9e9e-4708-921f-6e6d81babf17' },
  { id: '63a1dab6-d106-460f-9034-712c916c13f5', date: '2026-05-25T19:52:16.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/63a1dab6-d106-460f-9034-712c916c13f5' },
  { id: '31ac15d8-baf0-49b4-a7c9-0925e6b011a4', date: '2026-05-25T16:19:42.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.43, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/31ac15d8-baf0-49b4-a7c9-0925e6b011a4' },
  { id: '7074bfa9-9a3e-494a-9c59-5d2ac7e925a3', date: '2026-05-25T01:13:11.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.24, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/7074bfa9-9a3e-494a-9c59-5d2ac7e925a3' },
  { id: '72bf88ad-6108-4de8-ad7c-c2c9fca24718', date: '2026-05-24T03:35:19.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.28, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/72bf88ad-6108-4de8-ad7c-c2c9fca24718' },
  { id: 'dbb746be-f1ca-4438-9fc6-570ac29c0994', date: '2026-05-23T22:03:45.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.58, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/dbb746be-f1ca-4438-9fc6-570ac29c0994' },
  { id: '717cc21e-5217-469a-abbe-0e974b46ca09', date: '2026-05-23T16:04:04.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.67, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/717cc21e-5217-469a-abbe-0e974b46ca09' },
  { id: 'deb4812e-618e-4e2a-ace7-d46e7ecb2301', date: '2026-05-22T21:50:13.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.67, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/deb4812e-618e-4e2a-ace7-d46e7ecb2301' },
  { id: 'd33f2675-6c47-4a2a-8a1e-a498f84e65ae', date: '2026-05-22T01:44:29.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 103.48, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/d33f2675-6c47-4a2a-8a1e-a498f84e65ae' },
  { id: 'bc631407-4ea2-420c-888f-82dcfd5990d6', date: '2026-05-21T17:36:27.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.01, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/bc631407-4ea2-420c-888f-82dcfd5990d6' },
  { id: '642b5a05-062f-4164-9db8-04d140f203f6', date: '2026-05-21T11:54:17.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 101.82, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/642b5a05-062f-4164-9db8-04d140f203f6' },
  { id: '99f915ac-b73a-4c57-b2a0-45de7c452279', date: '2026-05-20T21:10:26.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.56, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/99f915ac-b73a-4c57-b2a0-45de7c452279' },
  { id: 'eaf6037f-0860-467d-94e3-150a504cdf85', date: '2026-05-20T14:56:45.000Z', merchant: 'Anthropic', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/eaf6037f-0860-467d-94e3-150a504cdf85' },
  { id: '47629a65-cb74-4a46-9aa0-4c510983a5bc', date: '2026-05-20T12:30:46.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 102.73, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/47629a65-cb74-4a46-9aa0-4c510983a5bc' },
  { id: 'f66f353b-c43e-4cce-9845-346bbb0082db', date: '2026-05-19T17:44:52.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.82, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/f66f353b-c43e-4cce-9845-346bbb0082db' },
  { id: 'b9343b7a-62c8-4d7f-99f0-cf855046b078', date: '2026-05-19T10:34:21.000Z', merchant: 'Empowerkit', category: 'SaaS / Software', amount: 14.95, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/b9343b7a-62c8-4d7f-99f0-cf855046b078' },
  { id: 'e6d81c15-f3d0-4880-b836-8a65dfbfe586', date: '2026-05-17T22:51:30.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 500, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/e6d81c15-f3d0-4880-b836-8a65dfbfe586' },
  { id: 'ff495d72-b021-4f5f-9057-9c4422d0cea2', date: '2026-05-17T20:53:36.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.04, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/ff495d72-b021-4f5f-9057-9c4422d0cea2' },
  { id: '679eaff8-9513-4bf1-890c-bf815fc93a28', date: '2026-05-16T20:16:06.000Z', merchant: 'Vercel', category: 'SaaS / Software', amount: 40, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/679eaff8-9513-4bf1-890c-bf815fc93a28' },
  { id: '19e69bd4-4e3e-42cd-aebc-c3af7fe1d9e6', date: '2026-05-16T11:39:46.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 111.44, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/19e69bd4-4e3e-42cd-aebc-c3af7fe1d9e6' },
  { id: 'f13866a4-17ce-45c1-815f-7ebf2a268d3d', date: '2026-05-15T18:15:44.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.64, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/f13866a4-17ce-45c1-815f-7ebf2a268d3d' },
  { id: 'a93b4386-bc11-42bc-8d37-8ea93fe208a9', date: '2026-05-15T13:42:58.000Z', merchant: 'Apollo.io', category: 'SaaS / Software', amount: 396, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/a93b4386-bc11-42bc-8d37-8ea93fe208a9' },
  { id: '18dbe8c2-573c-4745-a9a2-606f764bdb7b', date: '2026-05-15T13:18:46.000Z', merchant: 'Calendly', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/18dbe8c2-573c-4745-a9a2-606f764bdb7b' },
  { id: '70dc32d4-fde1-43ab-abc5-4c6775c70856', date: '2026-05-14T20:54:53.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 50, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/70dc32d4-fde1-43ab-abc5-4c6775c70856' },
  { id: 'acdecfef-ca1e-4926-ad45-88631c5a2abf', date: '2026-05-12T13:23:37.000Z', merchant: 'Phantombuster', category: 'SaaS / Software', amount: 159, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/acdecfef-ca1e-4926-ad45-88631c5a2abf' },
  { id: '0925f3d2-5160-4f24-9a73-7e58c0faf520', date: '2026-05-11T16:22:22.000Z', merchant: 'Buffer', category: 'SaaS / Software', amount: 18, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/0925f3d2-5160-4f24-9a73-7e58c0faf520' },
  { id: 'acae9340-4959-44e0-af19-f0794d8364b7', date: '2026-05-10T18:27:28.000Z', merchant: 'Phantombuster', category: 'SaaS / Software', amount: 69, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/acae9340-4959-44e0-af19-f0794d8364b7' },
  { id: 'b924f639-3d65-42e6-9cfb-1fb67252f6c1', date: '2026-05-09T20:47:02.000Z', merchant: 'Zapier', category: 'SaaS / Software', amount: 58.5, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/b924f639-3d65-42e6-9cfb-1fb67252f6c1' },
  { id: 'e7384e9b-c3d0-4658-9446-c1698fbf7e18', date: '2026-05-08T18:15:34.000Z', merchant: 'Adobe', category: 'SaaS / Software', amount: 36.98, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/e7384e9b-c3d0-4658-9446-c1698fbf7e18' },
  { id: '50c78ca9-68cd-42de-a41e-99736b241d68', date: '2026-05-08T15:08:37.000Z', merchant: 'Figma', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/50c78ca9-68cd-42de-a41e-99736b241d68' },
  { id: '19898a4d-2fd9-4978-a237-f22bd9a8059f', date: '2026-05-05T21:50:00.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 49.99, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/19898a4d-2fd9-4978-a237-f22bd9a8059f' },
  { id: '9019bf94-9e87-449a-bc37-f1dff23d17b5', date: '2026-05-04T17:38:15.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/9019bf94-9e87-449a-bc37-f1dff23d17b5' },
  { id: '2062fbaf-eb4c-4062-83d9-ee398d42c712', date: '2026-05-04T15:10:20.000Z', merchant: 'Smallpdf', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/2062fbaf-eb4c-4062-83d9-ee398d42c712' },
  { id: '478fd6a4-24fb-47f9-97e2-c0bbf10ce16f', date: '2026-05-04T11:11:43.000Z', merchant: 'Supabase', category: 'SaaS / Software', amount: 34.35, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/478fd6a4-24fb-47f9-97e2-c0bbf10ce16f' },
  { id: '966a580f-dc97-4ebc-ad81-69bd02d69df3', date: '2026-05-03T16:45:17.000Z', merchant: 'Canva', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/966a580f-dc97-4ebc-ad81-69bd02d69df3' },
  { id: '3cadaf9d-2c1c-4978-a460-96941470b7a9', date: '2026-05-03T12:22:29.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 11.96, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/3cadaf9d-2c1c-4978-a460-96941470b7a9' },
  { id: 'd75d2003-53da-4212-af76-d20dbefbc364', date: '2026-05-02T12:09:49.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 200, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/d75d2003-53da-4212-af76-d20dbefbc364' },
  { id: '5d46a0df-f594-42b2-8607-0bd73183991f', date: '2026-05-01T19:38:25.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.02, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/5d46a0df-f594-42b2-8607-0bd73183991f' },
  { id: 'ff88f674-a18e-4c03-9d4b-b0eaa1eb2bd9', date: '2026-05-01T19:36:48.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 371.92, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/ff88f674-a18e-4c03-9d4b-b0eaa1eb2bd9' },
  { id: '002ad652-0e9b-41d5-aba1-d7616dc0c2a7', date: '2026-05-01T12:42:01.000Z', merchant: 'Capterra', category: 'Advertising', amount: 99.25, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/002ad652-0e9b-41d5-aba1-d7616dc0c2a7' },
  { id: '9191771f-4122-42a4-a4a1-f2a04cf6ee0d', date: '2026-04-29T23:18:58.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 101.94, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/9191771f-4122-42a4-a4a1-f2a04cf6ee0d' },
  { id: '540dbd22-8d3b-483c-8151-9ee4873898fd', date: '2026-04-29T14:03:36.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/540dbd22-8d3b-483c-8151-9ee4873898fd' },
  { id: '956ae879-a85b-4b9f-8ec8-ae7af80e90ef', date: '2026-04-28T03:24:44.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 106.81, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/956ae879-a85b-4b9f-8ec8-ae7af80e90ef' },
  { id: '83a46ece-86a6-4db5-a5e4-9747c244f023', date: '2026-04-26T21:03:13.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 100.73, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/83a46ece-86a6-4db5-a5e4-9747c244f023' },
  { id: 'f1e6771c-f025-4148-813e-9e0d1d921293', date: '2026-04-20T14:55:40.000Z', merchant: 'Anthropic', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/f1e6771c-f025-4148-813e-9e0d1d921293' },
  { id: '05e8beae-2612-4703-9a2b-9ded386e3d79', date: '2026-04-19T10:34:21.000Z', merchant: 'Empowerkit', category: 'SaaS / Software', amount: 14.95, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/05e8beae-2612-4703-9a2b-9ded386e3d79' },
  { id: '43fc5f01-b5f7-4c20-813f-660167024f92', date: '2026-04-17T09:02:12.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 500, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/43fc5f01-b5f7-4c20-813f-660167024f92' },
  { id: 'f80d232e-d1b4-499e-8e0a-4dfa841ad843', date: '2026-04-16T20:43:35.000Z', merchant: 'Vercel', category: 'SaaS / Software', amount: 40, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/f80d232e-d1b4-499e-8e0a-4dfa841ad843' },
  { id: '08ca60ad-7919-4003-818b-1564ff105df8', date: '2026-04-15T13:42:26.000Z', merchant: 'Apollo.io', category: 'SaaS / Software', amount: 396, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/08ca60ad-7919-4003-818b-1564ff105df8' },
  { id: '8092ea57-8eb7-4969-929e-1086cadbeaa8', date: '2026-04-15T13:18:32.000Z', merchant: 'Calendly', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/8092ea57-8eb7-4969-929e-1086cadbeaa8' },
  { id: '1b8d5443-05e4-4d82-98a9-ac4fd262c5b4', date: '2026-04-14T20:54:27.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 46.09, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/1b8d5443-05e4-4d82-98a9-ac4fd262c5b4' },
  { id: '4d621d65-58d1-4ccc-b225-e466f8fde11c', date: '2026-04-12T13:23:08.000Z', merchant: 'Phantombuster', category: 'SaaS / Software', amount: 159, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/4d621d65-58d1-4ccc-b225-e466f8fde11c' },
  { id: '0302da1a-9729-448c-9c52-00765235c10c', date: '2026-04-11T16:23:17.000Z', merchant: 'Buffer', category: 'SaaS / Software', amount: 18, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/0302da1a-9729-448c-9c52-00765235c10c' },
  { id: '72be6cf0-25bd-46c0-b2fa-b353071718a9', date: '2026-04-10T18:27:47.000Z', merchant: 'Phantombuster', category: 'SaaS / Software', amount: 69, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/72be6cf0-25bd-46c0-b2fa-b353071718a9' },
  { id: 'c179e75b-46a6-45f3-88c9-c1185e704cba', date: '2026-04-09T20:47:07.000Z', merchant: 'Zapier', category: 'SaaS / Software', amount: 58.5, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/c179e75b-46a6-45f3-88c9-c1185e704cba' },
  { id: 'b7422d49-8a02-4d42-8334-231cab0ed3d9', date: '2026-04-08T15:05:56.000Z', merchant: 'Figma', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/b7422d49-8a02-4d42-8334-231cab0ed3d9' },
  { id: '53e51c64-6fdb-4d52-8723-1bea624e2390', date: '2026-04-08T12:08:03.000Z', merchant: 'Adobe', category: 'SaaS / Software', amount: 36.98, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/53e51c64-6fdb-4d52-8723-1bea624e2390' },
  { id: '87da2663-fb4a-49b8-9156-2558a58c66e1', date: '2026-04-05T21:50:26.000Z', merchant: 'LinkedIn', category: 'SaaS / Software', amount: 49.99, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/87da2663-fb4a-49b8-9156-2558a58c66e1' },
  { id: 'edf0b780-c7ab-40d1-ba9a-12153f34ee2e', date: '2026-04-04T16:51:43.000Z', merchant: 'OpenAI', category: 'SaaS / Software', amount: 20, spentBy: 'Stephen Newman', memo: 'data', link: 'https://app.ramp.com/business-overview/transactions/edf0b780-c7ab-40d1-ba9a-12153f34ee2e' },
  { id: '6dfd5c2e-5864-4126-b94d-2977da3efa20', date: '2026-04-04T15:10:21.000Z', merchant: 'Smallpdf', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/6dfd5c2e-5864-4126-b94d-2977da3efa20' },
  { id: 'd0bd1c3d-8d88-482f-821d-0a844ce1d989', date: '2026-04-04T11:46:42.000Z', merchant: 'Supabase', category: 'SaaS / Software', amount: 34.97, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/d0bd1c3d-8d88-482f-821d-0a844ce1d989' },
  { id: '008f1512-7801-4040-9562-b5ee57abd5e5', date: '2026-04-03T16:45:13.000Z', merchant: 'Canva', category: 'SaaS / Software', amount: 15, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/008f1512-7801-4040-9562-b5ee57abd5e5' },
  { id: 'c0fb2393-4a40-40f9-9d32-1592bcbe4ef7', date: '2026-04-03T12:23:18.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 94.1, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/c0fb2393-4a40-40f9-9d32-1592bcbe4ef7' },
  { id: 'cfcc54e6-1b29-4eff-a7ec-d25b95c5b550', date: '2026-04-02T12:09:18.000Z', merchant: 'Cursor', category: 'SaaS / Software', amount: 200, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/cfcc54e6-1b29-4eff-a7ec-d25b95c5b550' },
  { id: '6612e645-a5b2-41dc-a677-a87b98591137', date: '2026-04-01T18:08:27.000Z', merchant: 'Google Ads', category: 'Advertising', amount: 372.34, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/6612e645-a5b2-41dc-a677-a87b98591137' },
  { id: '856e5f66-10a9-441d-9907-e9dc46250c01', date: '2026-04-01T13:07:40.000Z', merchant: 'Capterra', category: 'Advertising', amount: 38.75, spentBy: 'Stephen Newman', memo: null, link: 'https://app.ramp.com/business-overview/transactions/856e5f66-10a9-441d-9907-e9dc46250c01' },
];

// ---------------------------------------------------------------------------
// Rollups — computed from the transactions array (no hardcoded totals)
// ---------------------------------------------------------------------------

export interface SpendGroup {
  key: string;
  category?: string;
  total: number;
  count: number;
}

export interface RampSummary {
  total: number;
  count: number;
  vendorCount: number;
  categoryCount: number;
  avgTransaction: number;
}

export function summarize(txns: RampTransaction[] = rampTransactions): RampSummary {
  const total = txns.reduce((sum, t) => sum + t.amount, 0);
  const vendors = new Set(txns.map((t) => t.merchant));
  const categories = new Set(txns.map((t) => t.category));
  return {
    total,
    count: txns.length,
    vendorCount: vendors.size,
    categoryCount: categories.size,
    avgTransaction: txns.length > 0 ? total / txns.length : 0,
  };
}

export function spendByCategory(txns: RampTransaction[] = rampTransactions): SpendGroup[] {
  const map = new Map<string, SpendGroup>();
  for (const t of txns) {
    const g = map.get(t.category) || { key: t.category, total: 0, count: 0 };
    g.total += t.amount;
    g.count += 1;
    map.set(t.category, g);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

// ---------------------------------------------------------------------------
// Custom spend groups — business-level organization of vendors
// ---------------------------------------------------------------------------

const GROUP_ORDER = ['Channels', 'Sales Tools', 'Mktg Tools', 'AI Development', 'Other'] as const;

const VENDOR_GROUPS: Record<string, string> = {
  'Google Ads': 'Channels',
  LinkedIn: 'Channels',
  OpenAI: 'Channels',
  Capterra: 'Channels',
  'Apollo.io': 'Sales Tools',
  Phantombuster: 'Sales Tools',
  Semrush: 'Mktg Tools',
  Zapier: 'Mktg Tools',
  Adobe: 'Mktg Tools',
  Smallpdf: 'Mktg Tools',
  Canva: 'Mktg Tools',
  Calendly: 'Mktg Tools',
  Figma: 'Mktg Tools',
  Buffer: 'Mktg Tools',
  Empowerkit: 'Mktg Tools',
  Cursor: 'AI Development',
  Supabase: 'AI Development',
  Vercel: 'AI Development',
  Anthropic: 'AI Development',
};

export function vendorGroup(merchant: string): string {
  return VENDOR_GROUPS[merchant] || 'Other';
}

export interface CustomSpendGroup {
  key: string;
  total: number;
  count: number;
  vendors: SpendGroup[];
}

export function spendByCustomGroup(txns: RampTransaction[] = rampTransactions): CustomSpendGroup[] {
  const groups = new Map<string, CustomSpendGroup>();
  for (const t of txns) {
    const key = vendorGroup(t.merchant);
    const g = groups.get(key) || { key, total: 0, count: 0, vendors: [] };
    g.total += t.amount;
    g.count += 1;
    let v = g.vendors.find((x) => x.key === t.merchant);
    if (!v) {
      v = { key: t.merchant, total: 0, count: 0 };
      g.vendors.push(v);
    }
    v.total += t.amount;
    v.count += 1;
    groups.set(key, g);
  }
  for (const g of groups.values()) g.vendors.sort((a, b) => b.total - a.total);
  return [...groups.values()].sort(
    (a, b) => GROUP_ORDER.indexOf(a.key as (typeof GROUP_ORDER)[number]) - GROUP_ORDER.indexOf(b.key as (typeof GROUP_ORDER)[number])
  );
}

export function spendByVendor(txns: RampTransaction[] = rampTransactions): SpendGroup[] {
  const map = new Map<string, SpendGroup>();
  for (const t of txns) {
    const g = map.get(t.merchant) || { key: t.merchant, category: t.category, total: 0, count: 0 };
    g.total += t.amount;
    g.count += 1;
    map.set(t.merchant, g);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}
