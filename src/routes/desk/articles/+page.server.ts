import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireStaff } from '#lib/server/access.ts';
import { listAllArticles, uniqueSlug } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { article } from '#lib/server/db/schema.ts';
import { slugify, textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	return { articles: await listAllArticles() };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const user = requireStaff(locals.user);
		const title = textField(await request.formData(), 'title', 200);
		if (!title) return fail(400, { message: 'A title is required.', title });
		const id = crypto.randomUUID();
		const now = new Date();
		await db.insert(article).values({
			id,
			title,
			slug: await uniqueSlug(slugify(title)),
			authorId: user.id,
			status: 'draft',
			createdAt: now,
			updatedAt: now
		});
		redirect(303, `/desk/articles/${id}`);
	}
};
