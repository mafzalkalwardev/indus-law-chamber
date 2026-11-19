import { ORIGIN, BETTER_AUTH_SECRET } from '$app/env/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '#lib/server/db/index.ts';
import { account, session, user, verification } from '#lib/server/db/auth.schema.ts';
import { asBoolean, isRole, type PublicUser, type Role } from '#lib/roles.ts';

export type AppUser = PublicUser & {
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export const auth = betterAuth({
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: { user, session, account, verification }
	}),
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
		autoSignIn: false
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: true,
				defaultValue: 'member',
				input: false
			},
			approved: {
				type: 'boolean',
				required: true,
				defaultValue: false,
				input: false
			}
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});

export function toAppUser(raw: {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	role?: unknown;
	approved?: unknown;
	createdAt: Date;
	updatedAt: Date;
}): AppUser {
	const role: Role = isRole(raw.role) ? raw.role : 'member';
	return {
		id: raw.id,
		name: raw.name,
		email: raw.email,
		emailVerified: asBoolean(raw.emailVerified),
		image: raw.image ?? null,
		role,
		approved: asBoolean(raw.approved),
		createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
		updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : new Date(raw.updatedAt)
	};
}
