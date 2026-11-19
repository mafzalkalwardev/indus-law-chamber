import type { PageServerLoad } from './$types';
import { getPublishedArticle } from '#lib/server/content.ts';

export const load: PageServerLoad = async ({ params }) => {
	return { article: await getPublishedArticle(params.slug) };
};
