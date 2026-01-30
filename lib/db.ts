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
// INNOVATION IDEAS (Persistent Storage)
// ============================================

export async function initializeInnovationIdeasTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS innovation_ideas (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      angle TEXT,
      competitor_insight TEXT,
      checkit_opportunity TEXT,
      target_audience VARCHAR(255),
      content_types JSONB,
      key_messages JSONB,
      status VARCHAR(50) DEFAULT 'active',
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_innovation_ideas_status ON innovation_ideas(status)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_innovation_ideas_created ON innovation_ideas(created_at DESC)
  `;
}

export async function getInnovationIdeas(status?: string) {
  if (status) {
    return await sql`
      SELECT * FROM innovation_ideas 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
  }
  return await sql`
    SELECT * FROM innovation_ideas 
    ORDER BY created_at DESC
  `;
}

export async function saveInnovationIdea(idea: {
  title: string;
  angle?: string;
  competitorInsight?: string;
  checkitOpportunity?: string;
  targetAudience?: string;
  contentTypes?: string[];
  keyMessages?: string[];
}) {
  const result = await sql`
    INSERT INTO innovation_ideas (
      title, angle, competitor_insight, checkit_opportunity,
      target_audience, content_types, key_messages
    )
    VALUES (
      ${idea.title},
      ${idea.angle || null},
      ${idea.competitorInsight || null},
      ${idea.checkitOpportunity || null},
      ${idea.targetAudience || null},
      ${JSON.stringify(idea.contentTypes || [])},
      ${JSON.stringify(idea.keyMessages || [])}
    )
    RETURNING *
  `;
  return result[0];
}

export async function saveInnovationIdeasBatch(ideas: Array<{
  title: string;
  angle?: string;
  competitorInsight?: string;
  checkitOpportunity?: string;
  targetAudience?: string;
  contentTypes?: string[];
  keyMessages?: string[];
}>) {
  const results = [];
  for (const idea of ideas) {
    const saved = await saveInnovationIdea(idea);
    results.push(saved);
  }
  return results;
}

export async function markInnovationIdeaUsed(id: number) {
  const result = await sql`
    UPDATE innovation_ideas SET
      used_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function updateInnovationIdeaStatus(id: number, status: string) {
  const result = await sql`
    UPDATE innovation_ideas SET
      status = ${status}
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function deleteInnovationIdea(id: number) {
  await sql`DELETE FROM innovation_ideas WHERE id = ${id}`;
}

// ============================================
// COMPETITOR RESPONSES ("Our Take" Storage)
// ============================================

export async function initializeCompetitorResponsesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS competitor_responses (
      id SERIAL PRIMARY KEY,
      competitor_name VARCHAR(255) NOT NULL,
      source_article_title VARCHAR(500) NOT NULL,
      source_article_url TEXT,
      source_article_snippet TEXT,
      response_title VARCHAR(500),
      response_description TEXT,
      response_key_points JSONB,
      response_linkedin_post TEXT,
      response_article TEXT,
      response_word_count INTEGER,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_competitor_responses_competitor ON competitor_responses(competitor_name)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_competitor_responses_created ON competitor_responses(created_at DESC)
  `;
  
  // Create unique index on source URL to prevent duplicates
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_competitor_responses_source_url 
    ON competitor_responses(source_article_url) 
    WHERE source_article_url IS NOT NULL
  `;
}

export async function getCompetitorResponses() {
  return await sql`
    SELECT * FROM competitor_responses 
    ORDER BY created_at DESC
  `;
}

export async function getCompetitorResponseBySourceUrl(sourceUrl: string) {
  const result = await sql`
    SELECT * FROM competitor_responses 
    WHERE source_article_url = ${sourceUrl}
  `;
  return result[0] || null;
}

export async function saveCompetitorResponse(response: {
  competitorName: string;
  sourceArticleTitle: string;
  sourceArticleUrl?: string;
  sourceArticleSnippet?: string;
  responseTitle?: string;
  responseDescription?: string;
  responseKeyPoints?: string[];
  responseLinkedinPost?: string;
  responseArticle?: string;
  responseWordCount?: number;
}) {
  const result = await sql`
    INSERT INTO competitor_responses (
      competitor_name, source_article_title, source_article_url, source_article_snippet,
      response_title, response_description, response_key_points,
      response_linkedin_post, response_article, response_word_count
    )
    VALUES (
      ${response.competitorName},
      ${response.sourceArticleTitle},
      ${response.sourceArticleUrl || null},
      ${response.sourceArticleSnippet || null},
      ${response.responseTitle || null},
      ${response.responseDescription || null},
      ${JSON.stringify(response.responseKeyPoints || [])},
      ${response.responseLinkedinPost || null},
      ${response.responseArticle || null},
      ${response.responseWordCount || null}
    )
    ON CONFLICT (source_article_url) 
    DO UPDATE SET
      response_title = EXCLUDED.response_title,
      response_description = EXCLUDED.response_description,
      response_key_points = EXCLUDED.response_key_points,
      response_linkedin_post = EXCLUDED.response_linkedin_post,
      response_article = EXCLUDED.response_article,
      response_word_count = EXCLUDED.response_word_count
    RETURNING *
  `;
  return result[0];
}

export async function markCompetitorResponseUsed(id: number) {
  const result = await sql`
    UPDATE competitor_responses SET
      used_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function deleteCompetitorResponse(id: number) {
  await sql`DELETE FROM competitor_responses WHERE id = ${id}`;
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

// Get analytics summary with location exclusions (for filtering internal team visits)
export async function getOVGAnalyticsSummaryFiltered(
  daysBack: number = 30, 
  excludedLocations: Array<{ city: string; region?: string }> = []
) {
  // Build exclusion conditions - we need to exclude matching city+region combos
  const exclusionCities = excludedLocations.map(loc => loc.city);
  const exclusionRegions = excludedLocations.map(loc => loc.region || '');
  
  const totalViews = await sql`
    SELECT COUNT(*) as count
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND NOT (
        visitor_city = ANY(${exclusionCities}) 
        AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
      )
  `;

  const uniqueVisitors = await sql`
    SELECT COUNT(DISTINCT visitor_ip) as count
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_ip IS NOT NULL
      AND NOT (
        visitor_city = ANY(${exclusionCities}) 
        AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
      )
  `;

  const byLocation = await sql`
    SELECT visitor_city, visitor_region, visitor_country, COUNT(*) as views
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_city IS NOT NULL
      AND NOT (
        visitor_city = ANY(${exclusionCities}) 
        AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
      )
    GROUP BY visitor_city, visitor_region, visitor_country
    ORDER BY views DESC
    LIMIT 20
  `;

  const byDay = await sql`
    SELECT DATE(viewed_at) as date, COUNT(*) as views
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND NOT (
        visitor_city = ANY(${exclusionCities}) 
        AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
      )
    GROUP BY DATE(viewed_at)
    ORDER BY date DESC
  `;

  // Views by page
  const byPage = await sql`
    SELECT page_path, COUNT(*) as views
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND NOT (
        visitor_city = ANY(${exclusionCities}) 
        AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
      )
    GROUP BY page_path
    ORDER BY views DESC
  `;

  // Recent visitors with all their page visits (with device info)
  const recentVisitors = await sql`
    SELECT 
      visitor_ip,
      visitor_city,
      visitor_region,
      visitor_country,
      user_agent,
      referrer,
      MIN(viewed_at) as first_visit,
      MAX(viewed_at) as last_visit,
      COUNT(*) as page_count,
      ARRAY_AGG(DISTINCT page_path) as pages_visited
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_ip IS NOT NULL
      AND NOT (
        visitor_city = ANY(${exclusionCities}) 
        AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
      )
    GROUP BY visitor_ip, visitor_city, visitor_region, visitor_country, user_agent, referrer
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
        AND NOT (
          visitor_city = ANY(${exclusionCities}) 
          AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
        )
      GROUP BY visitor_ip
    ) as sessions
    GROUP BY page_count
    ORDER BY page_count
  `;

  // Count excluded views for transparency
  const excludedViews = await sql`
    SELECT COUNT(*) as count
    FROM ovg_page_analytics
    WHERE viewed_at >= NOW() - INTERVAL '1 day' * ${daysBack}
      AND visitor_city = ANY(${exclusionCities}) 
      AND (visitor_region = ANY(${exclusionRegions}) OR visitor_region IS NULL)
  `;

  return {
    totalViews: totalViews[0]?.count || 0,
    uniqueVisitors: uniqueVisitors[0]?.count || 0,
    excludedViews: excludedViews[0]?.count || 0,
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

// ============================================
// GOOGLE ADS DATA OPERATIONS
// ============================================

export async function initializeGoogleAdsTables() {
  // Campaigns table
  await sql`
    CREATE TABLE IF NOT EXISTS google_ads_campaigns (
      id SERIAL PRIMARY KEY,
      campaign_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      status TEXT,
      budget_amount DECIMAL(12,2),
      spend_mtd DECIMAL(12,2),
      spend_today DECIMAL(12,2),
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      conversions DECIMAL(10,2) DEFAULT 0,
      cost_per_conversion DECIMAL(10,2),
      ctr DECIMAL(6,4),
      synced_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Ads table (responsive search ads)
  await sql`
    CREATE TABLE IF NOT EXISTS google_ads_ads (
      id SERIAL PRIMARY KEY,
      ad_id TEXT NOT NULL UNIQUE,
      campaign_id TEXT NOT NULL,
      campaign_name TEXT,
      ad_group_id TEXT,
      ad_group_name TEXT,
      headlines JSONB DEFAULT '[]',
      descriptions JSONB DEFAULT '[]',
      final_urls JSONB DEFAULT '[]',
      path1 TEXT,
      path2 TEXT,
      ad_strength TEXT,
      status TEXT,
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      cost DECIMAL(12,2) DEFAULT 0,
      synced_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Keywords table
  await sql`
    CREATE TABLE IF NOT EXISTS google_ads_keywords (
      id SERIAL PRIMARY KEY,
      keyword_id TEXT NOT NULL UNIQUE,
      campaign_id TEXT NOT NULL,
      campaign_name TEXT,
      ad_group_id TEXT,
      ad_group_name TEXT,
      keyword_text TEXT NOT NULL,
      match_type TEXT,
      quality_score INTEGER,
      cpc_bid DECIMAL(10,2),
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      cost DECIMAL(12,2) DEFAULT 0,
      conversions DECIMAL(10,2) DEFAULT 0,
      ctr DECIMAL(6,4),
      status TEXT,
      synced_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Sync log table
  await sql`
    CREATE TABLE IF NOT EXISTS google_ads_sync_log (
      id SERIAL PRIMARY KEY,
      sync_type TEXT NOT NULL,
      status TEXT NOT NULL,
      campaigns_synced INTEGER DEFAULT 0,
      ads_synced INTEGER DEFAULT 0,
      keywords_synced INTEGER DEFAULT 0,
      error_message TEXT,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_google_ads_campaigns_status ON google_ads_campaigns(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_google_ads_ads_campaign ON google_ads_ads(campaign_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_google_ads_keywords_campaign ON google_ads_keywords(campaign_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_google_ads_sync_log_started ON google_ads_sync_log(started_at DESC)`;
}

// Types
export interface GoogleAdsCampaign {
  id: number;
  campaign_id: string;
  name: string;
  status: string | null;
  budget_amount: number | null;
  spend_mtd: number | null;
  spend_today: number | null;
  impressions: number;
  clicks: number;
  conversions: number;
  cost_per_conversion: number | null;
  ctr: number | null;
  synced_at: string;
}

export interface GoogleAdsAd {
  id: number;
  ad_id: string;
  campaign_id: string;
  campaign_name: string | null;
  ad_group_id: string | null;
  ad_group_name: string | null;
  headlines: string[];
  descriptions: string[];
  final_urls: string[];
  path1: string | null;
  path2: string | null;
  ad_strength: string | null;
  status: string | null;
  impressions: number;
  clicks: number;
  cost: number;
  synced_at: string;
}

export interface GoogleAdsKeyword {
  id: number;
  keyword_id: string;
  campaign_id: string;
  campaign_name: string | null;
  ad_group_id: string | null;
  ad_group_name: string | null;
  keyword_text: string;
  match_type: string | null;
  quality_score: number | null;
  cpc_bid: number | null;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number | null;
  status: string | null;
  synced_at: string;
}

export interface GoogleAdsSyncLog {
  id: number;
  sync_type: string;
  status: string;
  campaigns_synced: number;
  ads_synced: number;
  keywords_synced: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

// Campaign operations
export async function upsertGoogleAdsCampaign(campaign: {
  campaignId: string;
  name: string;
  status?: string;
  budgetAmount?: number;
  spendMtd?: number;
  spendToday?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  costPerConversion?: number;
  ctr?: number;
}) {
  const result = await sql`
    INSERT INTO google_ads_campaigns (
      campaign_id, name, status, budget_amount, spend_mtd, spend_today,
      impressions, clicks, conversions, cost_per_conversion, ctr, synced_at
    )
    VALUES (
      ${campaign.campaignId}, ${campaign.name}, ${campaign.status || null},
      ${campaign.budgetAmount || null}, ${campaign.spendMtd || null}, ${campaign.spendToday || null},
      ${campaign.impressions || 0}, ${campaign.clicks || 0}, ${campaign.conversions || 0},
      ${campaign.costPerConversion || null}, ${campaign.ctr || null}, NOW()
    )
    ON CONFLICT (campaign_id) DO UPDATE SET
      name = ${campaign.name},
      status = COALESCE(${campaign.status || null}, google_ads_campaigns.status),
      budget_amount = COALESCE(${campaign.budgetAmount || null}, google_ads_campaigns.budget_amount),
      spend_mtd = COALESCE(${campaign.spendMtd || null}, google_ads_campaigns.spend_mtd),
      spend_today = COALESCE(${campaign.spendToday || null}, google_ads_campaigns.spend_today),
      impressions = ${campaign.impressions || 0},
      clicks = ${campaign.clicks || 0},
      conversions = ${campaign.conversions || 0},
      cost_per_conversion = COALESCE(${campaign.costPerConversion || null}, google_ads_campaigns.cost_per_conversion),
      ctr = COALESCE(${campaign.ctr || null}, google_ads_campaigns.ctr),
      synced_at = NOW()
    RETURNING *
  `;
  return result[0] as GoogleAdsCampaign;
}

export async function getGoogleAdsCampaigns() {
  return await sql`
    SELECT * FROM google_ads_campaigns
    ORDER BY spend_mtd DESC NULLS LAST, name
  ` as GoogleAdsCampaign[];
}

// Ad operations
export async function upsertGoogleAdsAd(ad: {
  adId: string;
  campaignId: string;
  campaignName?: string;
  adGroupId?: string;
  adGroupName?: string;
  headlines?: string[];
  descriptions?: string[];
  finalUrls?: string[];
  path1?: string;
  path2?: string;
  adStrength?: string;
  status?: string;
  impressions?: number;
  clicks?: number;
  cost?: number;
}) {
  const result = await sql`
    INSERT INTO google_ads_ads (
      ad_id, campaign_id, campaign_name, ad_group_id, ad_group_name,
      headlines, descriptions, final_urls, path1, path2, ad_strength, status,
      impressions, clicks, cost, synced_at
    )
    VALUES (
      ${ad.adId}, ${ad.campaignId}, ${ad.campaignName || null},
      ${ad.adGroupId || null}, ${ad.adGroupName || null},
      ${JSON.stringify(ad.headlines || [])}, ${JSON.stringify(ad.descriptions || [])},
      ${JSON.stringify(ad.finalUrls || [])}, ${ad.path1 || null}, ${ad.path2 || null},
      ${ad.adStrength || null}, ${ad.status || null},
      ${ad.impressions || 0}, ${ad.clicks || 0}, ${ad.cost || 0}, NOW()
    )
    ON CONFLICT (ad_id) DO UPDATE SET
      campaign_id = ${ad.campaignId},
      campaign_name = COALESCE(${ad.campaignName || null}, google_ads_ads.campaign_name),
      ad_group_id = COALESCE(${ad.adGroupId || null}, google_ads_ads.ad_group_id),
      ad_group_name = COALESCE(${ad.adGroupName || null}, google_ads_ads.ad_group_name),
      headlines = ${JSON.stringify(ad.headlines || [])},
      descriptions = ${JSON.stringify(ad.descriptions || [])},
      final_urls = ${JSON.stringify(ad.finalUrls || [])},
      path1 = COALESCE(${ad.path1 || null}, google_ads_ads.path1),
      path2 = COALESCE(${ad.path2 || null}, google_ads_ads.path2),
      ad_strength = COALESCE(${ad.adStrength || null}, google_ads_ads.ad_strength),
      status = COALESCE(${ad.status || null}, google_ads_ads.status),
      impressions = ${ad.impressions || 0},
      clicks = ${ad.clicks || 0},
      cost = ${ad.cost || 0},
      synced_at = NOW()
    RETURNING *
  `;
  return result[0] as GoogleAdsAd;
}

export async function getGoogleAdsAds(campaignId?: string) {
  if (campaignId) {
    return await sql`
      SELECT * FROM google_ads_ads
      WHERE campaign_id = ${campaignId}
      ORDER BY impressions DESC, ad_group_name
    ` as GoogleAdsAd[];
  }
  return await sql`
    SELECT * FROM google_ads_ads
    ORDER BY impressions DESC, campaign_name, ad_group_name
  ` as GoogleAdsAd[];
}

// Keyword operations
export async function upsertGoogleAdsKeyword(keyword: {
  keywordId: string;
  campaignId: string;
  campaignName?: string;
  adGroupId?: string;
  adGroupName?: string;
  keywordText: string;
  matchType?: string;
  qualityScore?: number | null;
  cpcBid?: number;
  impressions?: number;
  clicks?: number;
  cost?: number;
  conversions?: number;
  ctr?: number;
  status?: string;
}) {
  const result = await sql`
    INSERT INTO google_ads_keywords (
      keyword_id, campaign_id, campaign_name, ad_group_id, ad_group_name,
      keyword_text, match_type, quality_score, cpc_bid,
      impressions, clicks, cost, conversions, ctr, status, synced_at
    )
    VALUES (
      ${keyword.keywordId}, ${keyword.campaignId}, ${keyword.campaignName || null},
      ${keyword.adGroupId || null}, ${keyword.adGroupName || null},
      ${keyword.keywordText}, ${keyword.matchType || null}, ${keyword.qualityScore || null},
      ${keyword.cpcBid || null}, ${keyword.impressions || 0}, ${keyword.clicks || 0},
      ${keyword.cost || 0}, ${keyword.conversions || 0}, ${keyword.ctr || null},
      ${keyword.status || null}, NOW()
    )
    ON CONFLICT (keyword_id) DO UPDATE SET
      campaign_id = ${keyword.campaignId},
      campaign_name = COALESCE(${keyword.campaignName || null}, google_ads_keywords.campaign_name),
      ad_group_id = COALESCE(${keyword.adGroupId || null}, google_ads_keywords.ad_group_id),
      ad_group_name = COALESCE(${keyword.adGroupName || null}, google_ads_keywords.ad_group_name),
      keyword_text = ${keyword.keywordText},
      match_type = COALESCE(${keyword.matchType || null}, google_ads_keywords.match_type),
      quality_score = COALESCE(${keyword.qualityScore || null}, google_ads_keywords.quality_score),
      cpc_bid = COALESCE(${keyword.cpcBid || null}, google_ads_keywords.cpc_bid),
      impressions = ${keyword.impressions || 0},
      clicks = ${keyword.clicks || 0},
      cost = ${keyword.cost || 0},
      conversions = ${keyword.conversions || 0},
      ctr = COALESCE(${keyword.ctr || null}, google_ads_keywords.ctr),
      status = COALESCE(${keyword.status || null}, google_ads_keywords.status),
      synced_at = NOW()
    RETURNING *
  `;
  return result[0] as GoogleAdsKeyword;
}

export async function getGoogleAdsKeywords(campaignId?: string) {
  if (campaignId) {
    return await sql`
      SELECT * FROM google_ads_keywords
      WHERE campaign_id = ${campaignId}
      ORDER BY impressions DESC, keyword_text
    ` as GoogleAdsKeyword[];
  }
  return await sql`
    SELECT * FROM google_ads_keywords
    ORDER BY impressions DESC, campaign_name, keyword_text
  ` as GoogleAdsKeyword[];
}

// Sync log operations
export async function createSyncLog(syncType: string) {
  const result = await sql`
    INSERT INTO google_ads_sync_log (sync_type, status)
    VALUES (${syncType}, 'in_progress')
    RETURNING *
  `;
  return result[0] as GoogleAdsSyncLog;
}

export async function updateSyncLog(id: number, updates: {
  status: string;
  campaignsSynced?: number;
  adsSynced?: number;
  keywordsSynced?: number;
  errorMessage?: string;
}) {
  const result = await sql`
    UPDATE google_ads_sync_log SET
      status = ${updates.status},
      campaigns_synced = COALESCE(${updates.campaignsSynced || null}, campaigns_synced),
      ads_synced = COALESCE(${updates.adsSynced || null}, ads_synced),
      keywords_synced = COALESCE(${updates.keywordsSynced || null}, keywords_synced),
      error_message = ${updates.errorMessage || null},
      completed_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as GoogleAdsSyncLog;
}

export async function getLatestSyncLog() {
  const result = await sql`
    SELECT * FROM google_ads_sync_log
    ORDER BY started_at DESC
    LIMIT 1
  `;
  return result[0] as GoogleAdsSyncLog | undefined;
}

export async function getGoogleAdsSummary() {
  const campaigns = await sql`
    SELECT 
      COUNT(*) as total_campaigns,
      COUNT(CASE WHEN status = 'ENABLED' THEN 1 END) as active_campaigns,
      SUM(spend_mtd) as total_spend_mtd,
      SUM(impressions) as total_impressions,
      SUM(clicks) as total_clicks,
      SUM(conversions) as total_conversions
    FROM google_ads_campaigns
  `;
  
  const lastSync = await getLatestSyncLog();
  
  return {
    totalCampaigns: campaigns[0]?.total_campaigns || 0,
    activeCampaigns: campaigns[0]?.active_campaigns || 0,
    totalSpendMtd: campaigns[0]?.total_spend_mtd || 0,
    totalImpressions: campaigns[0]?.total_impressions || 0,
    totalClicks: campaigns[0]?.total_clicks || 0,
    totalConversions: campaigns[0]?.total_conversions || 0,
    lastSyncedAt: lastSync?.completed_at || lastSync?.started_at || null,
    lastSyncStatus: lastSync?.status || null,
  };
}

// ============================================
// Reddit Monitor Tables and Operations
// ============================================

export interface RedditKeyword {
  id: number;
  keyword: string;
  subreddits: string[];
  is_active: boolean;
  created_at: Date;
}

export interface RedditPostRecord {
  id: number;
  post_id: string;
  keyword_id: number;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  permalink: string;
  created_utc: number;
  is_lead: boolean;
  notes: string | null;
  fetched_at: Date;
}

export interface RedditSyncLog {
  id: number;
  sync_type: string;
  status: string;
  posts_fetched: number;
  started_at: Date;
  completed_at: Date | null;
  error_message: string | null;
}

export async function initializeRedditTables() {
  // Keywords to monitor
  await sql`
    CREATE TABLE IF NOT EXISTS reddit_keywords (
      id SERIAL PRIMARY KEY,
      keyword TEXT NOT NULL UNIQUE,
      subreddits JSONB DEFAULT '[]',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Cached posts from Reddit
  await sql`
    CREATE TABLE IF NOT EXISTS reddit_posts (
      id SERIAL PRIMARY KEY,
      post_id TEXT NOT NULL UNIQUE,
      keyword_id INTEGER REFERENCES reddit_keywords(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      selftext TEXT,
      author TEXT,
      subreddit TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      num_comments INTEGER DEFAULT 0,
      permalink TEXT NOT NULL,
      created_utc BIGINT,
      is_lead BOOLEAN DEFAULT false,
      notes TEXT,
      fetched_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Sync log for Reddit
  await sql`
    CREATE TABLE IF NOT EXISTS reddit_sync_log (
      id SERIAL PRIMARY KEY,
      sync_type TEXT NOT NULL,
      status TEXT DEFAULT 'running',
      posts_fetched INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      error_message TEXT
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_reddit_posts_keyword ON reddit_posts(keyword_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit ON reddit_posts(subreddit)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_reddit_posts_created ON reddit_posts(created_utc DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_reddit_posts_lead ON reddit_posts(is_lead) WHERE is_lead = true`;
}

// Keyword operations
export async function createRedditKeyword(keyword: string, subreddits: string[] = []) {
  const result = await sql`
    INSERT INTO reddit_keywords (keyword, subreddits)
    VALUES (${keyword}, ${JSON.stringify(subreddits)})
    ON CONFLICT (keyword) DO UPDATE SET
      subreddits = ${JSON.stringify(subreddits)},
      is_active = true
    RETURNING *
  `;
  return result[0] as RedditKeyword;
}

export async function getRedditKeywords(activeOnly = true) {
  if (activeOnly) {
    return await sql`
      SELECT * FROM reddit_keywords WHERE is_active = true ORDER BY created_at DESC
    ` as RedditKeyword[];
  }
  return await sql`
    SELECT * FROM reddit_keywords ORDER BY created_at DESC
  ` as RedditKeyword[];
}

export async function deleteRedditKeyword(id: number) {
  await sql`DELETE FROM reddit_keywords WHERE id = ${id}`;
}

export async function toggleRedditKeyword(id: number, isActive: boolean) {
  await sql`UPDATE reddit_keywords SET is_active = ${isActive} WHERE id = ${id}`;
}

// Post operations
export async function upsertRedditPost(post: {
  post_id: string;
  keyword_id: number;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  permalink: string;
  created_utc: number;
}) {
  const result = await sql`
    INSERT INTO reddit_posts (
      post_id, keyword_id, title, selftext, author, subreddit,
      score, num_comments, permalink, created_utc
    ) VALUES (
      ${post.post_id}, ${post.keyword_id}, ${post.title}, ${post.selftext},
      ${post.author}, ${post.subreddit}, ${post.score}, ${post.num_comments},
      ${post.permalink}, ${post.created_utc}
    )
    ON CONFLICT (post_id) DO UPDATE SET
      score = ${post.score},
      num_comments = ${post.num_comments},
      fetched_at = NOW()
    RETURNING *
  `;
  return result[0] as RedditPostRecord;
}

export async function getRedditPosts(options: {
  keywordId?: number;
  subreddit?: string;
  leadsOnly?: boolean;
  limit?: number;
} = {}) {
  const { keywordId, subreddit, leadsOnly, limit = 100 } = options;
  
  if (keywordId && leadsOnly) {
    return await sql`
      SELECT rp.*, rk.keyword 
      FROM reddit_posts rp
      JOIN reddit_keywords rk ON rp.keyword_id = rk.id
      WHERE rp.keyword_id = ${keywordId} AND rp.is_lead = true
      ORDER BY rp.created_utc DESC
      LIMIT ${limit}
    ` as (RedditPostRecord & { keyword: string })[];
  }
  
  if (keywordId) {
    return await sql`
      SELECT rp.*, rk.keyword 
      FROM reddit_posts rp
      JOIN reddit_keywords rk ON rp.keyword_id = rk.id
      WHERE rp.keyword_id = ${keywordId}
      ORDER BY rp.created_utc DESC
      LIMIT ${limit}
    ` as (RedditPostRecord & { keyword: string })[];
  }
  
  if (subreddit) {
    return await sql`
      SELECT rp.*, rk.keyword 
      FROM reddit_posts rp
      JOIN reddit_keywords rk ON rp.keyword_id = rk.id
      WHERE rp.subreddit = ${subreddit}
      ORDER BY rp.created_utc DESC
      LIMIT ${limit}
    ` as (RedditPostRecord & { keyword: string })[];
  }
  
  if (leadsOnly) {
    return await sql`
      SELECT rp.*, rk.keyword 
      FROM reddit_posts rp
      JOIN reddit_keywords rk ON rp.keyword_id = rk.id
      WHERE rp.is_lead = true
      ORDER BY rp.created_utc DESC
      LIMIT ${limit}
    ` as (RedditPostRecord & { keyword: string })[];
  }
  
  return await sql`
    SELECT rp.*, rk.keyword 
    FROM reddit_posts rp
    JOIN reddit_keywords rk ON rp.keyword_id = rk.id
    ORDER BY rp.created_utc DESC
    LIMIT ${limit}
  ` as (RedditPostRecord & { keyword: string })[];
}

export async function markPostAsLead(postId: number, isLead: boolean, notes?: string) {
  await sql`
    UPDATE reddit_posts 
    SET is_lead = ${isLead}, notes = ${notes || null}
    WHERE id = ${postId}
  `;
}

// Sync log operations
export async function createRedditSyncLog(syncType: string) {
  const result = await sql`
    INSERT INTO reddit_sync_log (sync_type)
    VALUES (${syncType})
    RETURNING *
  `;
  return result[0] as RedditSyncLog;
}

export async function updateRedditSyncLog(id: number, updates: {
  status: string;
  postsFetched?: number;
  errorMessage?: string;
}) {
  const result = await sql`
    UPDATE reddit_sync_log SET
      status = ${updates.status},
      posts_fetched = COALESCE(${updates.postsFetched || null}, posts_fetched),
      error_message = ${updates.errorMessage || null},
      completed_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as RedditSyncLog;
}

export async function getLatestRedditSyncLog() {
  const result = await sql`
    SELECT * FROM reddit_sync_log
    ORDER BY started_at DESC
    LIMIT 1
  `;
  return result[0] as RedditSyncLog | undefined;
}

export async function getRedditSummary() {
  const stats = await sql`
    SELECT 
      COUNT(DISTINCT rk.id) as total_keywords,
      COUNT(DISTINCT rk.id) FILTER (WHERE rk.is_active) as active_keywords,
      COUNT(rp.id) as total_posts,
      COUNT(rp.id) FILTER (WHERE rp.is_lead) as total_leads,
      COUNT(DISTINCT rp.subreddit) as subreddits_monitored
    FROM reddit_keywords rk
    LEFT JOIN reddit_posts rp ON rp.keyword_id = rk.id
  `;
  
  const lastSync = await getLatestRedditSyncLog();
  
  return {
    totalKeywords: Number(stats[0]?.total_keywords) || 0,
    activeKeywords: Number(stats[0]?.active_keywords) || 0,
    totalPosts: Number(stats[0]?.total_posts) || 0,
    totalLeads: Number(stats[0]?.total_leads) || 0,
    subredditsMonitored: Number(stats[0]?.subreddits_monitored) || 0,
    lastSyncedAt: lastSync?.completed_at || lastSync?.started_at || null,
    lastSyncStatus: lastSync?.status || null,
  };
}

// ============================================
// Google Search Console Tables and Operations
// ============================================

export interface SearchConsoleQuery {
  id: number;
  site_url: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date_range_start: string;
  date_range_end: string;
  synced_at: Date;
}

export interface SearchConsolePage {
  id: number;
  site_url: string;
  page_url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date_range_start: string;
  date_range_end: string;
  synced_at: Date;
}

export interface SearchConsoleSyncLog {
  id: number;
  site_url: string;
  sync_type: string;
  status: string;
  queries_synced: number;
  pages_synced: number;
  started_at: Date;
  completed_at: Date | null;
  error_message: string | null;
}

export async function initializeSearchConsoleTables() {
  // Queries table
  await sql`
    CREATE TABLE IF NOT EXISTS search_console_queries (
      id SERIAL PRIMARY KEY,
      site_url TEXT NOT NULL,
      query TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      ctr DECIMAL(6,4) DEFAULT 0,
      position DECIMAL(6,2) DEFAULT 0,
      date_range_start DATE NOT NULL,
      date_range_end DATE NOT NULL,
      synced_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(site_url, query, date_range_start, date_range_end)
    )
  `;

  // Pages table
  await sql`
    CREATE TABLE IF NOT EXISTS search_console_pages (
      id SERIAL PRIMARY KEY,
      site_url TEXT NOT NULL,
      page_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      ctr DECIMAL(6,4) DEFAULT 0,
      position DECIMAL(6,2) DEFAULT 0,
      date_range_start DATE NOT NULL,
      date_range_end DATE NOT NULL,
      synced_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(site_url, page_url, date_range_start, date_range_end)
    )
  `;

  // Summary/totals table
  await sql`
    CREATE TABLE IF NOT EXISTS search_console_totals (
      id SERIAL PRIMARY KEY,
      site_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      ctr DECIMAL(6,4) DEFAULT 0,
      position DECIMAL(6,2) DEFAULT 0,
      date_range_start DATE NOT NULL,
      date_range_end DATE NOT NULL,
      synced_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(site_url, date_range_start, date_range_end)
    )
  `;

  // Sync log
  await sql`
    CREATE TABLE IF NOT EXISTS search_console_sync_log (
      id SERIAL PRIMARY KEY,
      site_url TEXT NOT NULL,
      sync_type TEXT NOT NULL,
      status TEXT DEFAULT 'running',
      queries_synced INTEGER DEFAULT 0,
      pages_synced INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      error_message TEXT
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_sc_queries_site ON search_console_queries(site_url)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sc_queries_clicks ON search_console_queries(clicks DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sc_pages_site ON search_console_pages(site_url)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sc_pages_clicks ON search_console_pages(clicks DESC)`;
}

// Upsert query data
export async function upsertSearchConsoleQuery(data: {
  siteUrl: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  dateRangeStart: string;
  dateRangeEnd: string;
}) {
  const result = await sql`
    INSERT INTO search_console_queries (
      site_url, query, clicks, impressions, ctr, position,
      date_range_start, date_range_end
    ) VALUES (
      ${data.siteUrl}, ${data.query}, ${data.clicks}, ${data.impressions},
      ${data.ctr}, ${data.position}, ${data.dateRangeStart}, ${data.dateRangeEnd}
    )
    ON CONFLICT (site_url, query, date_range_start, date_range_end) DO UPDATE SET
      clicks = ${data.clicks},
      impressions = ${data.impressions},
      ctr = ${data.ctr},
      position = ${data.position},
      synced_at = NOW()
    RETURNING *
  `;
  return result[0] as SearchConsoleQuery;
}

// Upsert page data
export async function upsertSearchConsolePage(data: {
  siteUrl: string;
  pageUrl: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  dateRangeStart: string;
  dateRangeEnd: string;
}) {
  const result = await sql`
    INSERT INTO search_console_pages (
      site_url, page_url, clicks, impressions, ctr, position,
      date_range_start, date_range_end
    ) VALUES (
      ${data.siteUrl}, ${data.pageUrl}, ${data.clicks}, ${data.impressions},
      ${data.ctr}, ${data.position}, ${data.dateRangeStart}, ${data.dateRangeEnd}
    )
    ON CONFLICT (site_url, page_url, date_range_start, date_range_end) DO UPDATE SET
      clicks = ${data.clicks},
      impressions = ${data.impressions},
      ctr = ${data.ctr},
      position = ${data.position},
      synced_at = NOW()
    RETURNING *
  `;
  return result[0] as SearchConsolePage;
}

// Upsert totals
export async function upsertSearchConsoleTotals(data: {
  siteUrl: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  dateRangeStart: string;
  dateRangeEnd: string;
}) {
  await sql`
    INSERT INTO search_console_totals (
      site_url, clicks, impressions, ctr, position,
      date_range_start, date_range_end
    ) VALUES (
      ${data.siteUrl}, ${data.clicks}, ${data.impressions},
      ${data.ctr}, ${data.position}, ${data.dateRangeStart}, ${data.dateRangeEnd}
    )
    ON CONFLICT (site_url, date_range_start, date_range_end) DO UPDATE SET
      clicks = ${data.clicks},
      impressions = ${data.impressions},
      ctr = ${data.ctr},
      position = ${data.position},
      synced_at = NOW()
  `;
}

// Get queries
export async function getSearchConsoleQueries(siteUrl: string, limit = 100) {
  return await sql`
    SELECT * FROM search_console_queries
    WHERE site_url = ${siteUrl}
    ORDER BY clicks DESC
    LIMIT ${limit}
  ` as SearchConsoleQuery[];
}

// Get pages
export async function getSearchConsolePages(siteUrl: string, limit = 100) {
  return await sql`
    SELECT * FROM search_console_pages
    WHERE site_url = ${siteUrl}
    ORDER BY clicks DESC
    LIMIT ${limit}
  ` as SearchConsolePage[];
}

// Get totals
export async function getSearchConsoleTotals(siteUrl: string) {
  const result = await sql`
    SELECT * FROM search_console_totals
    WHERE site_url = ${siteUrl}
    ORDER BY synced_at DESC
    LIMIT 1
  `;
  return result[0] || null;
}

// Sync log operations
export async function createSearchConsoleSyncLog(siteUrl: string, syncType: string) {
  const result = await sql`
    INSERT INTO search_console_sync_log (site_url, sync_type)
    VALUES (${siteUrl}, ${syncType})
    RETURNING *
  `;
  return result[0] as SearchConsoleSyncLog;
}

export async function updateSearchConsoleSyncLog(id: number, updates: {
  status: string;
  queriesSynced?: number;
  pagesSynced?: number;
  errorMessage?: string;
}) {
  const result = await sql`
    UPDATE search_console_sync_log SET
      status = ${updates.status},
      queries_synced = COALESCE(${updates.queriesSynced || null}, queries_synced),
      pages_synced = COALESCE(${updates.pagesSynced || null}, pages_synced),
      error_message = ${updates.errorMessage || null},
      completed_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as SearchConsoleSyncLog;
}

export async function getLatestSearchConsoleSyncLog(siteUrl?: string) {
  if (siteUrl) {
    const result = await sql`
      SELECT * FROM search_console_sync_log
      WHERE site_url = ${siteUrl}
      ORDER BY started_at DESC
      LIMIT 1
    `;
    return result[0] as SearchConsoleSyncLog | undefined;
  }
  const result = await sql`
    SELECT * FROM search_console_sync_log
    ORDER BY started_at DESC
    LIMIT 1
  `;
  return result[0] as SearchConsoleSyncLog | undefined;
}

export async function getSearchConsoleSummary(siteUrl: string) {
  const totals = await getSearchConsoleTotals(siteUrl);
  const queries = await sql`
    SELECT COUNT(*) as count FROM search_console_queries WHERE site_url = ${siteUrl}
  `;
  const pages = await sql`
    SELECT COUNT(*) as count FROM search_console_pages WHERE site_url = ${siteUrl}
  `;
  const lastSync = await getLatestSearchConsoleSyncLog(siteUrl);

  return {
    totalClicks: totals?.clicks || 0,
    totalImpressions: totals?.impressions || 0,
    avgCtr: totals?.ctr || 0,
    avgPosition: totals?.position || 0,
    queriesTracked: Number(queries[0]?.count) || 0,
    pagesTracked: Number(pages[0]?.count) || 0,
    lastSyncedAt: lastSync?.completed_at || lastSync?.started_at || null,
    lastSyncStatus: lastSync?.status || null,
  };
}

// ============================================
// AI Search Monitor Tables and Operations
// ============================================

export interface AISearchQuery {
  id: number;
  query: string;
  is_active: boolean;
  created_at: Date;
}

export interface AISearchResult {
  id: number;
  query_id: number;
  query_text: string;
  response: string;
  checkit_mentioned: boolean;
  checkit_position: number | null;
  competitors_mentioned: string[];
  brands_data: Record<string, unknown>;
  source: string;
  scanned_at: Date;
}

export interface AISearchScan {
  id: number;
  status: string;
  total_queries: number;
  checkit_mentions: number;
  started_at: Date;
  completed_at: Date | null;
}

export async function initializeAISearchTables() {
  // Queries to monitor
  await sql`
    CREATE TABLE IF NOT EXISTS ai_search_queries (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL UNIQUE,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Search results
  await sql`
    CREATE TABLE IF NOT EXISTS ai_search_results (
      id SERIAL PRIMARY KEY,
      query_id INTEGER REFERENCES ai_search_queries(id) ON DELETE CASCADE,
      query_text TEXT NOT NULL,
      response TEXT NOT NULL,
      checkit_mentioned BOOLEAN DEFAULT false,
      checkit_position INTEGER,
      competitors_mentioned JSONB DEFAULT '[]',
      brands_data JSONB DEFAULT '{}',
      source TEXT DEFAULT 'openai',
      scanned_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Scan log
  await sql`
    CREATE TABLE IF NOT EXISTS ai_search_scans (
      id SERIAL PRIMARY KEY,
      status TEXT DEFAULT 'running',
      total_queries INTEGER DEFAULT 0,
      checkit_mentions INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_ai_results_query ON ai_search_results(query_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ai_results_scanned ON ai_search_results(scanned_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ai_results_checkit ON ai_search_results(checkit_mentioned)`;
}

// Query management
export async function createAISearchQuery(query: string) {
  const result = await sql`
    INSERT INTO ai_search_queries (query)
    VALUES (${query})
    ON CONFLICT (query) DO UPDATE SET is_active = true
    RETURNING *
  `;
  return result[0] as AISearchQuery;
}

export async function getAISearchQueries(activeOnly = true) {
  if (activeOnly) {
    return await sql`
      SELECT * FROM ai_search_queries WHERE is_active = true ORDER BY created_at
    ` as AISearchQuery[];
  }
  return await sql`
    SELECT * FROM ai_search_queries ORDER BY created_at
  ` as AISearchQuery[];
}

export async function deleteAISearchQuery(id: number) {
  await sql`DELETE FROM ai_search_queries WHERE id = ${id}`;
}

// Results management
export async function saveAISearchResult(data: {
  queryId: number;
  queryText: string;
  response: string;
  checkitMentioned: boolean;
  checkitPosition: number | null;
  competitorsMentioned: string[];
  brandsData: Record<string, unknown>;
  source: string;
}) {
  const result = await sql`
    INSERT INTO ai_search_results (
      query_id, query_text, response, checkit_mentioned, checkit_position,
      competitors_mentioned, brands_data, source
    ) VALUES (
      ${data.queryId}, ${data.queryText}, ${data.response}, ${data.checkitMentioned},
      ${data.checkitPosition}, ${JSON.stringify(data.competitorsMentioned)},
      ${JSON.stringify(data.brandsData)}, ${data.source}
    )
    RETURNING *
  `;
  return result[0] as AISearchResult;
}

export async function getLatestAISearchResults(limit = 50) {
  return await sql`
    SELECT r.*, q.query as original_query
    FROM ai_search_results r
    JOIN ai_search_queries q ON r.query_id = q.id
    ORDER BY r.scanned_at DESC
    LIMIT ${limit}
  ` as (AISearchResult & { original_query: string })[];
}

export async function getAISearchResultsByQuery(queryId: number, limit = 10) {
  return await sql`
    SELECT * FROM ai_search_results
    WHERE query_id = ${queryId}
    ORDER BY scanned_at DESC
    LIMIT ${limit}
  ` as AISearchResult[];
}

// Scan management
export async function createAISearchScan() {
  const result = await sql`
    INSERT INTO ai_search_scans (status) VALUES ('running')
    RETURNING *
  `;
  return result[0] as AISearchScan;
}

export async function updateAISearchScan(id: number, updates: {
  status: string;
  totalQueries?: number;
  checkitMentions?: number;
}) {
  const result = await sql`
    UPDATE ai_search_scans SET
      status = ${updates.status},
      total_queries = COALESCE(${updates.totalQueries || null}, total_queries),
      checkit_mentions = COALESCE(${updates.checkitMentions || null}, checkit_mentions),
      completed_at = CASE WHEN ${updates.status} IN ('completed', 'failed') THEN NOW() ELSE completed_at END
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as AISearchScan;
}

export async function getLatestAISearchScan() {
  const result = await sql`
    SELECT * FROM ai_search_scans
    ORDER BY started_at DESC
    LIMIT 1
  `;
  return result[0] as AISearchScan | undefined;
}

// Summary statistics
export async function getAISearchSummary() {
  // Get latest results for each query (most recent scan)
  const latestScan = await getLatestAISearchScan();
  
  const stats = await sql`
    SELECT
      COUNT(DISTINCT query_id) as total_queries,
      COUNT(*) as total_scans,
      COUNT(*) FILTER (WHERE checkit_mentioned) as checkit_mentions,
      AVG(checkit_position) FILTER (WHERE checkit_position IS NOT NULL) as avg_position
    FROM ai_search_results
    WHERE scanned_at > NOW() - INTERVAL '7 days'
  `;

  // Get competitor frequency
  const competitorStats = await sql`
    SELECT 
      jsonb_array_elements_text(competitors_mentioned) as competitor,
      COUNT(*) as mentions
    FROM ai_search_results
    WHERE scanned_at > NOW() - INTERVAL '7 days'
    GROUP BY competitor
    ORDER BY mentions DESC
    LIMIT 10
  `;

  return {
    totalQueries: Number(stats[0]?.total_queries) || 0,
    totalScans: Number(stats[0]?.total_scans) || 0,
    checkitMentions: Number(stats[0]?.checkit_mentions) || 0,
    checkitMentionRate: stats[0]?.total_scans > 0 
      ? Number(stats[0]?.checkit_mentions) / Number(stats[0]?.total_scans) 
      : 0,
    avgPosition: stats[0]?.avg_position ? Number(stats[0]?.avg_position) : null,
    topCompetitors: competitorStats.map(c => ({
      name: c.competitor as string,
      mentions: Number(c.mentions),
    })),
    lastScanAt: latestScan?.completed_at || latestScan?.started_at || null,
    lastScanStatus: latestScan?.status || null,
  };
}

// ============================================
// AI Search Trending & History
// ============================================

export interface TrendDataPoint {
  date: string;
  checkitMentioned: boolean;
  checkitPosition: number | null;
  competitorsMentioned: string[];
}

export interface QueryTrend {
  queryId: number;
  queryText: string;
  dataPoints: TrendDataPoint[];
  mentionRate: number;
  avgPosition: number | null;
  positionTrend: 'improving' | 'declining' | 'stable' | 'new';
  competitorFrequency: Record<string, number>;
}

// Get historical results for trending (grouped by day)
export async function getQueryTrends(days = 30): Promise<QueryTrend[]> {
  // Calculate the cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Get all results from the past N days
  const results = await sql`
    SELECT 
      query_id,
      query_text,
      DATE(scanned_at) as scan_date,
      checkit_mentioned,
      checkit_position,
      competitors_mentioned,
      scanned_at
    FROM ai_search_results
    WHERE scanned_at > ${cutoffDate.toISOString()}
    ORDER BY query_text, scan_date DESC
  `;

  // Group by query
  const queryMap = new Map<number, {
    queryId: number;
    queryText: string;
    dataPoints: TrendDataPoint[];
  }>();

  for (const row of results) {
    const queryId = row.query_id as number;
    if (!queryMap.has(queryId)) {
      queryMap.set(queryId, {
        queryId,
        queryText: row.query_text as string,
        dataPoints: [],
      });
    }
    
    const query = queryMap.get(queryId)!;
    // Only keep one result per day per query (the most recent)
    const dateStr = (row.scan_date as Date).toISOString().split('T')[0];
    if (!query.dataPoints.find(d => d.date === dateStr)) {
      query.dataPoints.push({
        date: dateStr,
        checkitMentioned: row.checkit_mentioned as boolean,
        checkitPosition: row.checkit_position as number | null,
        competitorsMentioned: row.competitors_mentioned as string[],
      });
    }
  }

  // Calculate trends for each query
  const trends: QueryTrend[] = [];
  
  for (const query of queryMap.values()) {
    const dataPoints = query.dataPoints.sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate mention rate
    const mentionCount = dataPoints.filter(d => d.checkitMentioned).length;
    const mentionRate = dataPoints.length > 0 ? mentionCount / dataPoints.length : 0;
    
    // Calculate average position (when mentioned)
    const positions = dataPoints
      .filter(d => d.checkitPosition !== null)
      .map(d => d.checkitPosition as number);
    const avgPosition = positions.length > 0 
      ? positions.reduce((a, b) => a + b, 0) / positions.length 
      : null;
    
    // Calculate position trend (comparing first half to second half)
    let positionTrend: QueryTrend['positionTrend'] = 'new';
    if (dataPoints.length >= 4) {
      const midpoint = Math.floor(dataPoints.length / 2);
      const firstHalf = dataPoints.slice(0, midpoint);
      const secondHalf = dataPoints.slice(midpoint);
      
      const firstMentions = firstHalf.filter(d => d.checkitMentioned).length / firstHalf.length;
      const secondMentions = secondHalf.filter(d => d.checkitMentioned).length / secondHalf.length;
      
      if (secondMentions > firstMentions + 0.1) {
        positionTrend = 'improving';
      } else if (secondMentions < firstMentions - 0.1) {
        positionTrend = 'declining';
      } else {
        positionTrend = 'stable';
      }
    } else if (dataPoints.length > 0) {
      positionTrend = 'new';
    }
    
    // Count competitor frequency
    const competitorFrequency: Record<string, number> = {};
    for (const dp of dataPoints) {
      for (const comp of dp.competitorsMentioned || []) {
        competitorFrequency[comp] = (competitorFrequency[comp] || 0) + 1;
      }
    }
    
    trends.push({
      queryId: query.queryId,
      queryText: query.queryText,
      dataPoints,
      mentionRate,
      avgPosition,
      positionTrend,
      competitorFrequency,
    });
  }
  
  return trends;
}

// Get overall brand trends over time
export async function getBrandTrends(days = 30) {
  // Calculate the cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const results = await sql`
    SELECT 
      DATE(scanned_at) as scan_date,
      COUNT(*) as total_queries,
      COUNT(*) FILTER (WHERE checkit_mentioned) as checkit_mentions,
      AVG(checkit_position) FILTER (WHERE checkit_position IS NOT NULL) as avg_position
    FROM ai_search_results
    WHERE scanned_at > ${cutoffDate.toISOString()}
    GROUP BY DATE(scanned_at)
    ORDER BY scan_date ASC
  `;
  
  return results.map(row => ({
    date: (row.scan_date as Date).toISOString().split('T')[0],
    totalQueries: Number(row.total_queries),
    checkitMentions: Number(row.checkit_mentions),
    mentionRate: Number(row.total_queries) > 0 
      ? Number(row.checkit_mentions) / Number(row.total_queries) 
      : 0,
    avgPosition: row.avg_position ? Number(row.avg_position) : null,
  }));
}

// Check if we already ran a scan today
export async function hasScannedToday(): Promise<boolean> {
  const result = await sql`
    SELECT COUNT(*) as count FROM ai_search_scans
    WHERE DATE(started_at) = CURRENT_DATE
  `;
  return Number(result[0]?.count) > 0;
}

// Get the last scan date
export async function getLastScanDate(): Promise<string | null> {
  const result = await sql`
    SELECT MAX(DATE(started_at)) as last_date FROM ai_search_scans
  `;
  return result[0]?.last_date 
    ? (result[0].last_date as Date).toISOString().split('T')[0]
    : null;
}

// ============================================
// AI Content Drafts Tables and Operations
// ============================================

export interface ContentDraft {
  id: number;
  source_query: string;
  source_query_id: number | null;
  title: string;
  slug: string;
  target_keywords: string[];
  outline: string[];
  key_points: string[];
  faq_questions: string[];
  content: string | null;
  meta_description: string | null;
  excerpt: string | null;
  status: 'idea' | 'brief' | 'draft' | 'review' | 'approved' | 'published';
  published_url: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

export async function initializeContentDraftsTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS content_drafts (
      id SERIAL PRIMARY KEY,
      source_query TEXT NOT NULL,
      source_query_id INTEGER,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      target_keywords JSONB DEFAULT '[]',
      outline JSONB DEFAULT '[]',
      key_points JSONB DEFAULT '[]',
      faq_questions JSONB DEFAULT '[]',
      content TEXT,
      meta_description TEXT,
      excerpt TEXT,
      status TEXT DEFAULT 'idea',
      published_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      published_at TIMESTAMPTZ
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_drafts_created ON content_drafts(created_at DESC)`;
}

// Create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// Create content draft (from brief)
export async function createContentDraft(data: {
  sourceQuery: string;
  sourceQueryId?: number;
  title: string;
  targetKeywords: string[];
  outline: string[];
  keyPoints: string[];
  faqQuestions: string[];
}) {
  const slug = createSlug(data.title) + '-' + Date.now().toString(36);
  
  const result = await sql`
    INSERT INTO content_drafts (
      source_query, source_query_id, title, slug, target_keywords,
      outline, key_points, faq_questions, status
    ) VALUES (
      ${data.sourceQuery}, ${data.sourceQueryId || null}, ${data.title}, ${slug},
      ${JSON.stringify(data.targetKeywords)}, ${JSON.stringify(data.outline)},
      ${JSON.stringify(data.keyPoints)}, ${JSON.stringify(data.faqQuestions)}, 'brief'
    )
    RETURNING *
  `;
  return result[0] as ContentDraft;
}

// Update draft with generated content
export async function updateDraftContent(id: number, data: {
  content: string;
  metaDescription: string;
  excerpt: string;
}) {
  const result = await sql`
    UPDATE content_drafts SET
      content = ${data.content},
      meta_description = ${data.metaDescription},
      excerpt = ${data.excerpt},
      status = 'draft',
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as ContentDraft;
}

// Update draft status
export async function updateDraftStatus(id: number, status: ContentDraft['status'], publishedUrl?: string) {
  const result = await sql`
    UPDATE content_drafts SET
      status = ${status},
      published_url = COALESCE(${publishedUrl || null}, published_url),
      published_at = CASE WHEN ${status} = 'published' THEN NOW() ELSE published_at END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as ContentDraft;
}

// Update draft fields
export async function updateDraft(id: number, data: {
  title?: string;
  content?: string;
  metaDescription?: string;
  excerpt?: string;
  targetKeywords?: string[];
  outline?: string[];
  keyPoints?: string[];
  faqQuestions?: string[];
}) {
  const result = await sql`
    UPDATE content_drafts SET
      title = COALESCE(${data.title || null}, title),
      content = COALESCE(${data.content || null}, content),
      meta_description = COALESCE(${data.metaDescription || null}, meta_description),
      excerpt = COALESCE(${data.excerpt || null}, excerpt),
      target_keywords = COALESCE(${data.targetKeywords ? JSON.stringify(data.targetKeywords) : null}, target_keywords),
      outline = COALESCE(${data.outline ? JSON.stringify(data.outline) : null}, outline),
      key_points = COALESCE(${data.keyPoints ? JSON.stringify(data.keyPoints) : null}, key_points),
      faq_questions = COALESCE(${data.faqQuestions ? JSON.stringify(data.faqQuestions) : null}, faq_questions),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as ContentDraft;
}

// Get all drafts
export async function getContentDrafts(status?: ContentDraft['status']) {
  if (status) {
    return await sql`
      SELECT * FROM content_drafts WHERE status = ${status} ORDER BY created_at DESC
    ` as ContentDraft[];
  }
  return await sql`
    SELECT * FROM content_drafts ORDER BY created_at DESC
  ` as ContentDraft[];
}

// Get single draft by ID
export async function getContentDraft(id: number) {
  const result = await sql`SELECT * FROM content_drafts WHERE id = ${id}`;
  return result[0] as ContentDraft | undefined;
}

// Get draft by slug
export async function getContentDraftBySlug(slug: string) {
  const result = await sql`SELECT * FROM content_drafts WHERE slug = ${slug}`;
  return result[0] as ContentDraft | undefined;
}

// Delete draft
export async function deleteContentDraft(id: number) {
  await sql`DELETE FROM content_drafts WHERE id = ${id}`;
}

// Get published articles (for public site)
export async function getPublishedArticles(limit = 20) {
  return await sql`
    SELECT * FROM content_drafts 
    WHERE status = 'published' AND content IS NOT NULL
    ORDER BY published_at DESC
    LIMIT ${limit}
  ` as ContentDraft[];
}

// Get published article by slug (for public site)
export async function getPublishedArticleBySlug(slug: string) {
  const result = await sql`
    SELECT * FROM content_drafts 
    WHERE slug = ${slug} AND status = 'published'
  `;
  return result[0] as ContentDraft | undefined;
}

// Get content drafts summary
export async function getContentDraftsSummary() {
  const stats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'idea') as ideas,
      COUNT(*) FILTER (WHERE status = 'brief') as briefs,
      COUNT(*) FILTER (WHERE status = 'draft') as drafts,
      COUNT(*) FILTER (WHERE status = 'review') as in_review,
      COUNT(*) FILTER (WHERE status = 'approved') as approved,
      COUNT(*) FILTER (WHERE status = 'published') as published
    FROM content_drafts
  `;

  return {
    total: Number(stats[0]?.total) || 0,
    ideas: Number(stats[0]?.ideas) || 0,
    briefs: Number(stats[0]?.briefs) || 0,
    drafts: Number(stats[0]?.drafts) || 0,
    inReview: Number(stats[0]?.in_review) || 0,
    approved: Number(stats[0]?.approved) || 0,
    published: Number(stats[0]?.published) || 0,
  };
}

// ============================================
// Sync Competitors from AI Search
// ============================================

// Get all unique competitors discovered in AI search results
export async function getDiscoveredCompetitors() {
  const results = await sql`
    SELECT DISTINCT unnest(competitors_mentioned) as competitor
    FROM ai_search_results
    WHERE competitors_mentioned IS NOT NULL
    ORDER BY competitor
  `;
  return results.map(r => r.competitor as string);
}

// Sync discovered competitors to competitor_feeds table
export async function syncDiscoveredCompetitors(competitors: string[]) {
  const added: string[] = [];
  
  for (const competitor of competitors) {
    try {
      // Create a URL-safe ID from the name
      const competitorId = competitor.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Check if already exists
      const existing = await sql`
        SELECT id FROM competitor_feeds WHERE competitor_id = ${competitorId}
      `;
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO competitor_feeds (competitor_id, competitor_name, discovery_method)
          VALUES (${competitorId}, ${competitor}, 'ai-search-discovery')
        `;
        added.push(competitor);
      }
    } catch (err) {
      console.error(`Failed to sync competitor ${competitor}:`, err);
    }
  }
  
  return added;
}

// Get competitor mention stats from AI search
export async function getCompetitorMentionStats() {
  const results = await sql`
    SELECT 
      unnest(competitors_mentioned) as competitor,
      COUNT(*) as mention_count,
      COUNT(*) FILTER (WHERE NOT checkit_mentioned) as wins_over_checkit
    FROM ai_search_results
    WHERE competitors_mentioned IS NOT NULL
    GROUP BY competitor
    ORDER BY mention_count DESC
  `;
  
  return results.map(r => ({
    competitor: r.competitor as string,
    mentionCount: Number(r.mention_count),
    winsOverCheckit: Number(r.wins_over_checkit),
  }));
}

// ============================================
// AI Search Profile Score
// ============================================

export interface AISearchProfileScore {
  brand: string;
  totalScore: number;
  components: {
    mentionRate: { score: number; maxScore: number; value: number; label: string };
    positionQuality: { score: number; maxScore: number; value: number | null; label: string };
    queryCoverage: { score: number; maxScore: number; value: number; label: string };
    consistency: { score: number; maxScore: number; value: number; label: string };
    winRate: { score: number; maxScore: number; value: number; label: string };
  };
  rank: number;
  totalBrands: number;
  tier: 'elite' | 'strong' | 'moderate' | 'emerging' | 'minimal';
}

// Calculate AI Search Profile Score for all brands
export async function calculateAISearchProfileScores(): Promise<AISearchProfileScore[]> {
  // Get total queries and results
  const totalStats = await sql`
    SELECT 
      COUNT(DISTINCT query_text) as total_queries,
      COUNT(*) as total_results
    FROM ai_search_results
  `;
  const totalQueries = Number(totalStats[0]?.total_queries) || 1;
  const totalResults = Number(totalStats[0]?.total_results) || 1;

  // Get Checkit stats
  const checkitStats = await sql`
    SELECT
      COUNT(*) as mentions,
      COUNT(DISTINCT query_text) as queries_covered,
      AVG(checkit_position) FILTER (WHERE checkit_position IS NOT NULL) as avg_position,
      COUNT(*) FILTER (WHERE checkit_position = 1) as first_positions
    FROM ai_search_results
    WHERE checkit_mentioned = true
  `;

  // Get competitor stats
  const competitorStats = await sql`
    SELECT 
      unnest(competitors_mentioned) as brand,
      COUNT(*) as mentions,
      COUNT(DISTINCT query_text) as queries_covered
    FROM ai_search_results
    WHERE competitors_mentioned IS NOT NULL AND array_length(competitors_mentioned, 1) > 0
    GROUP BY brand
  `;

  // Get consistency data (mentions over time)
  const consistencyData = await sql`
    SELECT 
      DATE(scanned_at) as scan_date,
      checkit_mentioned,
      competitors_mentioned
    FROM ai_search_results
    ORDER BY scanned_at
  `;

  // Calculate scores for each brand
  const scores: AISearchProfileScore[] = [];

  // Checkit score
  const checkitMentions = Number(checkitStats[0]?.mentions) || 0;
  const checkitQueriesCovered = Number(checkitStats[0]?.queries_covered) || 0;
  const checkitAvgPosition = checkitStats[0]?.avg_position ? Number(checkitStats[0]?.avg_position) : null;
  const checkitFirstPositions = Number(checkitStats[0]?.first_positions) || 0;

  // Calculate Checkit consistency (% of days with mentions)
  const dateMap = new Map<string, boolean>();
  for (const row of consistencyData) {
    const date = (row.scan_date as Date).toISOString().split('T')[0];
    if (row.checkit_mentioned) dateMap.set(date, true);
    else if (!dateMap.has(date)) dateMap.set(date, false);
  }
  const daysWithMentions = Array.from(dateMap.values()).filter(v => v).length;
  const totalDays = dateMap.size || 1;
  const checkitConsistency = daysWithMentions / totalDays;

  // Win rate for Checkit (times mentioned when competitors also mentioned)
  const winRateStats = await sql`
    SELECT
      COUNT(*) as total_competitive,
      COUNT(*) FILTER (WHERE checkit_mentioned) as checkit_wins
    FROM ai_search_results
    WHERE array_length(competitors_mentioned, 1) > 0
  `;
  const checkitWinRate = Number(winRateStats[0]?.total_competitive) > 0
    ? Number(winRateStats[0]?.checkit_wins) / Number(winRateStats[0]?.total_competitive)
    : 0;

  scores.push(calculateBrandScore('Checkit', {
    mentionRate: checkitMentions / totalResults,
    avgPosition: checkitAvgPosition,
    queryCoverage: checkitQueriesCovered / totalQueries,
    consistency: checkitConsistency,
    winRate: checkitWinRate,
    totalQueries,
  }));

  // Competitor scores
  for (const comp of competitorStats) {
    const brand = comp.brand as string;
    const mentions = Number(comp.mentions);
    const queriesCovered = Number(comp.queries_covered);

    // Calculate competitor consistency
    const compDateMap = new Map<string, boolean>();
    for (const row of consistencyData) {
      const date = (row.scan_date as Date).toISOString().split('T')[0];
      const competitors = row.competitors_mentioned as string[] || [];
      if (competitors.includes(brand)) compDateMap.set(date, true);
      else if (!compDateMap.has(date)) compDateMap.set(date, false);
    }
    const compDaysWithMentions = Array.from(compDateMap.values()).filter(v => v).length;
    const compConsistency = compDaysWithMentions / totalDays;

    // Competitor win rate (% of their mentions where Checkit not mentioned)
    const compWinRateResult = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE NOT checkit_mentioned) as wins
      FROM ai_search_results
      WHERE ${brand} = ANY(competitors_mentioned)
    `;
    const compWinRate = Number(compWinRateResult[0]?.total) > 0
      ? Number(compWinRateResult[0]?.wins) / Number(compWinRateResult[0]?.total)
      : 0;

    scores.push(calculateBrandScore(brand, {
      mentionRate: mentions / totalResults,
      avgPosition: null, // We don't track position for competitors
      queryCoverage: queriesCovered / totalQueries,
      consistency: compConsistency,
      winRate: compWinRate,
      totalQueries,
    }));
  }

  // Sort by total score and assign ranks
  scores.sort((a, b) => b.totalScore - a.totalScore);
  scores.forEach((s, i) => {
    s.rank = i + 1;
    s.totalBrands = scores.length;
  });

  return scores;
}

function calculateBrandScore(brand: string, data: {
  mentionRate: number;
  avgPosition: number | null;
  queryCoverage: number;
  consistency: number;
  winRate: number;
  totalQueries: number;
}): AISearchProfileScore {
  // Mention Rate (0-35 points)
  // Calibrated: 100% = 35pts, 50% = 17.5pts, 10% = 3.5pts
  const mentionRateScore = Math.min(35, data.mentionRate * 35);

  // Position Quality (0-25 points)
  // Calibrated: Position 1 = 25pts, Position 3 = 15pts, Position 5+ = 5pts
  let positionScore = 0;
  if (data.avgPosition !== null) {
    if (data.avgPosition <= 1) positionScore = 25;
    else if (data.avgPosition <= 2) positionScore = 20;
    else if (data.avgPosition <= 3) positionScore = 15;
    else if (data.avgPosition <= 4) positionScore = 10;
    else positionScore = 5;
  }

  // Query Coverage (0-20 points)
  // Calibrated: 100% coverage = 20pts
  const coverageScore = Math.min(20, data.queryCoverage * 20);

  // Consistency (0-10 points)
  // Calibrated: 100% consistent = 10pts
  const consistencyScore = Math.min(10, data.consistency * 10);

  // Win Rate (0-10 points)
  // Calibrated: 100% win rate = 10pts
  const winRateScore = Math.min(10, data.winRate * 10);

  const totalScore = Math.round(mentionRateScore + positionScore + coverageScore + consistencyScore + winRateScore);

  // Determine tier
  let tier: AISearchProfileScore['tier'];
  if (totalScore >= 80) tier = 'elite';
  else if (totalScore >= 60) tier = 'strong';
  else if (totalScore >= 40) tier = 'moderate';
  else if (totalScore >= 20) tier = 'emerging';
  else tier = 'minimal';

  return {
    brand,
    totalScore,
    components: {
      mentionRate: {
        score: Math.round(mentionRateScore * 10) / 10,
        maxScore: 35,
        value: Math.round(data.mentionRate * 1000) / 10,
        label: 'Mention Rate',
      },
      positionQuality: {
        score: positionScore,
        maxScore: 25,
        value: data.avgPosition,
        label: 'Position Quality',
      },
      queryCoverage: {
        score: Math.round(coverageScore * 10) / 10,
        maxScore: 20,
        value: Math.round(data.queryCoverage * 1000) / 10,
        label: 'Query Coverage',
      },
      consistency: {
        score: Math.round(consistencyScore * 10) / 10,
        maxScore: 10,
        value: Math.round(data.consistency * 1000) / 10,
        label: 'Consistency',
      },
      winRate: {
        score: Math.round(winRateScore * 10) / 10,
        maxScore: 10,
        value: Math.round(data.winRate * 1000) / 10,
        label: 'Win Rate',
      },
    },
    rank: 0,
    totalBrands: 0,
    tier,
  };
}
