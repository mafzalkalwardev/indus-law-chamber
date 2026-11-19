import type { PageServerLoad } from './$types';
import { listPractice } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	return { areas: await listPractice() };
};
