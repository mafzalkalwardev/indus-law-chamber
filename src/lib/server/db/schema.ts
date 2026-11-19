import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export * from './auth.schema';

export const siteSettings = sqliteTable('site_settings', {
	id: integer('id').primaryKey(),
	chamberName: text('chamber_name').notNull(),
	principalName: text('principal_name').notNull(),
	aboutIntro: text('about_intro').notNull().default(''),
	phone: text('phone').notNull().default(''),
	whatsapp: text('whatsapp').notNull().default(''),
	email: text('email').notNull().default(''),
	address: text('address').notNull().default(''),
	hours: text('hours').notNull().default('')
});

export const teamMember = sqliteTable('team_member', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	roleTitle: text('role_title').notNull(),
	bio: text('bio').notNull().default(''),
	courts: text('courts').notNull().default(''),
	education: text('education').notNull().default(''),
	photoStoredName: text('photo_stored_name'),
	sortOrder: integer('sort_order').notNull().default(0),
	isPrincipal: integer('is_principal', { mode: 'boolean' }).notNull().default(false)
});

export const practiceArea = sqliteTable('practice_area', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	summary: text('summary').notNull().default(''),
	sortOrder: integer('sort_order').notNull().default(0)
});

export const inquiry = sqliteTable('inquiry', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	phone: text('phone').notNull().default(''),
	email: text('email').notNull().default(''),
	subject: text('subject').notNull(),
	message: text('message').notNull(),
	status: text('status').notNull().default('new'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const matter = sqliteTable('matter', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	reference: text('reference').notNull().unique(),
	title: text('title').notNull(),
	court: text('court').notNull().default(''),
	status: text('status').notNull().default('Open'),
	nextDate: text('next_date').notNull().default(''),
	internalNotes: text('internal_notes').notNull().default(''),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const matterAssignment = sqliteTable(
	'matter_assignment',
	{
		matterId: text('matter_id')
			.notNull()
			.references(() => matter.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.matterId, table.userId] })]
);

export const matterUpdate = sqliteTable('matter_update', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	matterId: text('matter_id')
		.notNull()
		.references(() => matter.id, { onDelete: 'cascade' }),
	authorId: text('author_id').references(() => user.id),
	body: text('body').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const researchItem = sqliteTable('research_item', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	citation: text('citation').notNull().default(''),
	court: text('court').notNull().default(''),
	year: text('year').notNull().default(''),
	topic: text('topic').notNull().default(''),
	summary: text('summary').notNull().default(''),
	status: text('status').notNull().default('draft'),
	rightsConfirmed: integer('rights_confirmed', { mode: 'boolean' }).notNull().default(false),
	authorId: text('author_id').references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const document = sqliteTable('document', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	matterId: text('matter_id').references(() => matter.id, { onDelete: 'cascade' }),
	researchItemId: text('research_item_id').references(() => researchItem.id, { onDelete: 'cascade' }),
	originalName: text('original_name').notNull(),
	storedName: text('stored_name').notNull(),
	mime: text('mime').notNull(),
	size: integer('size').notNull(),
	uploadedBy: text('uploaded_by').references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const article = sqliteTable('article', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	excerpt: text('excerpt').notNull().default(''),
	body: text('body').notNull().default(''),
	status: text('status').notNull().default('draft'),
	authorId: text('author_id').references(() => user.id),
	publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const accessRequest = sqliteTable('access_request', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	note: text('note').notNull().default(''),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});
