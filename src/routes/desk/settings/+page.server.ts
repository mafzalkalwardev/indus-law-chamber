import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getSettings } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { siteSettings } from '#lib/server/db/schema.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	return { current: await getSettings() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const chamberName = textField(form, 'chamberName', 160);
		const principalName = textField(form, 'principalName', 160);
		if (!chamberName || !principalName) return fail(400, { message: 'Chamber name and principal name are required.' });
		await db
			.update(siteSettings)
			.set({
				chamberName,
				principalName,
				aboutIntro: textField(form, 'aboutIntro', 800),
				phone: textField(form, 'phone', 40),
				whatsapp: textField(form, 'whatsapp', 40),
				email: textField(form, 'email', 180),
				address: textField(form, 'address', 500),
				hours: textField(form, 'hours', 200)
			})
			.where(eq(siteSettings.id, 1));
		return { message: 'Settings saved. WhatsApp links appear wherever a number is saved.' };
	}
};
