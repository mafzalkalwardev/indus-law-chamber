import type { PageServerLoad } from './$types';

export const prerender = process.env.GITHUB_PAGES === 'true';
import { listPractice, listPublishedArticles } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	const [areas, articles] = await Promise.all([listPractice(), listPublishedArticles()]);
	return { areas, articles: articles.slice(0, 3) };
};
