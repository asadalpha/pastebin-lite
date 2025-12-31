const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

// Load environment variables
// dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env or .env.local');
  console.error('Please add your NeonDB connection string to .env or .env.local');
  process.exit(1);
}

console.log('🔌 Connecting to database...');

const sql = neon(DATABASE_URL);

const createTableSQL = `
CREATE TABLE IF NOT EXISTS pastes (
  id SERIAL PRIMARY KEY,
  paste_id TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  max_views INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_paste_id ON pastes(paste_id);
CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at) WHERE expires_at IS NOT NULL;
`;

async function setupDatabase() {
  try {
    console.log('📝 Creating tables...');
    await sql(createTableSQL);
    console.log('✅ Database setup complete!');
    console.log('');
    console.log('Tables created:');
    console.log('  - pastes (with indexes)');
    console.log('');
    console.log('You can now run: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

