import type { PageServerLoad } from './$types';
import { getPrincipal } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	return { principal: await getPrincipal() };
};
