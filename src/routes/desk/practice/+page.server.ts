import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { listPractice } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { practiceArea } from '#lib/server/db/schema.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	return { areas: await listPractice() };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const title = textField(form, 'title', 120);
		const summary = textField(form, 'summary', 500);
		if (!title) return fail(400, { message: 'A title is required.' });
		await db.insert(practiceArea).values({ title, summary, sortOrder: 20 });
		return { message: 'Practice area added.' };
	},
	update: async ({ request }) => {
		const form = await request.formData();
		const id = textField(form, 'id', 80);
		const title = textField(form, 'title', 120);
		const summary = textField(form, 'summary', 500);
		const sortOrder = Number(textField(form, 'sortOrder', 6) || '0');
		if (!id || !title) return fail(400, { message: 'A title is required.' });
		await db.update(practiceArea).set({ title, summary, sortOrder }).where(eq(practiceArea.id, id));
		return { message: 'Practice area saved.' };
	},
	remove: async ({ request }) => {
		const id = textField(await request.formData(), 'id', 80);
		await db.delete(practiceArea).where(eq(practiceArea.id, id));
		return { message: 'Practice area removed.' };
	}
};
