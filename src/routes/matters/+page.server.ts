import type { PageServerLoad } from './$types';
import { requireUser } from '#lib/server/access.ts';
import { listMattersForUser } from '#lib/server/content.ts';

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireUser(locals.user);
	return { matters: await listMattersForUser(user.id) };
};
