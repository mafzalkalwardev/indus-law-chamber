import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { requireStaff } from '#lib/server/access.ts';
import { getArticle, uniqueSlug } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { article } from '#lib/server/db/schema.ts';
import { slugify, textField } from '#lib/text.ts';

export const load: PageServerLoad = async ({ params, url }) => {
	return { article: await getArticle(params.id), saved: url.searchParams.get('saved') === '1' };
};

export const actions: Actions = {
	save: async ({ locals, params, request }) => {
		const user = requireStaff(locals.user);
		const current = await getArticle(params.id);
		const form = await request.formData();
		const title = textField(form, 'title', 200);
		const excerpt = textField(form, 'excerpt', 400);
		const body = textField(form, 'body', 30000);
		const status = form.get('status') === 'published' ? 'published' : 'draft';
		if (!title) return fail(400, { message: 'A title is required.' });
		const slug = await uniqueSlug(slugify(textField(form, 'slug', 160) || title), params.id);
		const now = new Date();
		await db
			.update(article)
			.set({
				title,
				slug,
				excerpt,
				body,
				status,
				authorId: user.id,
				publishedAt: status === 'published' ? (current.publishedAt ?? now) : null,
				updatedAt: now
			})
			.where(eq(article.id, params.id));
		redirect(303, `/desk/articles/${params.id}?saved=1`);
	}
};
