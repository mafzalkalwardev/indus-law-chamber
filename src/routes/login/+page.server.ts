import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { asBoolean, isRole, isStaffRole } from '#lib/roles.ts';
import { auth } from '#lib/server/auth.ts';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schema.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, isStaffRole(locals.user.role) ? '/desk' : '/matters');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const email = textField(form, 'email', 180).toLowerCase();
		const password = String(form.get('password') ?? '');
		if (!email || !password) return fail(400, { message: 'Email and password are required.', email });

		try {
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: 'Those sign-in details were not accepted.', email });
			}
			throw error;
		}

		const account = await db.select().from(user).where(eq(user.email, email)).get();
		if (!account || !asBoolean(account.approved)) {
			await auth.api.signOut({ headers: event.request.headers });
			return fail(403, {
				message: 'This account is waiting for the chamber to approve it.',
				email
			});
		}

		const role = isRole(account.role) ? account.role : 'member';
		redirect(303, isStaffRole(role) ? '/desk' : '/matters');
	}
};
