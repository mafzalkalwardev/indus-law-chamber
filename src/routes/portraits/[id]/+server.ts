import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { teamMember } from '#lib/server/db/schema.ts';
import { readPortrait } from '#lib/server/files.ts';

export const GET: RequestHandler = async ({ params }) => {
	const person = await db.select().from(teamMember).where(eq(teamMember.id, params.id)).get();
	if (!person?.photoStoredName) error(404, 'Portrait not found.');
	const bytes = await readPortrait(person.photoStoredName);
	const mime = person.photoStoredName.endsWith('.png')
		? 'image/png'
		: person.photoStoredName.endsWith('.webp')
			? 'image/webp'
			: 'image/jpeg';
	return new Response(new Uint8Array(bytes), {
		headers: {
			'Content-Type': mime,
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
