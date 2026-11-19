import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { isRole, isStaffRole, type Role } from '#lib/roles.ts';
import type { AppUser } from '#lib/server/auth.ts';
import { listAccessRequests, listUsers } from '#lib/server/content.ts';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schema.ts';
import { createCredentialUser } from '#lib/server/users.ts';
import { textField } from '#lib/text.ts';

export const load: PageServerLoad = async () => {
	const [people, requests] = await Promise.all([listUsers(), listAccessRequests()]);
	return { people, requests };
};

async function guardLastAdmin(actor: AppUser, targetId: string, nextRole: Role, approved: boolean) {
	if (actor.id === targetId && (nextRole !== 'admin' || !approved)) {
		return 'Use another admin account to change your own access.';
	}
	const target = await db.select().from(user).where(eq(user.id, targetId)).get();
	if (!target) return 'Account not found.';
	if (target.role === 'admin' && actor.role !== 'admin') {
		return 'Only an admin can change an admin account.';
	}
	const losingAdmin = target.role === 'admin' && (nextRole !== 'admin' || !approved);
	if (!losingAdmin) return null;
	const admins = await db.select({ id: user.id }).from(user).where(eq(user.role, 'admin'));
	const approvedAdmins = admins.length;
	if (approvedAdmins <= 1) return 'The chamber needs at least one admin.';
	return null;
}

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const roleValue = String(form.get('role') ?? 'member');
		const role: Role = isRole(roleValue) ? roleValue : 'member';
		const created = await createCredentialUser({
			name: textField(form, 'name', 120),
			email: textField(form, 'email', 180),
			password: String(form.get('password') ?? ''),
			role,
			approved: form.get('approved') === 'on'
		});
		if ('error' in created) return fail(400, { message: created.error });
		return { message: 'Account created.' };
	},
	updateUser: async ({ locals, request }) => {
		const actor = locals.user;
		if (!actor || !isStaffRole(actor.role)) return fail(403, { message: 'Staff access is required.' });
		const form = await request.formData();
		const userId = textField(form, 'userId', 80);
		const roleValue = String(form.get('role') ?? 'member');
		const role: Role = isRole(roleValue) ? roleValue : 'member';
		if (role === 'admin' && actor.role !== 'admin') {
			return fail(403, { message: 'Only an admin can grant admin access.' });
		}
		const approved = form.get('approved') === 'on';
		const blocked = await guardLastAdmin(actor, userId, role, approved);
		if (blocked) return fail(400, { message: blocked });
		await db.update(user).set({ role, approved, updatedAt: new Date() }).where(eq(user.id, userId));
		return { message: 'Account updated.' };
	}
};
