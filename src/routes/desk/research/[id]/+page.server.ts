import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { requireStaff } from '#lib/server/access.ts';
import { getResearch, listResearchDocuments } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { document, researchItem } from '#lib/server/db/schema.ts';
import { removeStored, saveDocument } from '#lib/server/files.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async ({ params, url }) => {
	const note = await getResearch(params.id);
	return {
		note,
		documents: await listResearchDocuments(note.id),
		saved: url.searchParams.get('saved') === '1'
	};
};

export const actions: Actions = {
	save: async ({ locals, params, request }) => {
		const user = requireStaff(locals.user);
		const form = await request.formData();
		const title = textField(form, 'title', 200);
		const citation = textField(form, 'citation', 200);
		const court = textField(form, 'court', 160);
		const year = textField(form, 'year', 12);
		const topic = textField(form, 'topic', 120);
		const summary = textField(form, 'summary', 20000);
		const rightsConfirmed = form.get('rightsConfirmed') === 'on';
		const status = form.get('status') === 'published' ? 'published' : 'draft';
		if (!title) return fail(400, { message: 'A title is required.' });
		if (status === 'published' && !rightsConfirmed) {
			return fail(400, {
				message: 'Confirm the chamber has the right to publish this note before it goes live.'
			});
		}
		await db
			.update(researchItem)
			.set({
				title,
				citation,
				court,
				year,
				topic,
				summary,
				rightsConfirmed,
				status,
				authorId: user.id,
				updatedAt: new Date()
			})
			.where(eq(researchItem.id, params.id));
		redirect(303, `/desk/research/${params.id}?saved=1`);
	},
	upload: async ({ locals, params, request }) => {
		const user = requireStaff(locals.user);
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || file.size === 0) return fail(400, { message: 'Choose a file to upload.' });
		try {
			const saved = await saveDocument(file);
			if (!saved) return fail(400, { message: 'Choose a file to upload.' });
			await db.insert(document).values({
				researchItemId: params.id,
				originalName: saved.originalName,
				storedName: saved.storedName,
				mime: saved.mime,
				size: saved.size,
				uploadedBy: user.id
			});
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Upload failed.' });
		}
		redirect(303, `/desk/research/${params.id}?saved=1`);
	},
	removeDocument: async ({ locals, params, request }) => {
		requireStaff(locals.user);
		const documentId = textField(await request.formData(), 'documentId', 80);
		const doc = await db.select().from(document).where(eq(document.id, documentId)).get();
		if (!doc || doc.researchItemId !== params.id) return fail(404, { message: 'Document not found.' });
		await removeStored('document', doc.storedName);
		await db.delete(document).where(eq(document.id, doc.id));
		redirect(303, `/desk/research/${params.id}?saved=1`);
	}
};
