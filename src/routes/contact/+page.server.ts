import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '#lib/server/db/index.ts';
import { inquiry } from '#lib/server/db/schema.ts';
import { looksLikeEmail, textField } from '#lib/text.ts';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		if (textField(form, 'website', 200)) return { success: true };

		const name = textField(form, 'name', 120);
		const phone = textField(form, 'phone', 40);
		const email = textField(form, 'email', 180);
		const subject = textField(form, 'subject', 180);
		const message = textField(form, 'message', 5000);
		const values = { name, phone, email, subject, message };

		if (!name || !subject || !message) {
			return fail(400, { message: 'Name, subject, and message are required.', values });
		}
		if (email && !looksLikeEmail(email)) {
			return fail(400, { message: 'Enter a valid email address, or leave it blank.', values });
		}

		await db.insert(inquiry).values({ name, phone, email, subject, message, status: 'new' });
		return { success: true };
	}
};
