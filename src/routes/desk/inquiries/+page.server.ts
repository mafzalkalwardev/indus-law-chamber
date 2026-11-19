import type { PageServerLoad } from './$types';
import { listInquiries } from '#lib/server/content.ts';

export const load: PageServerLoad = async () => {
	return { inquiries: await listInquiries() };
};
