import type { Handle } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { eq } from 'drizzle-orm';
import { asBoolean } from '#lib/roles.ts';
import { auth, toAppUser } from '#lib/server/auth.ts';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schema.ts';
import { seed } from '#lib/server/seed.ts';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	if (!building || process.env.GITHUB_PAGES === 'true') await seed();

	const session = await auth.api.getSession({ headers: event.request.headers });
	if (session) {
		const row = await db.select().from(user).where(eq(user.id, session.user.id)).get();
		if (!row || !asBoolean(row.approved)) {
			await auth.api.signOut({ headers: event.request.headers });
		} else {
			event.locals.session = session.session;
			event.locals.user = toAppUser({
				...session.user,
				role: row.role,
				approved: row.approved
			});
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
