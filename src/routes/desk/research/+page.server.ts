import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireStaff } from '#lib/server/access.ts';
import { listAllResearch } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { researchItem } from '#lib/server/db/schema.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	return { notes: await listAllResearch() };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const user = requireStaff(locals.user);
		const title = textField(await request.formData(), 'title', 200);
		if (!title) return fail(400, { message: 'A title is required.', title });
		const id = crypto.randomUUID();
		await db.insert(researchItem).values({
			id,
			title,
			authorId: user.id,
			status: 'draft',
			rightsConfirmed: false
		});
		redirect(303, `/desk/research/${id}`);
	}
};
