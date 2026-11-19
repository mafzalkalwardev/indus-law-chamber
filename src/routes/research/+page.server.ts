import type { PageServerLoad } from './$types';
import { listPublishedResearch } from '#lib/server/content.ts';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	return { q, notes: await listPublishedResearch(q) };
};
