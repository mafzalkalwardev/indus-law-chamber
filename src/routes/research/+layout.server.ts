import { requireUser } from '#lib/server/access.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	requireUser(locals.user);
	return {};
};
