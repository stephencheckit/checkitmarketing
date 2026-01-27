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

// ============================================
// COMPETITOR FEEDS (RSS/SCRAPING) OPERATIONS
// ============================================

export async function initializeCompetitorFeedsTables() {
  // Cache of competitor feed metadata
  await sql`
    CREATE TABLE IF NOT EXISTS competitor_feeds (
      id SERIAL PRIMARY KEY,
      competitor_id VARCHAR(100) NOT NULL UNIQUE,
      competitor_name VARCHAR(255) NOT NULL,
      competitor_website VARCHAR(500),
      feed_url VARCHAR(500),
      discovery_method VARCHAR(100),
      last_fetched_at TIMESTAMP,
      fetch_error TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Individual feed items with tagging
  await sql`
    CREATE TABLE IF NOT EXISTS competitor_feed_items (
      id SERIAL PRIMARY KEY,
      competitor_id VARCHAR(100) NOT NULL,
      title VARCHAR(500) NOT NULL,
      link VARCHAR(1000) NOT NULL UNIQUE,
      pub_date TIMESTAMP,
      content_snippet TEXT,
      author VARCHAR(255),
      topics TEXT[] DEFAULT '{}',
      industries TEXT[] DEFAULT '{}',
      ai_tagged BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // User feed preferences
  await sql`
    CREATE TABLE IF NOT EXISTS user_feed_preferences (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      filters JSONB DEFAULT '{}',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_feed_items_competitor ON competitor_feed_items(competitor_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_feed_items_pub_date ON competitor_feed_items(pub_date DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_feed_items_topics ON competitor_feed_items USING GIN(topics)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_feed_items_industries ON competitor_feed_items USING GIN(industries)`;
}

// Keyword patterns for auto-tagging
const TOPIC_KEYWORDS: Record<string, string[]> = {
  'product-update': ['product', 'release', 'feature', 'update', 'launch', 'new version', 'announcement'],
  'case-study': ['case study', 'customer story', 'success story', 'testimonial', 'results'],
  'thought-leadership': ['insight', 'trends', 'future of', 'opinion', 'perspective', 'analysis'],
  'webinar': ['webinar', 'workshop', 'live event', 'register', 'join us'],
  'compliance': ['compliance', 'regulation', 'audit', 'inspection', 'FDA', 'HACCP', 'CQC', 'standard'],
  'company-news': ['partnership', 'acquisition', 'funding', 'award', 'recognition', 'hired', 'joins'],
  'how-to': ['how to', 'guide', 'tutorial', 'best practices', 'tips', 'steps'],
  'industry-news': ['industry', 'market', 'report', 'survey', 'research', 'study finds'],
};

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'healthcare': ['healthcare', 'hospital', 'NHS', 'clinical', 'patient', 'medical', 'health system', 'CQC'],
  'food-safety': ['food safety', 'HACCP', 'food service', 'restaurant', 'kitchen', 'catering', 'FDA food'],
  'senior-living': ['senior living', 'care home', 'elderly', 'assisted living', 'nursing home', 'aged care'],
  'pharmacy': ['pharmacy', 'pharmacist', 'dispensing', 'medication', 'prescription'],
  'hospitality': ['hotel', 'hospitality', 'resort', 'guest', 'accommodation'],
  'retail': ['retail', 'store', 'supermarket', 'grocery', 'shop'],
  'facilities': ['facilities', 'building', 'maintenance', 'HVAC', 'energy', 'property'],
};

// Auto-tag an article using keyword matching
export function autoTagArticle(title: string, content: string): { topics: string[]; industries: string[] } {
  const text = `${title} ${content}`.toLowerCase();
  const topics: string[] = [];
  const industries: string[] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      topics.push(topic);
    }
  }

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      industries.push(industry);
    }
  }

  return { topics, industries };
}

// Save or update a competitor feed
export async function upsertCompetitorFeed(data: {
  competitorId: string;
  competitorName: string;
  competitorWebsite?: string;
  feedUrl?: string;
  discoveryMethod?: string;
  fetchError?: string;
}) {
  const result = await sql`
    INSERT INTO competitor_feeds (
      competitor_id, competitor_name, competitor_website, 
      feed_url, discovery_method, fetch_error, last_fetched_at
    )
    VALUES (
      ${data.competitorId}, ${data.competitorName}, ${data.competitorWebsite || null},
      ${data.feedUrl || null}, ${data.discoveryMethod || null}, ${data.fetchError || null},
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (competitor_id) DO UPDATE SET
      competitor_name = ${data.competitorName},
      competitor_website = COALESCE(${data.competitorWebsite || null}, competitor_feeds.competitor_website),
      feed_url = COALESCE(${data.feedUrl || null}, competitor_feeds.feed_url),
      discovery_method = COALESCE(${data.discoveryMethod || null}, competitor_feeds.discovery_method),
      fetch_error = ${data.fetchError || null},
      last_fetched_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result[0];
}

// Save feed items (with auto-tagging)
export async function saveFeedItems(competitorId: string, items: Array<{
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  author?: string;
}>) {
  const saved = [];
  for (const item of items) {
    // Auto-tag using keywords
    const { topics, industries } = autoTagArticle(item.title, item.contentSnippet || '');
    
    try {
      const result = await sql`
        INSERT INTO competitor_feed_items (
          competitor_id, title, link, pub_date, content_snippet, author, topics, industries
        )
        VALUES (
          ${competitorId}, ${item.title}, ${item.link}, 
          ${item.pubDate ? new Date(item.pubDate) : null},
          ${item.contentSnippet || null}, ${item.author || null},
          ${topics}, ${industries}
        )
        ON CONFLICT (link) DO UPDATE SET
          title = ${item.title},
          content_snippet = COALESCE(${item.contentSnippet || null}, competitor_feed_items.content_snippet),
          topics = CASE 
            WHEN competitor_feed_items.ai_tagged THEN competitor_feed_items.topics 
            ELSE ${topics}
          END,
          industries = CASE 
            WHEN competitor_feed_items.ai_tagged THEN competitor_feed_items.industries 
            ELSE ${industries}
          END
        RETURNING *
      `;
      saved.push(result[0]);
    } catch {
      // Skip duplicates or errors
    }
  }
  return saved;
}

// Get feed items with filtering
export async function getFeedItems(filters?: {
  competitorIds?: string[];
  topics?: string[];
  industries?: string[];
  daysBack?: number;
  sortBy?: 'date' | 'competitor';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) {
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;
  const sortOrder = filters?.sortOrder === 'asc' ? sql`ASC` : sql`DESC`;
  
  // Build dynamic query based on filters
  let query;
  
  if (filters?.competitorIds?.length && filters?.topics?.length && filters?.industries?.length && filters?.daysBack) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.competitor_id = ANY(${filters.competitorIds})
        AND fi.topics && ${filters.topics}
        AND fi.industries && ${filters.industries}
        AND fi.pub_date >= NOW() - INTERVAL '1 day' * ${filters.daysBack}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.competitorIds?.length && filters?.topics?.length && filters?.industries?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.competitor_id = ANY(${filters.competitorIds})
        AND fi.topics && ${filters.topics}
        AND fi.industries && ${filters.industries}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.competitorIds?.length && filters?.topics?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.competitor_id = ANY(${filters.competitorIds})
        AND fi.topics && ${filters.topics}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.competitorIds?.length && filters?.industries?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.competitor_id = ANY(${filters.competitorIds})
        AND fi.industries && ${filters.industries}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.topics?.length && filters?.industries?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.topics && ${filters.topics}
        AND fi.industries && ${filters.industries}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.competitorIds?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.competitor_id = ANY(${filters.competitorIds})
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.topics?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.topics && ${filters.topics}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.industries?.length) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.industries && ${filters.industries}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (filters?.daysBack) {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      WHERE fi.pub_date >= NOW() - INTERVAL '1 day' * ${filters.daysBack}
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    query = sql`
      SELECT fi.*, cf.competitor_name, cf.feed_url
      FROM competitor_feed_items fi
      LEFT JOIN competitor_feeds cf ON fi.competitor_id = cf.competitor_id
      ORDER BY fi.pub_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }
  
  return await query;
}

// Get all cached competitor feeds
export async function getCompetitorFeeds() {
  return await sql`
    SELECT cf.*, 
      (SELECT COUNT(*) FROM competitor_feed_items WHERE competitor_id = cf.competitor_id) as item_count
    FROM competitor_feeds cf
    ORDER BY cf.competitor_name
  `;
}

// Check if feeds need refresh (older than X hours)
export async function getFeedsNeedingRefresh(hoursOld: number = 12) {
  return await sql`
    SELECT * FROM competitor_feeds
    WHERE last_fetched_at IS NULL 
      OR last_fetched_at < NOW() - INTERVAL '1 hour' * ${hoursOld}
  `;
}

// Get available filter options (for UI dropdowns)
export async function getFeedFilterOptions() {
  const competitors = await sql`
    SELECT DISTINCT competitor_id, competitor_name 
    FROM competitor_feeds 
    ORDER BY competitor_name
  `;
  
  const topics = await sql`
    SELECT DISTINCT unnest(topics) as topic 
    FROM competitor_feed_items 
    WHERE array_length(topics, 1) > 0
    ORDER BY topic
  `;
  
  const industries = await sql`
    SELECT DISTINCT unnest(industries) as industry 
    FROM competitor_feed_items 
    WHERE array_length(industries, 1) > 0
    ORDER BY industry
  `;
  
  return {
    competitors: competitors.map(c => ({ id: c.competitor_id, name: c.competitor_name })),
    topics: topics.map(t => t.topic),
    industries: industries.map(i => i.industry),
  };
}

// User preferences
export async function getUserFeedPreferences(userId: number) {
  const result = await sql`
    SELECT * FROM user_feed_preferences WHERE user_id = ${userId}
  `;
  return result[0]?.filters || {};
}

export async function saveUserFeedPreferences(userId: number, filters: object) {
  await sql`
    INSERT INTO user_feed_preferences (user_id, filters, updated_at)
    VALUES (${userId}, ${JSON.stringify(filters)}, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET
      filters = ${JSON.stringify(filters)},
      updated_at = CURRENT_TIMESTAMP
  `;
}

// Update tags via AI (mark as AI-tagged)
export async function updateItemTags(itemId: number, topics: string[], industries: string[]) {
  await sql`
    UPDATE competitor_feed_items
    SET topics = ${topics}, industries = ${industries}, ai_tagged = true
    WHERE id = ${itemId}
  `;
}

// Get items needing AI tagging (no keyword matches)
export async function getItemsNeedingAITagging(limit: number = 20) {
  return await sql`
    SELECT * FROM competitor_feed_items
    WHERE ai_tagged = false 
      AND array_length(topics, 1) IS NULL 
      AND array_length(industries, 1) IS NULL
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

// ============================================
// OVG SITES & ANALYTICS OPERATIONS
// ============================================

export async function initializeOVGTables() {
  // OVG Sites/Venues table
  await sql`
    CREATE TABLE IF NOT EXISTS ovg_sites (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      venue_type VARCHAR(100),
      address VARCHAR(500),
      city VARCHAR(255),
      state VARCHAR(100),
      zip VARCHAR(20),
      country VARCHAR(100) DEFAULT 'USA',
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      status VARCHAR(50) DEFAULT 'prospect',
      notes TEXT,
      contact_name VARCHAR(255),
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Page view analytics for OVG map
  await sql`
    CREATE TABLE IF NOT EXISTS ovg_page_analytics (
      id SERIAL PRIMARY KEY,
      visitor_ip VARCHAR(45),
      visitor_city VARCHAR(255),
      visitor_region VARCHAR(255),
      visitor_country VARCHAR(100),
      visitor_latitude DECIMAL(10, 8),
      visitor_longitude DECIMAL(11, 8),
      user_agent TEXT,
      referrer TEXT,
      password_used VARCHAR(100),
      session_id VARCHAR(100),
      page_path VARCHAR(255) DEFAULT '/ovg-map',
      time_on_page INTEGER,
      viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Indexes for performance
  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_sites_status ON ovg_sites(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_sites_state ON ovg_sites(state)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_analytics_viewed ON ovg_page_analytics(viewed_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_analytics_ip ON ovg_page_analytics(visitor_ip)`;
}

export type OVGSiteStatus = 'contracted' | 'engaged' | 'prospect';

export interface OVGSite {
  id: number;
  name: string;
  venue_type: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: OVGSiteStatus;
  notes: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

// Get all OVG sites
export async function getOVGSites(status?: OVGSiteStatus) {
  if (status) {
    return await sql`
      SELECT * FROM ovg_sites 
      WHERE status = ${status}
      ORDER BY state, city, name
    `;
  }
  return await sql`
    SELECT * FROM ovg_sites 
    ORDER BY state, city, name
  `;
}

// Get OVG site by ID
export async function getOVGSiteById(id: number) {
  const result = await sql`
    SELECT * FROM ovg_sites WHERE id = ${id}
  `;
  return result[0] || null;
}

// Create OVG site
export async function createOVGSite(site: {
  name: string;
  venueType?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status?: OVGSiteStatus;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const result = await sql`
    INSERT INTO ovg_sites (
      name, venue_type, address, city, state, zip, country,
      latitude, longitude, status, notes, 
      contact_name, contact_email, contact_phone
    )
    VALUES (
      ${site.name}, ${site.venueType || null}, ${site.address || null},
      ${site.city || null}, ${site.state || null}, ${site.zip || null},
      ${site.country || 'USA'}, ${site.latitude || null}, ${site.longitude || null},
      ${site.status || 'prospect'}, ${site.notes || null},
      ${site.contactName || null}, ${site.contactEmail || null}, ${site.contactPhone || null}
    )
    RETURNING *
  `;
  return result[0];
}

// Update OVG site
export async function updateOVGSite(id: number, updates: {
  name?: string;
  venueType?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status?: OVGSiteStatus;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const result = await sql`
    UPDATE ovg_sites SET
      name = COALESCE(${updates.name || null}, name),
      venue_type = COALESCE(${updates.venueType || null}, venue_type),
      address = COALESCE(${updates.address || null}, address),
      city = COALESCE(${updates.city || null}, city),
      state = COALESCE(${updates.state || null}, state),
      zip = COALESCE(${updates.zip || null}, zip),
      country = COALESCE(${updates.country || null}, country),
      latitude = COALESCE(${updates.latitude || null}, latitude),
      longitude = COALESCE(${updates.longitude || null}, longitude),
      status = COALESCE(${updates.status || null}, status),
      notes = COALESCE(${updates.notes || null}, notes),
      contact_name = COALESCE(${updates.contactName || null}, contact_name),
      contact_email = COALESCE(${updates.contactEmail || null}, contact_email),
      contact_phone = COALESCE(${updates.contactPhone || null}, contact_phone),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

// Bulk update OVG site statuses
export async function bulkUpdateOVGSiteStatus(ids: number[], status: OVGSiteStatus) {
  await sql`
    UPDATE ovg_sites 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ANY(${ids})
  `;
}

// Delete OVG site
export async function deleteOVGSite(id: number) {
  await sql`DELETE FROM ovg_sites WHERE id = ${id}`;
}

// Bulk insert OVG sites (for seeding)
export async function bulkInsertOVGSites(sites: Array<{
  name: string;
  venueType?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status?: OVGSiteStatus;
}>) {
  const results = [];
  for (const site of sites) {
    const saved = await createOVGSite(site);
    results.push(saved);
  }
  return results;
}

// Get OVG site statistics
export async function getOVGSiteStats() {
  const byStatus = await sql`
    SELECT status, COUNT(*) as count
    FROM ovg_sites
    GROUP BY status
  `;

  const byState = await sql`
    SELECT state, COUNT(*) as count
    FROM ovg_sites
    WHERE state IS NOT NULL
    GROUP BY state
    ORDER BY count DESC
  `;

  const byType = await sql`
    SELECT venue_type, COUNT(*) as count
    FROM ovg_sites
    WHERE venue_type IS NOT NULL
    GROUP BY venue_type
    ORDER BY count DESC
  `;

  return { byStatus, byState, byType };
}

// ---- OVG PAGE ANALYTICS ----

export interface OVGPageView {
  id: number;
  visitor_ip: string | null;
  visitor_city: string | null;
  visitor_region: string | null;
  visitor_country: string | null;
  visitor_latitude: number | null;
  visitor_longitude: number | null;
  user_agent: string | null;
  referrer: string | null;
  password_used: string | null;
  session_id: string | null;
  page_path: string;
  time_on_page: number | null;
  viewed_at: string;
}

// Record a page view
export async function recordOVGPageView(data: {
  visitorIp?: string;
  visitorCity?: string;
  visitorRegion?: string;
  visitorCountry?: string;
  visitorLatitude?: number;
  visitorLongitude?: number;
  userAgent?: string;
  referrer?: string;
  passwordUsed?: string;
  sessionId?: string;
  pagePath?: string;
}) {
  const result = await sql`
    INSERT INTO ovg_page_analytics (
      visitor_ip, visitor_city, visitor_region, visitor_country,
      visitor_latitude, visitor_longitude, user_agent, referrer,
      password_used, session_id, page_path
    )
    VALUES (
      ${data.visitorIp || null}, ${data.visitorCity || null}, 
      ${data.visitorRegion || null}, ${data.visitorCountry || null},
      ${data.visitorLatitude || null}, ${data.visitorLongitude || null},
      ${data.userAgent || null}, ${data.referrer || null},
      ${data.passwordUsed || null}, ${data.sessionId || null},
      ${data.pagePath || '/ovg-map'}
    )
    RETURNING *
  `;
  return result[0];
}

// Update time on page
export async function updateOVGPageViewDuration(id: number, timeOnPage: number) {
  await sql`
    UPDATE ovg_page_analytics 
    SET time_on_page = ${timeOnPage}
    WHERE id = ${id}
  `;
}

// Get recent page views
export async function getOVGPageViews(options?: {
  limit?: number;
  daysBack?: number;
}) {
  const limit = options?.limit || 100;
  
  if (options?.daysBack) {
    return await sql`
      SELECT * FROM ovg_page_analytics
      WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${options.daysBack}
      ORDER BY viewed_at DESC
      LIMIT ${limit}
    `;
  }
  
  return await sql`
    SELECT * FROM ovg_page_analytics
    ORDER BY viewed_at DESC
    LIMIT ${limit}
  `;
}

// Get analytics summary
export async function getOVGAnalyticsSummary(daysBack: number = 30) {
  const totalViews = await sql`
    SELECT COUNT(*) as count
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
  `;

  const uniqueVisitors = await sql`
    SELECT COUNT(DISTINCT visitor_ip) as count
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_ip IS NOT NULL
  `;

  const byLocation = await sql`
    SELECT visitor_city, visitor_region, visitor_country, COUNT(*) as views
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_city IS NOT NULL
    GROUP BY visitor_city, visitor_region, visitor_country
    ORDER BY views DESC
    LIMIT 20
  `;

  const byDay = await sql`
    SELECT DATE(viewed_at) as date, COUNT(*) as views
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
    GROUP BY DATE(viewed_at)
    ORDER BY date DESC
  `;

  // Views by page
  const byPage = await sql`
    SELECT page_path, COUNT(*) as views
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
    GROUP BY page_path
    ORDER BY views DESC
  `;

  // Recent visitors with all their page visits
  const recentVisitors = await sql`
    SELECT 
      visitor_ip,
      visitor_city,
      visitor_region,
      visitor_country,
      user_agent,
      MIN(viewed_at) as first_visit,
      MAX(viewed_at) as last_visit,
      COUNT(*) as page_count,
      ARRAY_AGG(DISTINCT page_path) as pages_visited
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_ip IS NOT NULL
    GROUP BY visitor_ip, visitor_city, visitor_region, visitor_country, user_agent
    ORDER BY last_visit DESC
    LIMIT 50
  `;

  // Sessions by pages visited count
  const sessionsByPageCount = await sql`
    SELECT 
      page_count,
      COUNT(*) as session_count
    FROM (
      SELECT visitor_ip, COUNT(DISTINCT page_path) as page_count
      FROM ovg_page_analytics
      WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
        AND visitor_ip IS NOT NULL
      GROUP BY visitor_ip
    ) as sessions
    GROUP BY page_count
    ORDER BY page_count
  `;

  return {
    totalViews: totalViews[0]?.count || 0,
    uniqueVisitors: uniqueVisitors[0]?.count || 0,
    byLocation,
    byDay,
    byPage,
    recentVisitors,
    sessionsByPageCount
  };
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

// ============================================
// PAGE CONTENT (INLINE EDITING) OPERATIONS
// ============================================

export async function initializePageContentTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS page_content (
      id SERIAL PRIMARY KEY,
      page_id VARCHAR(100) NOT NULL,
      field_id VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(page_id, field_id)
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page_id)`;
}

export interface PageContentItem {
  id: number;
  page_id: string;
  field_id: string;
  content: string;
  updated_by: number | null;
  updated_at: string;
}

// Get all content for a page
export async function getPageContent(pageId: string): Promise<Record<string, string>> {
  const results = await sql`
    SELECT field_id, content FROM page_content WHERE page_id = ${pageId}
  `;
  
  const content: Record<string, string> = {};
  for (const row of results) {
    content[row.field_id as string] = row.content as string;
  }
  return content;
}

// Get a single content field
export async function getPageContentField(pageId: string, fieldId: string): Promise<string | null> {
  const result = await sql`
    SELECT content FROM page_content 
    WHERE page_id = ${pageId} AND field_id = ${fieldId}
  `;
  return (result[0]?.content as string) || null;
}

// Update or create a content field
export async function upsertPageContent(
  pageId: string, 
  fieldId: string, 
  content: string, 
  userId?: number
): Promise<PageContentItem> {
  const result = await sql`
    INSERT INTO page_content (page_id, field_id, content, updated_by, updated_at)
    VALUES (${pageId}, ${fieldId}, ${content}, ${userId || null}, CURRENT_TIMESTAMP)
    ON CONFLICT (page_id, field_id) DO UPDATE SET
      content = ${content},
      updated_by = ${userId || null},
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result[0] as PageContentItem;
}

// Batch update multiple fields for a page
export async function batchUpdatePageContent(
  pageId: string, 
  updates: Record<string, string>, 
  userId?: number
): Promise<void> {
  for (const [fieldId, content] of Object.entries(updates)) {
    await upsertPageContent(pageId, fieldId, content, userId);
  }
}

// Delete a content field (revert to default)
export async function deletePageContentField(pageId: string, fieldId: string): Promise<void> {
  await sql`
    DELETE FROM page_content 
    WHERE page_id = ${pageId} AND field_id = ${fieldId}
  `;
}

// Get all pages that have custom content
export async function getCustomizedPages(): Promise<Array<{ page_id: string; field_count: number }>> {
  const results = await sql`
    SELECT page_id, COUNT(*) as field_count
    FROM page_content
    GROUP BY page_id
    ORDER BY page_id
  `;
  return results as Array<{ page_id: string; field_count: number }>;
}

// ============================================
// DEMO REQUESTS (CRM) OPERATIONS
// ============================================

export async function initializeDemoRequestsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS demo_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      industry VARCHAR(100),
      message TEXT,
      source_page VARCHAR(255),
      status VARCHAR(50) DEFAULT 'new',
      notes TEXT,
      assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
      followed_up_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_demo_requests_created ON demo_requests(created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email)`;
}

export type DemoRequestStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'not_interested' | 'spam';

export interface DemoRequest {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  industry: string | null;
  message: string | null;
  source_page: string | null;
  status: DemoRequestStatus;
  notes: string | null;
  assigned_to: number | null;
  followed_up_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_user_name?: string;
}

// Create a new demo request
export async function createDemoRequest(data: {
  name: string;
  email: string;
  company: string;
  phone?: string;
  industry?: string;
  message?: string;
  sourcePage?: string;
}): Promise<DemoRequest> {
  const result = await sql`
    INSERT INTO demo_requests (
      name, email, company, phone, industry, message, source_page
    )
    VALUES (
      ${data.name}, ${data.email}, ${data.company}, 
      ${data.phone || null}, ${data.industry || null}, 
      ${data.message || null}, ${data.sourcePage || null}
    )
    RETURNING *
  `;
  return result[0] as DemoRequest;
}

// Get all demo requests
export async function getDemoRequests(filters?: {
  status?: DemoRequestStatus;
  limit?: number;
  offset?: number;
}): Promise<DemoRequest[]> {
  const limit = filters?.limit || 100;
  const offset = filters?.offset || 0;

  if (filters?.status) {
    return await sql`
      SELECT 
        dr.*,
        u.name as assigned_user_name
      FROM demo_requests dr
      LEFT JOIN users u ON dr.assigned_to = u.id
      WHERE dr.status = ${filters.status}
      ORDER BY dr.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as DemoRequest[];
  }

  return await sql`
    SELECT 
      dr.*,
      u.name as assigned_user_name
    FROM demo_requests dr
    LEFT JOIN users u ON dr.assigned_to = u.id
    ORDER BY dr.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as DemoRequest[];
}

// Get a single demo request by ID
export async function getDemoRequestById(id: number): Promise<DemoRequest | null> {
  const result = await sql`
    SELECT 
      dr.*,
      u.name as assigned_user_name
    FROM demo_requests dr
    LEFT JOIN users u ON dr.assigned_to = u.id
    WHERE dr.id = ${id}
  `;
  return (result[0] as DemoRequest) || null;
}

// Update demo request status/notes
export async function updateDemoRequest(id: number, updates: {
  status?: DemoRequestStatus;
  notes?: string;
  assignedTo?: number;
  followedUpAt?: Date;
}): Promise<DemoRequest | null> {
  const result = await sql`
    UPDATE demo_requests SET
      status = COALESCE(${updates.status || null}, status),
      notes = COALESCE(${updates.notes || null}, notes),
      assigned_to = COALESCE(${updates.assignedTo || null}, assigned_to),
      followed_up_at = COALESCE(${updates.followedUpAt || null}, followed_up_at),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as DemoRequest) || null;
}

// Get demo request stats
export async function getDemoRequestStats() {
  const byStatus = await sql`
    SELECT status, COUNT(*) as count
    FROM demo_requests
    GROUP BY status
  `;

  const byIndustry = await sql`
    SELECT industry, COUNT(*) as count
    FROM demo_requests
    WHERE industry IS NOT NULL
    GROUP BY industry
    ORDER BY count DESC
  `;

  const recentCount = await sql`
    SELECT COUNT(*) as count
    FROM demo_requests
    WHERE created_at >= NOW() - INTERVAL '7 days'
  `;

  const totalCount = await sql`
    SELECT COUNT(*) as count
    FROM demo_requests
  `;

  return {
    byStatus,
    byIndustry,
    recentCount: recentCount[0]?.count || 0,
    totalCount: totalCount[0]?.count || 0,
  };
}
