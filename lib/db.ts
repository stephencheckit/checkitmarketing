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
    ...battlecard,
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
