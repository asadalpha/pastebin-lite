import { pgTable, text, timestamp, integer, serial } from 'drizzle-orm/pg-core';

export const pastes = pgTable('pastes', {
  id: serial('id').primaryKey(),
  pasteId: text('paste_id').notNull().unique(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
  maxViews: integer('max_views'),
  viewCount: integer('view_count').notNull().default(0),
});

export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
