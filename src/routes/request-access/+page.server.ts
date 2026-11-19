import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db/index.ts';
import { accessRequest } from '#lib/server/db/schema.ts';
import { createCredentialUser } from '#lib/server/users.ts';
import { looksLikeEmail, textField } from '#lib/text.ts';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/matters');
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		if (textField(form, 'website', 200)) return { success: true };

		const name = textField(form, 'name', 120);
		const email = textField(form, 'email', 180).toLowerCase();
		const password = String(form.get('password') ?? '');
		const note = textField(form, 'note', 2000);
		const values = { name, email, note };

		if (!name || !email || !password) {
			return fail(400, { message: 'Name, email, and password are required.', values });
		}
		if (!looksLikeEmail(email)) return fail(400, { message: 'Enter a valid email address.', values });

		const created = await createCredentialUser({
			name,
			email,
			password,
			role: 'member',
			approved: false
		});
		if ('error' in created) return fail(400, { message: created.error, values });

		await db.insert(accessRequest).values({ userId: created.id, note });
		return { success: true };
	}
};
