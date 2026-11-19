import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getResearch, listResearchDocuments } from '#lib/server/content.ts';

export const load: PageServerLoad = async ({ params }) => {
	const note = await getResearch(params.id);
	if (note.status !== 'published') error(404, 'Research note not found.');
	return { note, documents: await listResearchDocuments(note.id) };
};
