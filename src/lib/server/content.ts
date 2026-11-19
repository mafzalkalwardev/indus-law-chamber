import { error } from '@sveltejs/kit';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import {
	accessRequest,
	article,
	document,
	inquiry,
	matter,
	matterAssignment,
	matterUpdate,
	practiceArea,
	researchItem,
	siteSettings,
	teamMember,
	user
} from '#lib/server/db/schema.ts';

export async function getSettings() {
	const row = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).get();
	if (!row) error(500, 'Chamber settings are not ready.');
	return row;
}

export function listPractice() {
	return db.select().from(practiceArea).orderBy(asc(practiceArea.sortOrder), asc(practiceArea.title));
}

export function listTeam() {
	return db.select().from(teamMember).orderBy(asc(teamMember.sortOrder), asc(teamMember.name));
}

export async function getPrincipal() {
	return (
		(await db.select().from(teamMember).where(eq(teamMember.isPrincipal, true)).get()) ??
		(await db.select().from(teamMember).orderBy(asc(teamMember.sortOrder)).get())
	);
}

export function listPublishedArticles() {
	return db
		.select()
		.from(article)
		.where(eq(article.status, 'published'))
		.orderBy(desc(article.publishedAt));
}

export async function getPublishedArticle(slug: string) {
	const row = await db
		.select()
		.from(article)
		.where(and(eq(article.slug, slug), eq(article.status, 'published')))
		.get();
	if (!row) error(404, 'Article not found.');
	return row;
}

export function listAllArticles() {
	return db.select().from(article).orderBy(desc(article.updatedAt));
}

export async function getArticle(id: string) {
	const row = await db.select().from(article).where(eq(article.id, id)).get();
	if (!row) error(404, 'Article not found.');
	return row;
}

function searchTerm(query: string) {
	return `%${query.trim().replace(/[%_\\]/g, '')}%`;
}

export function listPublishedResearch(query: string) {
	const q = query.trim();
	if (!q) {
		return db
			.select()
			.from(researchItem)
			.where(eq(researchItem.status, 'published'))
			.orderBy(desc(researchItem.updatedAt));
	}
	const term = searchTerm(q);
	return db
		.select()
		.from(researchItem)
		.where(
			and(
				eq(researchItem.status, 'published'),
				or(
					like(researchItem.title, term),
					like(researchItem.citation, term),
					like(researchItem.court, term),
					like(researchItem.topic, term),
					like(researchItem.summary, term),
					like(researchItem.year, term)
				)
			)
		)
		.orderBy(desc(researchItem.updatedAt));
}

export function listAllResearch() {
	return db.select().from(researchItem).orderBy(desc(researchItem.updatedAt));
}

export async function getResearch(id: string) {
	const row = await db.select().from(researchItem).where(eq(researchItem.id, id)).get();
	if (!row) error(404, 'Research note not found.');
	return row;
}

export function listInquiries() {
	return db.select().from(inquiry).orderBy(desc(inquiry.createdAt));
}

export async function getInquiry(id: string) {
	const row = await db.select().from(inquiry).where(eq(inquiry.id, id)).get();
	if (!row) error(404, 'Inquiry not found.');
	return row;
}

export function listAllMatters() {
	return db.select().from(matter).orderBy(desc(matter.createdAt));
}

export function listMattersForUser(userId: string) {
	return db
		.select({
			id: matter.id,
			reference: matter.reference,
			title: matter.title,
			court: matter.court,
			status: matter.status,
			nextDate: matter.nextDate,
			createdAt: matter.createdAt
		})
		.from(matter)
		.innerJoin(matterAssignment, eq(matterAssignment.matterId, matter.id))
		.where(eq(matterAssignment.userId, userId))
		.orderBy(desc(matter.createdAt));
}

export async function getMatter(id: string) {
	const row = await db.select().from(matter).where(eq(matter.id, id)).get();
	if (!row) error(404, 'Matter not found.');
	return row;
}

export function listAssignments(matterId: string) {
	return db
		.select({ userId: matterAssignment.userId })
		.from(matterAssignment)
		.where(eq(matterAssignment.matterId, matterId));
}

export function listUpdates(matterId: string) {
	return db
		.select()
		.from(matterUpdate)
		.where(eq(matterUpdate.matterId, matterId))
		.orderBy(desc(matterUpdate.createdAt));
}

export function listMatterDocuments(matterId: string) {
	return db.select().from(document).where(eq(document.matterId, matterId)).orderBy(desc(document.createdAt));
}

export function listResearchDocuments(researchItemId: string) {
	return db
		.select()
		.from(document)
		.where(eq(document.researchItemId, researchItemId))
		.orderBy(desc(document.createdAt));
}

export function listUsers() {
	return db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			approved: user.approved,
			createdAt: user.createdAt
		})
		.from(user)
		.orderBy(desc(user.createdAt));
}

export function listApprovedUsers() {
	return db
		.select({ id: user.id, name: user.name, email: user.email, role: user.role })
		.from(user)
		.where(eq(user.approved, true))
		.orderBy(asc(user.name));
}

export function listAccessRequests() {
	return db.select().from(accessRequest).orderBy(desc(accessRequest.createdAt));
}

export async function uniqueSlug(base: string, exceptId?: string) {
	let slug = base;
	let n = 2;
	while (true) {
		const existing = await db.select({ id: article.id }).from(article).where(eq(article.slug, slug)).get();
		if (!existing || existing.id === exceptId) return slug;
		slug = `${base}-${n++}`;
	}
}
