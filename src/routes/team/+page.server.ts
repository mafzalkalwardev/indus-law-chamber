import type { PageServerLoad } from './$types';
import { listTeam } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	return { team: await listTeam() };
};
