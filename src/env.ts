import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.' },
	ORIGIN: {
		description: 'The app origin (base URL), e.g. `http://localhost:5173`.'
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	ADMIN_EMAIL: {
		description: 'Email for the first admin account. Optional after that account exists.',
		schema: (value) => value?.trim() || undefined
	},
	ADMIN_PASSWORD: {
		description: 'Password for the first admin account. Not required once that account exists.',
		schema: (value) => value || undefined
	},
	ADMIN_NAME: {
		description: 'Display name for the first admin account.',
		schema: (value) => value?.trim() || 'Adv. Mahfil Hussain Kalwar'
	}
});
