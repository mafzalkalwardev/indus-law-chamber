import type { PageServerLoad } from './$types';
import { listPractice, listPublishedArticles } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	const [areas, articles] = await Promise.all([listPractice(), listPublishedArticles()]);
	return { areas, articles: articles.slice(0, 3) };
};
