import { hashPassword } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';
import type { Role } from '#lib/roles.ts';
import { db } from '#lib/server/db/index.ts';
import { account, user } from '#lib/server/db/schema.ts';

export async function createCredentialUser(input: {
	name: string;
	email: string;
	password: string;
	role: Role;
	approved: boolean;
}) {
	const email = input.email.trim().toLowerCase();
	const name = input.name.trim();
	if (!name) return { error: 'Name is required.' as const };
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { error: 'Enter a valid email address.' as const };
	}
	if (input.password.length < 8) {
		return { error: 'Password must be at least 8 characters.' as const };
	}

	const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).get();
	if (existing) return { error: 'An account with this email already exists.' as const };

	const id = crypto.randomUUID();
	const now = new Date();
	const password = await hashPassword(input.password);

	await db.insert(user).values({
		id,
		name,
		email,
		emailVerified: false,
		role: input.role,
		approved: input.approved,
		createdAt: now,
		updatedAt: now
	});
	await db.insert(account).values({
		id: crypto.randomUUID(),
		accountId: id,
		providerId: 'credential',
		userId: id,
		password,
		createdAt: now,
		updatedAt: now
	});

	return { id };
}
