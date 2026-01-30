import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const projectStatusEnum = pgEnum('project_status', ['pending', 'approved', 'rejected']);
export const projectCategoryEnum = pgEnum('project_category', [
    'web-app',
    'mobile-app',
    'api',
    'cli-tool',
    'game',
    'ai-ml',
    'blockchain',
    'other'
]);

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    githubUsername: text('github_username'),
    isAdmin: boolean('is_admin').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Sessions table
export const sessions = pgTable('sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// Projects table
export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    githubUrl: text('github_url'),
    liveUrl: text('live_url'),
    thumbnailUrl: text('thumbnail_url'),
    techStack: text('tech_stack').array().default([]),
    category: projectCategoryEnum('category').default('other'),
    status: projectStatusEnum('status').default('pending'),
    viewCount: integer('view_count').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Tags table
export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    color: text('color').default('#6366f1'),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// Project Tags junction table
export const projectTags = pgTable('project_tags', {
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull()
});

// Reviews table
export const reviews = pgTable('reviews', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    rating: integer('rating').notNull(), // 1-5 stars
    functionalityScore: integer('functionality_score'), // 1-5
    uiScore: integer('ui_score'), // 1-5
    codeQualityScore: integer('code_quality_score'), // 1-5
    title: text('title'),
    content: text('content').notNull(),
    pros: text('pros'),
    cons: text('cons'),
    upvotes: integer('upvotes').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Review upvotes table
export const reviewUpvotes = pgTable('review_upvotes', {
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    reviewId: uuid('review_id').references(() => reviews.id, { onDelete: 'cascade' }).notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
    reviews: many(reviews),
    sessions: many(sessions)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id]
    }),
    reviews: many(reviews),
    projectTags: many(projectTags)
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    project: one(projects, {
        fields: [reviews.projectId],
        references: [projects.id]
    }),
    reviewer: one(users, {
        fields: [reviews.reviewerId],
        references: [users.id]
    })
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}));

export const tagsRelations = relations(tags, ({ many }) => ({
    projectTags: many(projectTags)
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
    project: one(projects, {
        fields: [projectTags.projectId],
        references: [projects.id]
    }),
    tag: one(tags, {
        fields: [projectTags.tagId],
        references: [tags.id]
    })
}));
