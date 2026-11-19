import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { listAllMatters } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { matter } from '#lib/server/db/schema.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	return { matters: await listAllMatters() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const reference = textField(form, 'reference', 80);
		const title = textField(form, 'title', 200);
		if (!reference || !title) return fail(400, { message: 'Reference and title are required.', reference, title });
		const existing = await db.select({ id: matter.id }).from(matter).where(eq(matter.reference, reference)).get();
		if (existing) return fail(400, { message: 'That reference is already in use.', reference, title });
		const id = crypto.randomUUID();
		await db.insert(matter).values({ id, reference, title, status: 'Open' });
		redirect(303, `/desk/matters/${id}`);
	}
};
