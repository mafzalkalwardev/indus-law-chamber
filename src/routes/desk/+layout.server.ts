import { requireStaff } from '#lib/server/access.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	requireStaff(locals.user);
	return {};
};
