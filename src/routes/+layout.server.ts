import type { LayoutServerLoad } from './$types';
import { getSettings } from '#lib/server/content.ts';
import { generalWhatsappMessage, whatsappHref } from '#lib/whatsapp.ts';

export const load: LayoutServerLoad = async ({ locals }) => {
	const settings = await getSettings();
	return {
		settings,
		generalWhatsapp: whatsappHref(settings.whatsapp, generalWhatsappMessage),
		user: locals.user
			? {
					id: locals.user.id,
					name: locals.user.name,
					email: locals.user.email,
					role: locals.user.role,
					approved: locals.user.approved
				}
			: null
	};
};
