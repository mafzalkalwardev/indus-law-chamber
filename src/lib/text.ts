export function textField(form: FormData, name: string, max = 4000) {
	return String(form.get(name) ?? '')
		.trim()
		.slice(0, max);
}

export function slugify(value: string) {
	const slug = value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return slug || 'note';
}

export function formatDate(value: Date | string | number | null | undefined) {
	if (value === null || value === undefined || value === '') return '';
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
}

export function initials(name: string) {
	const parts = name
		.replace(/^Adv\.?\s+/i, '')
		.split(/\s+/)
		.filter(Boolean);
	return parts
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

export function paragraphs(body: string) {
	return body
		.split(/\n\s*\n/)
		.map((part) => part.trim())
		.filter(Boolean);
}

export function looksLikeEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
