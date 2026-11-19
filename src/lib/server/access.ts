import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { isStaffRole, type PublicUser } from '#lib/roles.ts';
import type { AppUser } from '#lib/server/auth.ts';
import { db } from '#lib/server/db/index.ts';
import { document, matterAssignment, researchItem } from '#lib/server/db/schema.ts';

export function requireUser(user: AppUser | undefined): AppUser {
	if (!user?.approved) redirect(303, '/login');
	return user;
}

export function requireStaff(user: AppUser | undefined): AppUser {
	if (!user) redirect(303, '/login');
	if (!user.approved || !isStaffRole(user.role)) error(403, 'Staff access is required.');
	return user;
}

export async function assignedToMatter(userId: string, matterId: string) {
	const row = await db
		.select({ matterId: matterAssignment.matterId })
		.from(matterAssignment)
		.where(and(eq(matterAssignment.matterId, matterId), eq(matterAssignment.userId, userId)))
		.get();
	return Boolean(row);
}

export async function assertClientMatter(user: PublicUser, matterId: string) {
	if (!(await assignedToMatter(user.id, matterId))) error(404, 'Matter not found.');
}

export async function readableDocument(user: AppUser, documentId: string) {
	const doc = await db.select().from(document).where(eq(document.id, documentId)).get();
	if (!doc) error(404, 'Document not found.');

	if (doc.matterId) {
		if (isStaffRole(user.role) || (await assignedToMatter(user.id, doc.matterId))) return doc;
		error(404, 'Document not found.');
	}

	if (doc.researchItemId) {
		const item = await db
			.select({ status: researchItem.status })
			.from(researchItem)
			.where(eq(researchItem.id, doc.researchItemId))
			.get();
		if (!item) error(404, 'Document not found.');
		if (item.status === 'published' || isStaffRole(user.role)) return doc;
		error(404, 'Document not found.');
	}

	error(404, 'Document not found.');
}
