import type { PageServerLoad } from './$types';

export const prerender = process.env.GITHUB_PAGES === 'true';
import { listTeam } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	return { team: await listTeam() };
};
