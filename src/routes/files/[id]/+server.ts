import type { RequestHandler } from './$types';
import { readableDocument, requireUser } from '#lib/server/access.ts';
import { readDocument } from '#lib/server/files.ts';

export const GET: RequestHandler = async ({ locals, params }) => {
	const user = requireUser(locals.user);
	const doc = await readableDocument(user, params.id);
	const bytes = await readDocument(doc.storedName);
	const filename = doc.originalName.replace(/["\\\r\n]/g, '');
	return new Response(new Uint8Array(bytes), {
		headers: {
			'Content-Type': doc.mime || 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
