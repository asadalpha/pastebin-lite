# Pastebin-Lite

A lightweight, serverless pastebin application built with Next.js, NeonDB, and Drizzle ORM. Share text snippets with optional time-based expiry and view-count limits.

## Features

-  Create text pastes with shareable URLs
-  Optional time-to-live (TTL) expiration
-  Optional view-count limits
-  XSS protection with safe HTML rendering
-  Beautiful, responsive UI with gradient design
-  Serverless architecture with NeonDB
-  Deterministic time testing support for automated tests

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: NeonDB (Serverless Postgres)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Persistence Layer

This application uses **NeonDB**, a serverless Postgres database that provides:
- Automatic connection pooling
- Serverless-optimized performance
- HTTP-based queries for edge compatibility
- Persistent storage across serverless function invocations

The database schema includes a single `pastes` table with the following fields:
- `id`: Auto-incrementing primary key
- `pasteId`: Unique URL-safe identifier
- `content`: The paste text content
- `createdAt`: Timestamp of creation
- `expiresAt`: Optional expiration timestamp
- `maxViews`: Optional maximum view count
- `viewCount`: Current view count (atomically incremented)

## Local Development

### Prerequisites


- A NeonDB account and database (free tier available at [neon.tech](https://neon.tech))

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   TEST_MODE=0
   ```
   
   Replace the `DATABASE_URL` with your NeonDB connection string (available in your Neon dashboard).

4. **Push the database schema**
   ```bash
   npm run db:push
   ```
   
   This creates the necessary tables in your NeonDB database.

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns `{ "ok": true }` if the application and database are healthy.

### Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "string (required)",
  "ttl_seconds": 60 (optional, integer >= 1),
  "max_views": 5 (optional, integer >= 1)
}
```
Returns:
```json
{
  "id": "paste-id",
  "url": "https://your-app.vercel.app/p/paste-id"
}
```

### Fetch Paste (API)
```
GET /api/pastes/:id
```
Returns:
```json
{
  "content": "paste content",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

### View Paste (HTML)
```
GET /p/:id
```
Returns an HTML page displaying the paste content, or a 404 page if unavailable.

## Testing

The application supports deterministic time testing for automated test suites:

1. Set `TEST_MODE=1` in your environment variables
2. Include the `x-test-now-ms` header with milliseconds since epoch
3. The application will use this time for expiry calculations

Example:
```bash
curl -H "x-test-now-ms: 1735632000000" https://your-app.vercel.app/api/pastes/abc123
```

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**
   - Add `DATABASE_URL` with your NeonDB connection string
   - Add `TEST_MODE=0` (or `1` for testing)

4. **Deploy**
   - Vercel will automatically build and deploy your application
   - The database schema will be automatically applied on first deployment

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## Important Design Decisions

### 1. Atomic View Counting
View counts are incremented using SQL's atomic increment (`viewCount + 1`) to prevent race conditions under concurrent access.

### 2. No Global Mutable State
The application is designed for serverless environments with no reliance on global mutable state. Each request is stateless, with all data persisted in NeonDB.

### 3. XSS Protection
All user-generated content is HTML-escaped before rendering to prevent script injection attacks.

### 4. Deterministic Testing
The `TEST_MODE` environment variable and `x-test-now-ms` header allow automated tests to control time-based expiry without waiting for real time to pass.

### 5. Graceful Error Handling
All error cases (missing paste, expired, view limit exceeded) return consistent 404 responses with user-friendly HTML pages.

### 6. URL-Safe IDs
Paste IDs are generated using nanoid with a custom alphabet (alphanumeric only) to ensure URL safety and uniqueness.


