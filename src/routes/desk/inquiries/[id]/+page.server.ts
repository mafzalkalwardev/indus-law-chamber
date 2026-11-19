import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getInquiry } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { inquiry } from '#lib/server/db/schema.ts';

const statuses = ['new', 'reviewed', 'closed'];

export const load: PageServerLoad = async ({ params }) => {
	return { inquiry: await getInquiry(params.id) };
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const form = await request.formData();
		const status = String(form.get('status') ?? '');
		if (!statuses.includes(status)) return fail(400, { message: 'Choose a status.' });
		await db.update(inquiry).set({ status }).where(eq(inquiry.id, params.id));
		redirect(303, `/desk/inquiries/${params.id}?saved=1`);
	}
};
