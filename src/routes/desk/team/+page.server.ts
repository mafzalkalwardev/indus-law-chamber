import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { listTeam } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { teamMember } from '#lib/server/db/schema.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	return { team: await listTeam() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = textField(form, 'name', 160);
		const roleTitle = textField(form, 'roleTitle', 160);
		if (!name || !roleTitle) return fail(400, { message: 'Name and role are required.', name, roleTitle });
		const id = crypto.randomUUID();
		await db.insert(teamMember).values({ id, name, roleTitle, sortOrder: 10, isPrincipal: false });
		redirect(303, `/desk/team/${id}`);
	}
};
