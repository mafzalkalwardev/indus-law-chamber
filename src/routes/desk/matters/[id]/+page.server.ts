import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { requireStaff } from '#lib/server/access.ts';
import {
	getMatter,
	listApprovedUsers,
	listAssignments,
	listMatterDocuments,
	listUpdates
} from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { document, matter, matterAssignment, matterUpdate } from '#lib/server/db/schema.ts';
import { removeStored, saveDocument } from '#lib/server/files.ts';
import { textField } from '#lib/text.ts';

const statuses = ['Open', 'Hearing', 'Closed'];

export const load: PageServerLoad = async ({ params, url }) => {
	const [row, updates, documents, people, assigned] = await Promise.all([
		getMatter(params.id),
		listUpdates(params.id),
		listMatterDocuments(params.id),
		listApprovedUsers(),
		listAssignments(params.id)
	]);
	return {
		matter: row,
		updates,
		documents,
		people,
		assigned: assigned.map((item) => item.userId),
		saved: url.searchParams.get('saved') === '1'
	};
};

export const actions: Actions = {
	save: async ({ locals, params, request }) => {
		requireStaff(locals.user);
		const form = await request.formData();
		const reference = textField(form, 'reference', 80);
		const title = textField(form, 'title', 200);
		const court = textField(form, 'court', 160);
		const nextDate = textField(form, 'nextDate', 20);
		const internalNotes = textField(form, 'internalNotes', 8000);
		const status = statuses.includes(String(form.get('status'))) ? String(form.get('status')) : 'Open';
		if (!reference || !title) return fail(400, { message: 'Reference and title are required.' });

		const clash = await db.select({ id: matter.id }).from(matter).where(eq(matter.reference, reference)).get();
		if (clash && clash.id !== params.id) return fail(400, { message: 'That reference is already in use.' });

		await db
			.update(matter)
			.set({ reference, title, court, nextDate, internalNotes, status })
			.where(eq(matter.id, params.id));

		const allowed = new Set((await listApprovedUsers()).map((person) => person.id));
		const chosen = form
			.getAll('assignee')
			.filter((value): value is string => typeof value === 'string')
			.filter((id) => allowed.has(id));
		await db.delete(matterAssignment).where(eq(matterAssignment.matterId, params.id));
		if (chosen.length > 0) {
			await db.insert(matterAssignment).values(chosen.map((userId) => ({ matterId: params.id, userId })));
		}
		redirect(303, `/desk/matters/${params.id}?saved=1`);
	},
	addUpdate: async ({ locals, params, request }) => {
		const user = requireStaff(locals.user);
		const body = textField(await request.formData(), 'body', 5000);
		if (!body) return fail(400, { message: 'Write an update before posting it.' });
		await db.insert(matterUpdate).values({ matterId: params.id, authorId: user.id, body });
		redirect(303, `/desk/matters/${params.id}?saved=1`);
	},
	upload: async ({ locals, params, request }) => {
		const user = requireStaff(locals.user);
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || file.size === 0) return fail(400, { message: 'Choose a file to upload.' });
		try {
			const saved = await saveDocument(file);
			if (!saved) return fail(400, { message: 'Choose a file to upload.' });
			await db.insert(document).values({
				matterId: params.id,
				originalName: saved.originalName,
				storedName: saved.storedName,
				mime: saved.mime,
				size: saved.size,
				uploadedBy: user.id
			});
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Upload failed.' });
		}
		redirect(303, `/desk/matters/${params.id}?saved=1`);
	},
	removeDocument: async ({ locals, params, request }) => {
		requireStaff(locals.user);
		const documentId = textField(await request.formData(), 'documentId', 80);
		const doc = await db.select().from(document).where(eq(document.id, documentId)).get();
		if (!doc || doc.matterId !== params.id) return fail(404, { message: 'Document not found.' });
		await removeStored('document', doc.storedName);
		await db.delete(document).where(eq(document.id, doc.id));
		redirect(303, `/desk/matters/${params.id}?saved=1`);
	}
};
