import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from '$app/env/private';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { practiceArea, siteSettings, teamMember, user } from '#lib/server/db/schema.ts';
import { createCredentialUser } from '#lib/server/users.ts';

let ready: Promise<void> | null = null;

const practiceSeed = [
	{
		title: 'Civil',
		summary: 'Disputes over property, contracts, and other civil claims.',
		sortOrder: 1
	},
	{
		title: 'Criminal',
		summary: 'Defence and private complaints in criminal proceedings.',
		sortOrder: 2
	},
	{
		title: 'Family',
		summary: 'Matters of marriage, custody, guardianship, and inheritance.',
		sortOrder: 3
	},
	{
		title: 'Constitutional',
		summary: 'Petitions and proceedings that raise constitutional questions.',
		sortOrder: 4
	}
];

async function seedDatabase() {
	const settings = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.id, 1)).get();
	if (!settings) {
		await db.insert(siteSettings).values({
			id: 1,
			chamberName: 'Indus Law Chamber',
			principalName: 'Adv. Mahfil Hussain Kalwar',
			aboutIntro: 'Indus Law Chamber is the practice of Advocate Mahfil Hussain Kalwar.',
			phone: '',
			whatsapp: '',
			email: '',
			address: '',
			hours: ''
		});
	}

	const areas = await db.select({ id: practiceArea.id }).from(practiceArea).all();
	if (areas.length === 0) {
		await db.insert(practiceArea).values(practiceSeed);
	}

	const members = await db.select({ id: teamMember.id }).from(teamMember).all();
	if (members.length === 0) {
		await db.insert(teamMember).values({
			name: 'Adv. Mahfil Hussain Kalwar',
			roleTitle: 'Principal',
			bio: '',
			courts: '',
			education: '',
			sortOrder: 0,
			isPrincipal: true
		});
	}

	if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

	const email = ADMIN_EMAIL.trim().toLowerCase();
	const existing = await db.select().from(user).where(eq(user.email, email)).get();
	if (existing) {
		if (existing.role !== 'admin' || !existing.approved) {
			await db
				.update(user)
				.set({ role: 'admin', approved: true, updatedAt: new Date() })
				.where(eq(user.id, existing.id));
		}
		return;
	}

	const created = await createCredentialUser({
		name: ADMIN_NAME?.trim() || 'Adv. Mahfil Hussain Kalwar',
		email,
		password: ADMIN_PASSWORD,
		role: 'admin',
		approved: true
	});
	if ('error' in created) throw new Error(created.error);
}

export function seed() {
	ready ??= seedDatabase();
	return ready;
}
