import { sql } from './db';

// ============================================
// Table initialization
// ============================================

export async function initializeNurtureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS nurture_tracks (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_steps (
      id SERIAL PRIMARY KEY,
      track_id INTEGER REFERENCES nurture_tracks(id) ON DELETE CASCADE,
      step_number INTEGER NOT NULL,
      delay_days INTEGER NOT NULL,
      subject_template TEXT NOT NULL,
      body_template TEXT NOT NULL,
      content_tags JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(track_id, step_number)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_enrollments (
      id SERIAL PRIMARY KEY,
      track_id INTEGER REFERENCES nurture_tracks(id),
      contact_email VARCHAR(255) NOT NULL,
      contact_name VARCHAR(255) NOT NULL,
      company_name VARCHAR(255),
      vertical VARCHAR(100),
      account_context TEXT,
      loss_reason VARCHAR(100),
      persona_type VARCHAR(50),
      persona_function VARCHAR(100),
      email_count INTEGER DEFAULT 6,
      period_days INTEGER DEFAULT 90,
      enrolled_by INTEGER,
      enrolled_by_email VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      current_step INTEGER DEFAULT 0,
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      next_send_at TIMESTAMP,
      paused_at TIMESTAMP,
      completed_at TIMESTAMP
    )
  `;

  // Migrate existing tables
  await sql`ALTER TABLE nurture_enrollments ADD COLUMN IF NOT EXISTS persona_type VARCHAR(50)`;
  await sql`ALTER TABLE nurture_enrollments ADD COLUMN IF NOT EXISTS persona_function VARCHAR(100)`;
  await sql`ALTER TABLE nurture_enrollments ADD COLUMN IF NOT EXISTS email_count INTEGER DEFAULT 6`;
  await sql`ALTER TABLE nurture_enrollments ADD COLUMN IF NOT EXISTS period_days INTEGER DEFAULT 90`;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_sends (
      id SERIAL PRIMARY KEY,
      enrollment_id INTEGER REFERENCES nurture_enrollments(id) ON DELETE CASCADE,
      step_id INTEGER REFERENCES nurture_steps(id),
      resend_message_id VARCHAR(255),
      subject_sent TEXT,
      body_sent TEXT,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_events (
      id SERIAL PRIMARY KEY,
      send_id INTEGER REFERENCES nurture_sends(id) ON DELETE CASCADE,
      resend_message_id VARCHAR(255),
      event_type VARCHAR(50) NOT NULL,
      clicked_url TEXT,
      event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_suppression (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      reason VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_content (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      url TEXT NOT NULL,
      source VARCHAR(100) NOT NULL,
      vertical_tags JSONB DEFAULT '[]',
      topic_tags JSONB DEFAULT '[]',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nurture_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  // Default settings
  await sql`
    INSERT INTO nurture_settings (key, value)
    VALUES ('global_pause', 'false')
    ON CONFLICT (key) DO NOTHING
  `;
  await sql`
    INSERT INTO nurture_settings (key, value)
    VALUES ('daily_send_cap', '50')
    ON CONFLICT (key) DO NOTHING
  `;
  await sql`
    INSERT INTO nurture_settings (key, value)
    VALUES ('recap_recipients', 'stephen.newman@checkit.net')
    ON CONFLICT (key) DO NOTHING
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_nurture_enrollments_status ON nurture_enrollments(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nurture_enrollments_next_send ON nurture_enrollments(next_send_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nurture_sends_enrollment ON nurture_sends(enrollment_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nurture_sends_resend_id ON nurture_sends(resend_message_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nurture_events_send ON nurture_events(send_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nurture_suppression_email ON nurture_suppression(email)`;
}

// ============================================
// Track operations
// ============================================

export interface NurtureTrack {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_by: number | null;
  created_at: string;
}

export async function getNurtureTracks(): Promise<NurtureTrack[]> {
  const result = await sql`
    SELECT * FROM nurture_tracks ORDER BY created_at DESC
  `;
  return result as NurtureTrack[];
}

export async function getNurtureTrack(id: number): Promise<NurtureTrack | null> {
  const result = await sql`SELECT * FROM nurture_tracks WHERE id = ${id}`;
  return (result[0] as NurtureTrack) || null;
}

export async function createNurtureTrack(name: string, description: string, createdBy?: number): Promise<NurtureTrack> {
  const result = await sql`
    INSERT INTO nurture_tracks (name, description, created_by)
    VALUES (${name}, ${description}, ${createdBy || null})
    RETURNING *
  `;
  return result[0] as NurtureTrack;
}

export async function updateTrackStatus(id: number, status: string): Promise<void> {
  await sql`UPDATE nurture_tracks SET status = ${status} WHERE id = ${id}`;
}

// ============================================
// Step operations
// ============================================

export interface NurtureStep {
  id: number;
  track_id: number;
  step_number: number;
  delay_days: number;
  subject_template: string;
  body_template: string;
  content_tags: string[];
  created_at: string;
}

export async function getTrackSteps(trackId: number): Promise<NurtureStep[]> {
  const result = await sql`
    SELECT * FROM nurture_steps WHERE track_id = ${trackId} ORDER BY step_number
  `;
  return result as NurtureStep[];
}

export async function getStep(trackId: number, stepNumber: number): Promise<NurtureStep | null> {
  const result = await sql`
    SELECT * FROM nurture_steps
    WHERE track_id = ${trackId} AND step_number = ${stepNumber}
  `;
  return (result[0] as NurtureStep) || null;
}

export async function createNurtureStep(
  trackId: number,
  stepNumber: number,
  delayDays: number,
  subjectTemplate: string,
  bodyTemplate: string,
  contentTags: string[] = []
): Promise<NurtureStep> {
  const result = await sql`
    INSERT INTO nurture_steps (track_id, step_number, delay_days, subject_template, body_template, content_tags)
    VALUES (${trackId}, ${stepNumber}, ${delayDays}, ${subjectTemplate}, ${bodyTemplate}, ${JSON.stringify(contentTags)})
    ON CONFLICT (track_id, step_number) DO UPDATE SET
      delay_days = EXCLUDED.delay_days,
      subject_template = EXCLUDED.subject_template,
      body_template = EXCLUDED.body_template,
      content_tags = EXCLUDED.content_tags
    RETURNING *
  `;
  return result[0] as NurtureStep;
}

// ============================================
// Enrollment operations
// ============================================

export interface NurtureEnrollment {
  id: number;
  track_id: number;
  contact_email: string;
  contact_name: string;
  company_name: string | null;
  vertical: string | null;
  account_context: string | null;
  loss_reason: string | null;
  persona_type: string | null;
  persona_function: string | null;
  email_count: number;
  period_days: number;
  enrolled_by: number | null;
  enrolled_by_email: string | null;
  status: string;
  current_step: number;
  enrolled_at: string;
  next_send_at: string | null;
  paused_at: string | null;
  completed_at: string | null;
}

export interface EnrollContactInput {
  trackId: number;
  contactEmail: string;
  contactName: string;
  companyName?: string;
  vertical?: string;
  accountContext?: string;
  lossReason?: string;
  personaType?: string;
  personaFunction?: string;
  emailCount?: number;
  periodDays?: number;
  enrolledBy?: number;
  enrolledByEmail?: string;
}

export async function enrollContact(input: EnrollContactInput): Promise<NurtureEnrollment> {
  const result = await sql`
    INSERT INTO nurture_enrollments (
      track_id, contact_email, contact_name, company_name,
      vertical, account_context, loss_reason,
      persona_type, persona_function, email_count, period_days,
      enrolled_by, enrolled_by_email
    )
    VALUES (
      ${input.trackId}, ${input.contactEmail}, ${input.contactName},
      ${input.companyName || null}, ${input.vertical || null},
      ${input.accountContext || null}, ${input.lossReason || null},
      ${input.personaType || null}, ${input.personaFunction || null},
      ${input.emailCount || 6}, ${input.periodDays || 90},
      ${input.enrolledBy || null}, ${input.enrolledByEmail || null}
    )
    RETURNING *
  `;
  return result[0] as NurtureEnrollment;
}

export async function getEnrollments(filters?: {
  status?: string;
  enrolledBy?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ enrollments: NurtureEnrollment[]; total: number }> {
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  let enrollments: NurtureEnrollment[];
  let totalResult;

  if (filters?.status && filters?.search) {
    const search = `%${filters.search}%`;
    enrollments = await sql`
      SELECT * FROM nurture_enrollments
      WHERE status = ${filters.status}
        AND (contact_name ILIKE ${search} OR contact_email ILIKE ${search} OR company_name ILIKE ${search})
      ORDER BY enrolled_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as NurtureEnrollment[];
    totalResult = await sql`
      SELECT COUNT(*) as count FROM nurture_enrollments
      WHERE status = ${filters.status}
        AND (contact_name ILIKE ${search} OR contact_email ILIKE ${search} OR company_name ILIKE ${search})
    `;
  } else if (filters?.status) {
    enrollments = await sql`
      SELECT * FROM nurture_enrollments
      WHERE status = ${filters.status}
      ORDER BY enrolled_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as NurtureEnrollment[];
    totalResult = await sql`
      SELECT COUNT(*) as count FROM nurture_enrollments WHERE status = ${filters.status}
    `;
  } else if (filters?.search) {
    const search = `%${filters.search}%`;
    enrollments = await sql`
      SELECT * FROM nurture_enrollments
      WHERE contact_name ILIKE ${search} OR contact_email ILIKE ${search} OR company_name ILIKE ${search}
      ORDER BY enrolled_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as NurtureEnrollment[];
    totalResult = await sql`
      SELECT COUNT(*) as count FROM nurture_enrollments
      WHERE contact_name ILIKE ${search} OR contact_email ILIKE ${search} OR company_name ILIKE ${search}
    `;
  } else {
    enrollments = await sql`
      SELECT * FROM nurture_enrollments
      ORDER BY enrolled_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as NurtureEnrollment[];
    totalResult = await sql`SELECT COUNT(*) as count FROM nurture_enrollments`;
  }

  return {
    enrollments,
    total: parseInt(totalResult[0]?.count || '0'),
  };
}

export async function getEnrollment(id: number): Promise<NurtureEnrollment | null> {
  const result = await sql`SELECT * FROM nurture_enrollments WHERE id = ${id}`;
  return (result[0] as NurtureEnrollment) || null;
}

export async function updateEnrollmentStatus(id: number, status: string): Promise<NurtureEnrollment | null> {
  let result;
  if (status === 'paused') {
    result = await sql`
      UPDATE nurture_enrollments SET status = ${status}, paused_at = NOW() WHERE id = ${id} RETURNING *
    `;
  } else if (status === 'completed') {
    result = await sql`
      UPDATE nurture_enrollments SET status = ${status}, completed_at = NOW() WHERE id = ${id} RETURNING *
    `;
  } else if (status === 'active') {
    result = await sql`
      UPDATE nurture_enrollments SET status = ${status}, paused_at = NULL WHERE id = ${id} RETURNING *
    `;
  } else {
    result = await sql`
      UPDATE nurture_enrollments SET status = ${status} WHERE id = ${id} RETURNING *
    `;
  }
  return (result[0] as NurtureEnrollment) || null;
}

export async function advanceEnrollmentStep(id: number, nextSendAt: string | null): Promise<void> {
  if (nextSendAt) {
    await sql`
      UPDATE nurture_enrollments
      SET current_step = current_step + 1, next_send_at = ${nextSendAt}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      UPDATE nurture_enrollments
      SET current_step = current_step + 1, next_send_at = NULL, status = 'completed', completed_at = NOW()
      WHERE id = ${id}
    `;
  }
}

export async function getDueEnrollments(limit: number): Promise<NurtureEnrollment[]> {
  const result = await sql`
    SELECT e.* FROM nurture_enrollments e
    JOIN nurture_tracks t ON t.id = e.track_id
    WHERE e.status = 'active'
      AND e.next_send_at <= NOW()
      AND t.status = 'active'
    ORDER BY e.next_send_at ASC
    LIMIT ${limit}
  `;
  return result as NurtureEnrollment[];
}

export async function checkDuplicateEnrollment(email: string, trackId: number): Promise<NurtureEnrollment | null> {
  const result = await sql`
    SELECT * FROM nurture_enrollments
    WHERE contact_email = ${email} AND track_id = ${trackId} AND status IN ('active', 'paused')
  `;
  return (result[0] as NurtureEnrollment) || null;
}

// ============================================
// Send operations
// ============================================

export interface NurtureSend {
  id: number;
  enrollment_id: number;
  step_id: number;
  resend_message_id: string | null;
  subject_sent: string | null;
  body_sent: string | null;
  sent_at: string;
}

export async function createNurtureSend(
  enrollmentId: number,
  stepId: number,
  resendMessageId: string,
  subjectSent: string,
  bodySent: string
): Promise<NurtureSend> {
  const result = await sql`
    INSERT INTO nurture_sends (enrollment_id, step_id, resend_message_id, subject_sent, body_sent)
    VALUES (${enrollmentId}, ${stepId}, ${resendMessageId}, ${subjectSent}, ${bodySent})
    RETURNING *
  `;
  return result[0] as NurtureSend;
}

export async function getSendsForEnrollment(enrollmentId: number): Promise<NurtureSend[]> {
  const result = await sql`
    SELECT * FROM nurture_sends WHERE enrollment_id = ${enrollmentId} ORDER BY sent_at DESC
  `;
  return result as NurtureSend[];
}

export async function getSendByResendId(resendMessageId: string): Promise<NurtureSend | null> {
  const result = await sql`
    SELECT * FROM nurture_sends WHERE resend_message_id = ${resendMessageId}
  `;
  return (result[0] as NurtureSend) || null;
}

// ============================================
// Event operations
// ============================================

export interface NurtureEvent {
  id: number;
  send_id: number;
  resend_message_id: string | null;
  event_type: string;
  clicked_url: string | null;
  event_timestamp: string;
}

export async function createNurtureEvent(
  sendId: number,
  resendMessageId: string,
  eventType: string,
  clickedUrl?: string
): Promise<NurtureEvent> {
  const result = await sql`
    INSERT INTO nurture_events (send_id, resend_message_id, event_type, clicked_url)
    VALUES (${sendId}, ${resendMessageId}, ${eventType}, ${clickedUrl || null})
    RETURNING *
  `;
  return result[0] as NurtureEvent;
}

export async function getEventsForEnrollment(enrollmentId: number): Promise<NurtureEvent[]> {
  const result = await sql`
    SELECT ne.* FROM nurture_events ne
    JOIN nurture_sends ns ON ns.id = ne.send_id
    WHERE ns.enrollment_id = ${enrollmentId}
    ORDER BY ne.event_timestamp DESC
  `;
  return result as NurtureEvent[];
}

// ============================================
// Suppression list
// ============================================

export async function addToSuppression(email: string, reason: string): Promise<void> {
  await sql`
    INSERT INTO nurture_suppression (email, reason)
    VALUES (${email}, ${reason})
    ON CONFLICT (email) DO NOTHING
  `;
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const result = await sql`SELECT id FROM nurture_suppression WHERE email = ${email}`;
  return result.length > 0;
}

export async function removeFromSuppression(email: string): Promise<void> {
  await sql`DELETE FROM nurture_suppression WHERE email = ${email}`;
}

// ============================================
// Content library
// ============================================

export interface NurtureContent {
  id: number;
  title: string;
  url: string;
  source: string;
  vertical_tags: string[];
  topic_tags: string[];
  description: string | null;
  created_at: string;
}

export async function getNurtureContent(filters?: {
  vertical?: string;
  topic?: string;
}): Promise<NurtureContent[]> {
  if (filters?.vertical && filters?.topic) {
    const result = await sql`
      SELECT * FROM nurture_content
      WHERE vertical_tags @> ${JSON.stringify([filters.vertical])}::jsonb
        AND topic_tags @> ${JSON.stringify([filters.topic])}::jsonb
      ORDER BY created_at DESC
    `;
    return result as NurtureContent[];
  } else if (filters?.vertical) {
    const result = await sql`
      SELECT * FROM nurture_content
      WHERE vertical_tags @> ${JSON.stringify([filters.vertical])}::jsonb
      ORDER BY created_at DESC
    `;
    return result as NurtureContent[];
  } else if (filters?.topic) {
    const result = await sql`
      SELECT * FROM nurture_content
      WHERE topic_tags @> ${JSON.stringify([filters.topic])}::jsonb
      ORDER BY created_at DESC
    `;
    return result as NurtureContent[];
  }
  const result = await sql`SELECT * FROM nurture_content ORDER BY created_at DESC`;
  return result as NurtureContent[];
}

export async function addNurtureContent(
  title: string,
  url: string,
  source: string,
  verticalTags: string[],
  topicTags: string[],
  description?: string
): Promise<NurtureContent> {
  const result = await sql`
    INSERT INTO nurture_content (title, url, source, vertical_tags, topic_tags, description)
    VALUES (${title}, ${url}, ${source}, ${JSON.stringify(verticalTags)}, ${JSON.stringify(topicTags)}, ${description || null})
    ON CONFLICT DO NOTHING
    RETURNING *
  `;
  return result[0] as NurtureContent;
}

// ============================================
// Settings
// ============================================

export async function getNurtureSetting(key: string): Promise<string | null> {
  const result = await sql`SELECT value FROM nurture_settings WHERE key = ${key}`;
  return result[0]?.value || null;
}

export async function setNurtureSetting(key: string, value: string): Promise<void> {
  await sql`
    INSERT INTO nurture_settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

export async function getAllNurtureSettings(): Promise<Record<string, string>> {
  const result = await sql`SELECT key, value FROM nurture_settings`;
  const settings: Record<string, string> = {};
  for (const row of result) {
    settings[row.key] = row.value;
  }
  return settings;
}

// ============================================
// Stats / Dashboard queries
// ============================================

export async function getNurtureStats() {
  const activeResult = await sql`
    SELECT COUNT(*) as count FROM nurture_enrollments WHERE status = 'active'
  `;
  const totalResult = await sql`
    SELECT COUNT(*) as count FROM nurture_enrollments
  `;
  const sentWeekResult = await sql`
    SELECT COUNT(*) as count FROM nurture_sends WHERE sent_at >= NOW() - INTERVAL '7 days'
  `;
  const openResult = await sql`
    SELECT
      COUNT(DISTINCT ns.id) FILTER (WHERE ne.event_type = 'opened') as opened,
      COUNT(DISTINCT ns.id) as total
    FROM nurture_sends ns
    LEFT JOIN nurture_events ne ON ne.send_id = ns.id
    WHERE ns.sent_at >= NOW() - INTERVAL '30 days'
  `;
  const clickResult = await sql`
    SELECT
      COUNT(DISTINCT ns.id) FILTER (WHERE ne.event_type = 'clicked') as clicked,
      COUNT(DISTINCT ns.id) as total
    FROM nurture_sends ns
    LEFT JOIN nurture_events ne ON ne.send_id = ns.id
    WHERE ns.sent_at >= NOW() - INTERVAL '30 days'
  `;

  const totalSent = parseInt(openResult[0]?.total || '0');

  return {
    activeEnrollments: parseInt(activeResult[0]?.count || '0'),
    totalEnrollments: parseInt(totalResult[0]?.count || '0'),
    emailsSent7d: parseInt(sentWeekResult[0]?.count || '0'),
    openRate: totalSent > 0 ? Math.round((parseInt(openResult[0]?.opened || '0') / totalSent) * 100) : 0,
    clickRate: totalSent > 0 ? Math.round((parseInt(clickResult[0]?.clicked || '0') / totalSent) * 100) : 0,
  };
}

export async function getEnrollmentDetail(enrollmentId: number) {
  const enrollment = await getEnrollment(enrollmentId);
  if (!enrollment) return null;

  const sends = await getSendsForEnrollment(enrollmentId);
  const events = await getEventsForEnrollment(enrollmentId);

  const sendsWithEvents = sends.map((send) => ({
    ...send,
    events: events.filter((e) => e.send_id === send.id),
  }));

  return { enrollment, sends: sendsWithEvents };
}

export async function getRecapData() {
  const sentResult = await sql`
    SELECT COUNT(*) as count FROM nurture_sends WHERE sent_at >= NOW() - INTERVAL '24 hours'
  `;
  const eventsResult = await sql`
    SELECT event_type, COUNT(*) as count
    FROM nurture_events
    WHERE event_timestamp >= NOW() - INTERVAL '24 hours'
    GROUP BY event_type
  `;
  const newEnrollmentsResult = await sql`
    SELECT COUNT(*) as count FROM nurture_enrollments WHERE enrolled_at >= NOW() - INTERVAL '24 hours'
  `;
  const completedResult = await sql`
    SELECT COUNT(*) as count FROM nurture_enrollments
    WHERE completed_at >= NOW() - INTERVAL '24 hours' AND status = 'completed'
  `;
  const topEngaged = await sql`
    SELECT
      e.contact_name, e.company_name, e.contact_email,
      COUNT(DISTINCT ne.id) FILTER (WHERE ne.event_type = 'opened') as opens,
      COUNT(DISTINCT ne.id) FILTER (WHERE ne.event_type = 'clicked') as clicks
    FROM nurture_enrollments e
    JOIN nurture_sends ns ON ns.enrollment_id = e.id
    JOIN nurture_events ne ON ne.send_id = ns.id
    WHERE ne.event_timestamp >= NOW() - INTERVAL '24 hours'
    GROUP BY e.id, e.contact_name, e.company_name, e.contact_email
    ORDER BY clicks DESC, opens DESC
    LIMIT 10
  `;
  const issuesResult = await sql`
    SELECT
      e.contact_name, e.company_name, e.contact_email, ne.event_type
    FROM nurture_enrollments e
    JOIN nurture_sends ns ON ns.enrollment_id = e.id
    JOIN nurture_events ne ON ne.send_id = ns.id
    WHERE ne.event_timestamp >= NOW() - INTERVAL '24 hours'
      AND ne.event_type IN ('bounced', 'complained')
  `;
  const activeResult = await sql`
    SELECT COUNT(*) as count FROM nurture_enrollments WHERE status = 'active'
  `;

  const eventCounts: Record<string, number> = {};
  for (const row of eventsResult) {
    eventCounts[row.event_type] = parseInt(row.count);
  }

  return {
    emailsSent: parseInt(sentResult[0]?.count || '0'),
    events: eventCounts,
    newEnrollments: parseInt(newEnrollmentsResult[0]?.count || '0'),
    completed: parseInt(completedResult[0]?.count || '0'),
    activeEnrollments: parseInt(activeResult[0]?.count || '0'),
    topEngaged,
    issues: issuesResult,
  };
}

// ============================================
// Unsubscribe token helpers
// ============================================

export function generateUnsubscribeToken(enrollmentId: number, email: string): string {
  const payload = `${enrollmentId}:${email}`;
  return Buffer.from(payload).toString('base64url');
}

export function parseUnsubscribeToken(token: string): { enrollmentId: number; email: string } | null {
  try {
    const payload = Buffer.from(token, 'base64url').toString('utf-8');
    const [idStr, email] = payload.split(':');
    const enrollmentId = parseInt(idStr, 10);
    if (isNaN(enrollmentId) || !email) return null;
    return { enrollmentId, email };
  } catch {
    return null;
  }
}
