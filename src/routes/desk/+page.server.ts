import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '#lib/server/db/index.ts';
import { inquiry, matter, researchItem, user } from '#lib/server/db/schema.ts';

function tally(row: { n: number } | undefined) {
	return Number(row?.n ?? 0);
}

export const load: PageServerLoad = async () => {
	const [newInquiries, openMatters, drafts, pending] = [
		tally(await db.select({ n: count() }).from(inquiry).where(eq(inquiry.status, 'new')).get()),
		tally(await db.select({ n: count() }).from(matter).where(eq(matter.status, 'Open')).get()),
		tally(await db.select({ n: count() }).from(researchItem).where(eq(researchItem.status, 'draft')).get()),
		tally(await db.select({ n: count() }).from(user).where(eq(user.approved, false)).get())
	];
	return { newInquiries, openMatters, drafts, pending };
};
