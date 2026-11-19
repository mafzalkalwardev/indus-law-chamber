import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { listTeam } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { teamMember } from '#lib/server/db/schema.ts';
import { removeStored, savePortrait } from '#lib/server/files.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async ({ params, url }) => {
	const person = (await listTeam()).find((item) => item.id === params.id);
	if (!person) redirect(303, '/desk/team');
	return { person, saved: url.searchParams.get('saved') === '1' };
};

export const actions: Actions = {
	save: async ({ params, request }) => {
		const current = await db.select().from(teamMember).where(eq(teamMember.id, params.id)).get();
		if (!current) return fail(404, { message: 'That person is no longer on the team.' });
		const form = await request.formData();
		const name = textField(form, 'name', 160);
		const roleTitle = textField(form, 'roleTitle', 160);
		const bio = textField(form, 'bio', 5000);
		const courts = textField(form, 'courts', 500);
		const education = textField(form, 'education', 500);
		const sortOrder = Number(textField(form, 'sortOrder', 6) || '0');
		const isPrincipal = form.get('isPrincipal') === 'on';
		if (!name || !roleTitle) return fail(400, { message: 'Name and role are required.' });
		if (!Number.isFinite(sortOrder)) return fail(400, { message: 'Sort order must be a number.' });

		let photoStoredName = current.photoStoredName;
		const file = form.get('photo');
		if (file instanceof File && file.size > 0) {
			try {
				const saved = await savePortrait(file);
				if (saved) {
					await removeStored('portrait', current.photoStoredName);
					photoStoredName = saved.storedName;
				}
			} catch (error) {
				return fail(400, { message: error instanceof Error ? error.message : 'Portrait upload failed.' });
			}
		}

		if (isPrincipal) await db.update(teamMember).set({ isPrincipal: false });
		await db
			.update(teamMember)
			.set({
				name,
				roleTitle,
				bio,
				courts,
				education,
				sortOrder,
				isPrincipal,
				photoStoredName
			})
			.where(eq(teamMember.id, params.id));
		redirect(303, `/desk/team/${params.id}?saved=1`);
	},
	remove: async ({ params }) => {
		const team = await listTeam();
		if (team.length <= 1) return fail(400, { message: 'Keep at least one person on the team page.' });
		const current = team.find((item) => item.id === params.id);
		if (!current) return fail(404, { message: 'That person is no longer on the team.' });
		await removeStored('portrait', current.photoStoredName);
		await db.delete(teamMember).where(eq(teamMember.id, params.id));
		redirect(303, '/desk/team');
	}
};
