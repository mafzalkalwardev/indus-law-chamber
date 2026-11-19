<script lang="ts">
	import { page } from '$app/state';

	const links = [
		['/desk', 'Overview'],
		['/desk/inquiries', 'Inquiries'],
		['/desk/matters', 'Matters'],
		['/desk/research', 'Research'],
		['/desk/articles', 'Articles'],
		['/desk/team', 'Team'],
		['/desk/practice', 'Practice'],
		['/desk/people', 'People'],
		['/desk/settings', 'Settings']
	] as const;

	function current(href: string) {
		if (href === '/desk') return page.url.pathname === '/desk';
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<nav class="mb-8 flex flex-wrap gap-2" aria-label="Staff desk">
	{#each links as [href, label] (href)}
		<a
			class="border px-3 py-1.5 text-sm {current(href)
				? 'border-ink bg-ink text-paper'
				: 'border-line bg-card text-ink hover:border-brass'}"
			href={href}
			aria-current={current(href) ? 'page' : undefined}
		>
			{label}
		</a>
	{/each}
</nav>
