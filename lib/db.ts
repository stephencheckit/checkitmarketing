import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// Initialize database tables
export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS module_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      module_slug VARCHAR(100) NOT NULL,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      UNIQUE(user_id, module_slug)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      passed BOOLEAN NOT NULL,
      answers JSONB,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_progress_user ON module_progress(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_attempts(user_id)
  `;
}

// User operations
export async function createUser(name: string, email: string, passwordHash: string, department: string) {
  const result = await sql`
    INSERT INTO users (name, email, password_hash, department)
    VALUES (${name}, ${email}, ${passwordHash}, ${department})
    RETURNING id, name, email, department, role, created_at
  `;
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0] || null;
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT id, name, email, department, role, created_at, last_login 
    FROM users WHERE id = ${id}
  `;
  return result[0] || null;
}

export async function updateLastLogin(userId: number) {
  await sql`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${userId}
  `;
}

export async function getAllUsers() {
  return await sql`
    SELECT id, name, email, department, role, created_at, last_login 
    FROM users 
    ORDER BY created_at DESC
  `;
}

// Module progress operations
export async function startModule(userId: number, moduleSlug: string) {
  await sql`
    INSERT INTO module_progress (user_id, module_slug)
    VALUES (${userId}, ${moduleSlug})
    ON CONFLICT (user_id, module_slug) DO NOTHING
  `;
}

export async function completeModule(userId: number, moduleSlug: string) {
  await sql`
    UPDATE module_progress 
    SET completed_at = CURRENT_TIMESTAMP 
    WHERE user_id = ${userId} AND module_slug = ${moduleSlug}
  `;
}

export async function getUserProgress(userId: number) {
  return await sql`
    SELECT * FROM module_progress WHERE user_id = ${userId}
  `;
}

export async function getAllProgress() {
  return await sql`
    SELECT 
      u.id as user_id,
      u.name,
      u.email,
      u.department,
      COUNT(mp.id) as modules_started,
      COUNT(mp.completed_at) as modules_completed
    FROM users u
    LEFT JOIN module_progress mp ON u.id = mp.user_id
    GROUP BY u.id, u.name, u.email, u.department
    ORDER BY modules_completed DESC
  `;
}

// Quiz operations
export async function saveQuizAttempt(
  userId: number, 
  score: number, 
  totalQuestions: number, 
  passed: boolean,
  answers: Record<string, string>
) {
  const result = await sql`
    INSERT INTO quiz_attempts (user_id, score, total_questions, passed, answers)
    VALUES (${userId}, ${score}, ${totalQuestions}, ${passed}, ${JSON.stringify(answers)})
    RETURNING *
  `;
  return result[0];
}

export async function getUserQuizAttempts(userId: number) {
  return await sql`
    SELECT * FROM quiz_attempts 
    WHERE user_id = ${userId} 
    ORDER BY completed_at DESC
  `;
}

export async function hasUserPassed(userId: number) {
  const result = await sql`
    SELECT EXISTS(
      SELECT 1 FROM quiz_attempts 
      WHERE user_id = ${userId} AND passed = true
    ) as passed
  `;
  return result[0]?.passed || false;
}

export async function getCertificationStats() {
  return await sql`
    SELECT 
      u.department,
      COUNT(DISTINCT u.id) as total_users,
      COUNT(DISTINCT CASE WHEN qa.passed = true THEN u.id END) as certified_users
    FROM users u
    LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
    GROUP BY u.department
    ORDER BY u.department
  `;
}

// ============================================
// BATTLECARD / COMPETITOR HUB OPERATIONS
// ============================================

export async function initializeBattlecardTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS battlecards (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL DEFAULT 'Main Battlecard',
      current_version INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS battlecard_versions (
      id SERIAL PRIMARY KEY,
      battlecard_id INTEGER REFERENCES battlecards(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      data JSONB NOT NULL,
      change_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_battlecard_versions_battlecard 
    ON battlecard_versions(battlecard_id, version_number DESC)
  `;
}

// Get or create the main battlecard
export async function getOrCreateBattlecard() {
  let result = await sql`SELECT * FROM battlecards WHERE id = 1`;
  
  if (result.length === 0) {
    // Create default battlecard with initial structure
    const defaultData = {
      ourCompany: {
        name: 'Checkit',
        website: 'https://www.checkit.net',
        tagline: '',
        entries: {}
      },
      competitors: [],
      categories: [
        { id: 'overview', name: 'Company Overview', order: 1 },
        { id: 'target-market', name: 'Target Market', order: 2 },
        { id: 'key-features', name: 'Key Features', order: 3 },
        { id: 'pricing', name: 'Pricing Model', order: 4 },
        { id: 'strengths', name: 'Strengths', order: 5 },
        { id: 'weaknesses', name: 'Weaknesses', order: 6 },
        { id: 'differentiators', name: 'Our Differentiators', order: 7 }
      ]
    };

    await sql`INSERT INTO battlecards (id, name) VALUES (1, 'Main Battlecard')`;
    await sql`
      INSERT INTO battlecard_versions (battlecard_id, version_number, data, change_notes)
      VALUES (1, 1, ${JSON.stringify(defaultData)}, 'Initial battlecard created')
    `;
    await sql`UPDATE battlecards SET current_version = 1 WHERE id = 1`;
    
    result = await sql`SELECT * FROM battlecards WHERE id = 1`;
  }
  
  return result[0];
}

// Get current battlecard data
export async function getCurrentBattlecardData() {
  const battlecard = await getOrCreateBattlecard();
  
  const versionResult = await sql`
    SELECT * FROM battlecard_versions 
    WHERE battlecard_id = ${battlecard.id} AND version_number = ${battlecard.current_version}
  `;
  
  return {
    id: battlecard.id as number,
    name: battlecard.name as string,
    current_version: battlecard.current_version as number,
    created_at: battlecard.created_at as string,
    updated_at: battlecard.updated_at as string,
    data: versionResult[0]?.data || null,
    versionCreatedAt: versionResult[0]?.created_at
  };
}

// Save new battlecard version
export async function saveBattlecardVersion(data: object, changeNotes?: string) {
  const battlecard = await getOrCreateBattlecard();
  const newVersion = (battlecard.current_version || 0) + 1;
  
  await sql`
    INSERT INTO battlecard_versions (battlecard_id, version_number, data, change_notes)
    VALUES (${battlecard.id}, ${newVersion}, ${JSON.stringify(data)}, ${changeNotes || null})
  `;
  
  await sql`
    UPDATE battlecards 
    SET current_version = ${newVersion}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${battlecard.id}
  `;
  
  return { version: newVersion };
}

// Get all versions for history
export async function getBattlecardVersions() {
  return await sql`
    SELECT id, version_number, change_notes, created_at 
    FROM battlecard_versions 
    WHERE battlecard_id = 1 
    ORDER BY version_number DESC
  `;
}

// Get specific version data
export async function getBattlecardVersion(versionNumber: number) {
  const result = await sql`
    SELECT * FROM battlecard_versions 
    WHERE battlecard_id = 1 AND version_number = ${versionNumber}
  `;
  return result[0] || null;
}

// Restore to a specific version (creates new version with that data)
export async function restoreBattlecardVersion(versionNumber: number) {
  const oldVersion = await getBattlecardVersion(versionNumber);
  if (!oldVersion) {
    throw new Error('Version not found');
  }
  
  return await saveBattlecardVersion(
    oldVersion.data, 
    `Restored from version ${versionNumber}`
  );
}

// ============================================
// POSITIONING DOCUMENT OPERATIONS
// ============================================

export async function initializePositioningTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS positioning_documents (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL DEFAULT 'Corporate Positioning',
      current_version INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS positioning_versions (
      id SERIAL PRIMARY KEY,
      document_id INTEGER REFERENCES positioning_documents(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      data JSONB NOT NULL,
      change_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_positioning_versions_document 
    ON positioning_versions(document_id, version_number DESC)
  `;
}

// Get or create the main positioning document
export async function getOrCreatePositioningDocument() {
  let result = await sql`SELECT * FROM positioning_documents WHERE id = 1`;
  
  if (result.length === 0) {
    // Create default positioning document with initial structure
    const defaultData = {
      companyName: 'Checkit',
      sections: [
        {
          id: 'mission-vision',
          name: 'Mission & Vision',
          order: 1,
          fields: [
            { id: 'mission', label: 'Mission Statement', type: 'textarea', value: '', placeholder: 'Why does Checkit exist? What problem do we solve?' },
            { id: 'vision', label: 'Vision Statement', type: 'textarea', value: '', placeholder: 'Where is Checkit headed? What future are we building?' }
          ]
        },
        {
          id: 'target-markets',
          name: 'Target Markets',
          order: 2,
          fields: [
            { id: 'primary-verticals', label: 'Primary Verticals', type: 'textarea', value: '', placeholder: 'e.g., Healthcare, Food Safety, Hospitality' },
            { id: 'buyer-personas', label: 'Buyer Personas', type: 'textarea', value: '', placeholder: 'Who are our primary buyers? (titles, responsibilities, pain points)' },
            { id: 'user-personas', label: 'User Personas', type: 'textarea', value: '', placeholder: 'Who uses the product day-to-day?' }
          ]
        },
        {
          id: 'value-proposition',
          name: 'Value Proposition',
          order: 3,
          fields: [
            { id: 'core-promise', label: 'Core Value Promise', type: 'textarea', value: '', placeholder: 'The single most important benefit we deliver' },
            { id: 'key-benefits', label: 'Key Benefits', type: 'textarea', value: '', placeholder: 'Top 3-5 benefits customers get from Checkit' },
            { id: 'proof-points', label: 'Proof Points', type: 'textarea', value: '', placeholder: 'Stats, case studies, or evidence that supports our claims' }
          ]
        },
        {
          id: 'differentiators',
          name: 'Key Differentiators',
          order: 4,
          fields: [
            { id: 'diff-1', label: 'Differentiator 1', type: 'text', value: '', placeholder: 'What makes us unique?' },
            { id: 'diff-1-detail', label: 'Detail', type: 'textarea', value: '', placeholder: 'Explain why this matters' },
            { id: 'diff-2', label: 'Differentiator 2', type: 'text', value: '', placeholder: 'What makes us unique?' },
            { id: 'diff-2-detail', label: 'Detail', type: 'textarea', value: '', placeholder: 'Explain why this matters' },
            { id: 'diff-3', label: 'Differentiator 3', type: 'text', value: '', placeholder: 'What makes us unique?' },
            { id: 'diff-3-detail', label: 'Detail', type: 'textarea', value: '', placeholder: 'Explain why this matters' }
          ]
        },
        {
          id: 'messaging-pillars',
          name: 'Messaging Pillars',
          order: 5,
          fields: [
            { id: 'pillar-1', label: 'Pillar 1', type: 'text', value: '', placeholder: 'e.g., Proactive Compliance' },
            { id: 'pillar-1-detail', label: 'Supporting Points', type: 'textarea', value: '', placeholder: 'Key messages under this pillar' },
            { id: 'pillar-2', label: 'Pillar 2', type: 'text', value: '', placeholder: 'e.g., Operational Visibility' },
            { id: 'pillar-2-detail', label: 'Supporting Points', type: 'textarea', value: '', placeholder: 'Key messages under this pillar' },
            { id: 'pillar-3', label: 'Pillar 3', type: 'text', value: '', placeholder: 'e.g., Effortless Audits' },
            { id: 'pillar-3-detail', label: 'Supporting Points', type: 'textarea', value: '', placeholder: 'Key messages under this pillar' }
          ]
        },
        {
          id: 'elevator-pitches',
          name: 'Elevator Pitches',
          order: 6,
          fields: [
            { id: 'pitch-10s', label: '10-Second Pitch', type: 'textarea', value: '', placeholder: 'One sentence that explains what Checkit does' },
            { id: 'pitch-30s', label: '30-Second Pitch', type: 'textarea', value: '', placeholder: 'A brief paragraph for quick introductions' },
            { id: 'pitch-2m', label: '2-Minute Pitch', type: 'textarea', value: '', placeholder: 'Full elevator pitch with problem, solution, and proof' }
          ]
        },
        {
          id: 'objection-handling',
          name: 'Objection Handling',
          order: 7,
          fields: [
            { id: 'objection-1', label: 'Common Objection 1', type: 'text', value: '', placeholder: 'e.g., "We already have a system"' },
            { id: 'response-1', label: 'Response', type: 'textarea', value: '', placeholder: 'How to address this objection' },
            { id: 'objection-2', label: 'Common Objection 2', type: 'text', value: '', placeholder: 'e.g., "It seems expensive"' },
            { id: 'response-2', label: 'Response', type: 'textarea', value: '', placeholder: 'How to address this objection' },
            { id: 'objection-3', label: 'Common Objection 3', type: 'text', value: '', placeholder: 'e.g., "Our team won\'t adopt it"' },
            { id: 'response-3', label: 'Response', type: 'textarea', value: '', placeholder: 'How to address this objection' }
          ]
        },
        {
          id: 'competitive-stance',
          name: 'Competitive Stance',
          order: 8,
          fields: [
            { id: 'positioning-statement', label: 'Competitive Positioning Statement', type: 'textarea', value: '', placeholder: 'How we position against the market' },
            { id: 'win-themes', label: 'Win Themes', type: 'textarea', value: '', placeholder: 'Why customers choose us over competitors' },
            { id: 'land-mines', label: 'Competitive Land Mines', type: 'textarea', value: '', placeholder: 'Questions to plant that highlight competitor weaknesses' }
          ]
        }
      ]
    };

    await sql`INSERT INTO positioning_documents (id, name) VALUES (1, 'Corporate Positioning')`;
    await sql`
      INSERT INTO positioning_versions (document_id, version_number, data, change_notes)
      VALUES (1, 1, ${JSON.stringify(defaultData)}, 'Initial positioning document created')
    `;
    await sql`UPDATE positioning_documents SET current_version = 1 WHERE id = 1`;
    
    result = await sql`SELECT * FROM positioning_documents WHERE id = 1`;
  }
  
  return result[0];
}

// Get current positioning document data
export async function getCurrentPositioningData() {
  const document = await getOrCreatePositioningDocument();
  
  const versionResult = await sql`
    SELECT * FROM positioning_versions 
    WHERE document_id = ${document.id} AND version_number = ${document.current_version}
  `;
  
  return {
    id: document.id as number,
    name: document.name as string,
    current_version: document.current_version as number,
    created_at: document.created_at as string,
    updated_at: document.updated_at as string,
    data: versionResult[0]?.data || null,
    versionCreatedAt: versionResult[0]?.created_at
  };
}

// Save new positioning version
export async function savePositioningVersion(data: object, changeNotes?: string) {
  const document = await getOrCreatePositioningDocument();
  const newVersion = (document.current_version || 0) + 1;
  
  await sql`
    INSERT INTO positioning_versions (document_id, version_number, data, change_notes)
    VALUES (${document.id}, ${newVersion}, ${JSON.stringify(data)}, ${changeNotes || null})
  `;
  
  await sql`
    UPDATE positioning_documents 
    SET current_version = ${newVersion}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${document.id}
  `;
  
  return { version: newVersion };
}

// Get all versions for history
export async function getPositioningVersions() {
  return await sql`
    SELECT id, version_number, change_notes, created_at 
    FROM positioning_versions 
    WHERE document_id = 1 
    ORDER BY version_number DESC
  `;
}

// Get specific version data
export async function getPositioningVersion(versionNumber: number) {
  const result = await sql`
    SELECT * FROM positioning_versions 
    WHERE document_id = 1 AND version_number = ${versionNumber}
  `;
  return result[0] || null;
}

// Restore to a specific version
export async function restorePositioningVersion(versionNumber: number) {
  const oldVersion = await getPositioningVersion(versionNumber);
  if (!oldVersion) {
    throw new Error('Version not found');
  }
  
  return await savePositioningVersion(
    oldVersion.data, 
    `Restored from version ${versionNumber}`
  );
}

// ============================================
// CONTENT IDEAS OPERATIONS
// ============================================

export async function initializeContentIdeasTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS content_ideas (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      target_audience VARCHAR(255),
      key_points JSONB,
      linkedin_post TEXT,
      facebook_post TEXT,
      twitter_post TEXT,
      article TEXT,
      article_word_count INTEGER,
      status VARCHAR(50) DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_content_ideas_status ON content_ideas(status)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_content_ideas_created ON content_ideas(created_at DESC)
  `;
}

// Get all content ideas
export async function getContentIdeas(status?: string) {
  if (status) {
    return await sql`
      SELECT * FROM content_ideas 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
  }
  return await sql`
    SELECT * FROM content_ideas 
    ORDER BY created_at DESC
  `;
}

// Get single content idea
export async function getContentIdeaById(id: number) {
  const result = await sql`
    SELECT * FROM content_ideas WHERE id = ${id}
  `;
  return result[0] || null;
}

// Save a new content idea
export async function saveContentIdea(idea: {
  title: string;
  description?: string;
  targetAudience?: string;
  keyPoints?: string[];
  linkedinPost?: string;
  facebookPost?: string;
  twitterPost?: string;
  article?: string;
  articleWordCount?: number;
  status?: string;
}) {
  const result = await sql`
    INSERT INTO content_ideas (
      title, description, target_audience, key_points,
      linkedin_post, facebook_post, twitter_post,
      article, article_word_count, status
    )
    VALUES (
      ${idea.title},
      ${idea.description || null},
      ${idea.targetAudience || null},
      ${JSON.stringify(idea.keyPoints || [])},
      ${idea.linkedinPost || null},
      ${idea.facebookPost || null},
      ${idea.twitterPost || null},
      ${idea.article || null},
      ${idea.articleWordCount || null},
      ${idea.status || 'draft'}
    )
    RETURNING *
  `;
  return result[0];
}

// Update content idea (e.g., add article, change status)
export async function updateContentIdea(id: number, updates: {
  title?: string;
  description?: string;
  targetAudience?: string;
  keyPoints?: string[];
  linkedinPost?: string;
  facebookPost?: string;
  twitterPost?: string;
  article?: string;
  articleWordCount?: number;
  status?: string;
}) {
  const result = await sql`
    UPDATE content_ideas SET
      title = COALESCE(${updates.title || null}, title),
      description = COALESCE(${updates.description || null}, description),
      target_audience = COALESCE(${updates.targetAudience || null}, target_audience),
      key_points = COALESCE(${updates.keyPoints ? JSON.stringify(updates.keyPoints) : null}, key_points),
      linkedin_post = COALESCE(${updates.linkedinPost || null}, linkedin_post),
      facebook_post = COALESCE(${updates.facebookPost || null}, facebook_post),
      twitter_post = COALESCE(${updates.twitterPost || null}, twitter_post),
      article = COALESCE(${updates.article || null}, article),
      article_word_count = COALESCE(${updates.articleWordCount || null}, article_word_count),
      status = COALESCE(${updates.status || null}, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

// Delete content idea
export async function deleteContentIdea(id: number) {
  await sql`DELETE FROM content_ideas WHERE id = ${id}`;
}

// Bulk save content ideas (for saving a batch of generated ideas)
export async function saveContentIdeasBatch(ideas: Array<{
  title: string;
  description?: string;
  targetAudience?: string;
  keyPoints?: string[];
  linkedinPost?: string;
  facebookPost?: string;
  twitterPost?: string;
}>) {
  const results = [];
  for (const idea of ideas) {
    const saved = await saveContentIdea(idea);
    results.push(saved);
  }
  return results;
}

// ============================================
// CONTRIBUTIONS & CITATIONS SYSTEM
// ============================================

export async function initializeContributionsTables() {
  // Contribution clusters (for merging related contributions)
  await sql`
    CREATE TABLE IF NOT EXISTS contribution_clusters (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      summary TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Main contributions table
  await sql`
    CREATE TABLE IF NOT EXISTS contributions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      target_type VARCHAR(50) NOT NULL,
      target_section VARCHAR(100),
      contribution_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      is_anonymous BOOLEAN DEFAULT false,
      status VARCHAR(50) DEFAULT 'pending',
      cluster_id INTEGER REFERENCES contribution_clusters(id) ON DELETE SET NULL,
      reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      reviewed_at TIMESTAMP,
      review_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Citations linking contributions to published versions
  await sql`
    CREATE TABLE IF NOT EXISTS citations (
      id SERIAL PRIMARY KEY,
      contribution_id INTEGER REFERENCES contributions(id) ON DELETE CASCADE,
      cluster_id INTEGER REFERENCES contribution_clusters(id) ON DELETE CASCADE,
      version_type VARCHAR(50) NOT NULL,
      version_id INTEGER NOT NULL,
      section_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Indexes for performance
  await sql`CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_contributions_target ON contributions(target_type, target_section)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_citations_version ON citations(version_type, version_id)`;
}

// ---- CONTRIBUTION OPERATIONS ----

export type ContributionType = 'intel' | 'suggestion' | 'question' | 'correction';
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'clustered' | 'auto_published';
export type TargetType = 'positioning' | 'competitors' | 'content';

export interface Contribution {
  id: number;
  user_id: number | null;
  target_type: TargetType;
  target_section: string | null;
  contribution_type: ContributionType;
  content: string;
  is_anonymous: boolean;
  status: ContributionStatus;
  cluster_id: number | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
  reviewer_name?: string;
}

// Create a new contribution
export async function createContribution(data: {
  userId: number;
  targetType: TargetType;
  targetSection?: string;
  contributionType: ContributionType;
  content: string;
  isAnonymous?: boolean;
}) {
  // Determine if this should auto-publish (intel on competitors)
  const shouldAutoPublish = 
    data.targetType === 'competitors' && data.contributionType === 'intel';
  
  const status = shouldAutoPublish ? 'auto_published' : 'pending';

  const result = await sql`
    INSERT INTO contributions (
      user_id, target_type, target_section, contribution_type, 
      content, is_anonymous, status
    )
    VALUES (
      ${data.userId}, ${data.targetType}, ${data.targetSection || null},
      ${data.contributionType}, ${data.content}, ${data.isAnonymous || false}, ${status}
    )
    RETURNING *
  `;
  return result[0];
}

// Get contributions for admin review (all pending)
export async function getPendingContributions() {
  return await sql`
    SELECT 
      c.*,
      u.name as user_name,
      u.email as user_email
    FROM contributions c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.status = 'pending'
    ORDER BY 
      CASE c.contribution_type 
        WHEN 'correction' THEN 1 
        WHEN 'intel' THEN 2
        WHEN 'suggestion' THEN 3
        WHEN 'question' THEN 4
      END,
      c.created_at ASC
  `;
}

// Get contributions by user (for "My Contributions")
export async function getUserContributions(userId: number) {
  return await sql`
    SELECT 
      c.*,
      r.name as reviewer_name
    FROM contributions c
    LEFT JOIN users r ON c.reviewed_by = r.id
    WHERE c.user_id = ${userId}
    ORDER BY c.created_at DESC
  `;
}

// Get all contributions (admin view)
export async function getAllContributions(filters?: {
  targetType?: TargetType;
  status?: ContributionStatus;
  contributionType?: ContributionType;
}) {
  if (filters?.targetType && filters?.status) {
    return await sql`
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        r.name as reviewer_name
      FROM contributions c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users r ON c.reviewed_by = r.id
      WHERE c.target_type = ${filters.targetType} AND c.status = ${filters.status}
      ORDER BY c.created_at DESC
    `;
  } else if (filters?.targetType) {
    return await sql`
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        r.name as reviewer_name
      FROM contributions c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users r ON c.reviewed_by = r.id
      WHERE c.target_type = ${filters.targetType}
      ORDER BY c.created_at DESC
    `;
  } else if (filters?.status) {
    return await sql`
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        r.name as reviewer_name
      FROM contributions c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users r ON c.reviewed_by = r.id
      WHERE c.status = ${filters.status}
      ORDER BY c.created_at DESC
    `;
  }
  
  return await sql`
    SELECT 
      c.*,
      u.name as user_name,
      u.email as user_email,
      r.name as reviewer_name
    FROM contributions c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN users r ON c.reviewed_by = r.id
    ORDER BY c.created_at DESC
  `;
}

// Get a single contribution
export async function getContribution(id: number) {
  const result = await sql`
    SELECT 
      c.*,
      u.name as user_name,
      u.email as user_email,
      r.name as reviewer_name
    FROM contributions c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN users r ON c.reviewed_by = r.id
    WHERE c.id = ${id}
  `;
  return result[0] || null;
}

// Admin: Review a contribution (approve/reject)
export async function reviewContribution(
  id: number, 
  reviewerId: number, 
  status: 'approved' | 'rejected',
  reviewNotes?: string
) {
  const result = await sql`
    UPDATE contributions
    SET 
      status = ${status},
      reviewed_by = ${reviewerId},
      reviewed_at = CURRENT_TIMESTAMP,
      review_notes = ${reviewNotes || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

// Admin: Delete a contribution
export async function deleteContribution(id: number) {
  await sql`DELETE FROM contributions WHERE id = ${id}`;
}

// ---- CLUSTER OPERATIONS ----

// Create a cluster from multiple contributions
export async function createCluster(data: {
  name?: string;
  summary: string;
  contributionIds: number[];
  createdBy: number;
}) {
  // Create the cluster
  const clusterResult = await sql`
    INSERT INTO contribution_clusters (name, summary, created_by)
    VALUES (${data.name || null}, ${data.summary}, ${data.createdBy})
    RETURNING *
  `;
  const cluster = clusterResult[0];

  // Update all contributions to point to this cluster
  for (const contribId of data.contributionIds) {
    await sql`
      UPDATE contributions
      SET cluster_id = ${cluster.id}, status = 'clustered'
      WHERE id = ${contribId}
    `;
  }

  return cluster;
}

// Get cluster with its contributions
export async function getClusterWithContributions(clusterId: number) {
  const clusterResult = await sql`
    SELECT 
      cc.*,
      u.name as creator_name
    FROM contribution_clusters cc
    LEFT JOIN users u ON cc.created_by = u.id
    WHERE cc.id = ${clusterId}
  `;
  
  if (!clusterResult[0]) return null;

  const contributions = await sql`
    SELECT 
      c.*,
      u.name as user_name
    FROM contributions c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.cluster_id = ${clusterId}
  `;

  return {
    ...clusterResult[0],
    contributions
  };
}

// ---- CITATION OPERATIONS ----

// Create a citation when a contribution is used in a version
export async function createCitation(data: {
  contributionId?: number;
  clusterId?: number;
  versionType: TargetType;
  versionId: number;
  sectionId?: string;
}) {
  const result = await sql`
    INSERT INTO citations (
      contribution_id, cluster_id, version_type, version_id, section_id
    )
    VALUES (
      ${data.contributionId || null}, ${data.clusterId || null},
      ${data.versionType}, ${data.versionId}, ${data.sectionId || null}
    )
    RETURNING *
  `;
  return result[0];
}

// Get citations for a specific version
export async function getCitationsForVersion(versionType: TargetType, versionId: number) {
  return await sql`
    SELECT 
      cit.*,
      c.content as contribution_content,
      c.is_anonymous,
      c.user_id as contributor_id,
      u.name as contributor_name,
      cc.name as cluster_name,
      cc.summary as cluster_summary
    FROM citations cit
    LEFT JOIN contributions c ON cit.contribution_id = c.id
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN contribution_clusters cc ON cit.cluster_id = cc.id
    WHERE cit.version_type = ${versionType} AND cit.version_id = ${versionId}
    ORDER BY cit.created_at ASC
  `;
}

// Get citations for a specific section within a version
export async function getCitationsForSection(
  versionType: TargetType, 
  versionId: number, 
  sectionId: string
) {
  return await sql`
    SELECT 
      cit.*,
      c.content as contribution_content,
      c.is_anonymous,
      c.user_id as contributor_id,
      u.name as contributor_name,
      cc.name as cluster_name,
      cc.summary as cluster_summary
    FROM citations cit
    LEFT JOIN contributions c ON cit.contribution_id = c.id
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN contribution_clusters cc ON cit.cluster_id = cc.id
    WHERE cit.version_type = ${versionType} 
      AND cit.version_id = ${versionId}
      AND cit.section_id = ${sectionId}
    ORDER BY cit.created_at ASC
  `;
}

// Get all contributions by a user (for offboarding report)
export async function getContributionsByUser(userId: number) {
  return await sql`
    SELECT 
      c.*,
      cit.version_type,
      cit.version_id,
      cit.section_id
    FROM contributions c
    LEFT JOIN citations cit ON c.id = cit.contribution_id
    WHERE c.user_id = ${userId}
    ORDER BY c.created_at DESC
  `;
}

// Get contribution stats (for admin dashboard)
export async function getContributionStats() {
  const byStatus = await sql`
    SELECT status, COUNT(*) as count
    FROM contributions
    GROUP BY status
  `;

  const byType = await sql`
    SELECT contribution_type, COUNT(*) as count
    FROM contributions
    GROUP BY contribution_type
  `;

  const byTarget = await sql`
    SELECT target_type, COUNT(*) as count
    FROM contributions
    GROUP BY target_type
  `;

  const topContributors = await sql`
    SELECT 
      u.id, u.name, u.department,
      COUNT(c.id) as total_contributions,
      COUNT(CASE WHEN c.status = 'approved' OR c.status = 'auto_published' THEN 1 END) as approved_count
    FROM users u
    LEFT JOIN contributions c ON u.id = c.user_id
    GROUP BY u.id, u.name, u.department
    HAVING COUNT(c.id) > 0
    ORDER BY approved_count DESC, total_contributions DESC
    LIMIT 10
  `;

  return {
    byStatus,
    byType,
    byTarget,
    topContributors
  };
}
