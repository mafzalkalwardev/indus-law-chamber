export const generalWhatsappMessage =
	'Hello Indus Law Chamber, I would like to discuss a legal matter.';

export function whatsappHref(number: string | null | undefined, message: string) {
	const digits = (number ?? '').replace(/\D/g, '');
	if (!digits) return null;
	return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function matterWhatsappMessage(reference: string, title: string) {
	return `Hello Indus Law Chamber, I am writing about matter ${reference}: ${title}.`;
}

export function researchWhatsappMessage(title: string, citation: string) {
	const cite = citation ? ` (${citation})` : '';
	return `Hello Indus Law Chamber, I have a question about your note "${title}"${cite}.`;
}
