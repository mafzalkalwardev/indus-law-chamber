import type { PageServerLoad } from './$types';
import { assertClientMatter, requireUser } from '#lib/server/access.ts';
import { getMatter, listMatterDocuments, listUpdates } from '#lib/server/content.ts';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = requireUser(locals.user);
	await assertClientMatter(user, params.id);
	const row = await getMatter(params.id);
	return {
		matter: {
			id: row.id,
			reference: row.reference,
			title: row.title,
			court: row.court,
			status: row.status,
			nextDate: row.nextDate
		},
		updates: await listUpdates(params.id),
		documents: await listMatterDocuments(params.id)
	};
};
