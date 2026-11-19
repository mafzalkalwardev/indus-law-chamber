import type { PageServerLoad } from './$types';
import { listPublishedArticles } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	return { articles: await listPublishedArticles() };
};
