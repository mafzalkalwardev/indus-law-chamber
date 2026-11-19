<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { GITHUB_PAGES } from '$app/env/public';
	import { chamberApp } from '#lib/site.ts';
	import { isStaffRole, type PublicUser } from '#lib/roles.ts';

	let { user }: { user: PublicUser | null } = $props();

	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/practice', label: 'Practice' },
		{ href: '/team', label: 'Team' },
		{ href: '/articles', label: 'Articles' },
		{ href: '/contact', label: 'Contact' }
	] as const;

	function current(href: string) {
		const id = page.route.id ?? '';
		return id === href || id.startsWith(`${href}/`);
	}
</script>

<header class="border-b border-line bg-paper">
	<div class="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 py-5">
		<a href={resolve('/')} class="block">
			<span class="block font-serif text-2xl leading-none text-ink">Indus Law Chamber</span>
			<span class="mt-1 block text-xs tracking-[0.18em] text-brass uppercase">Advocates</span>
		</a>
		<nav class="flex flex-wrap gap-x-5 gap-y-2 text-[0.98rem]" aria-label="Primary">
			{#each links as link (link.href)}
				<a
					href={resolve(link.href)}
					class={current(link.href) ? 'text-brass' : 'text-ink hover:text-brass'}
					aria-current={current(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
			{#if user}
				<a
					href={resolve('/research')}
					class={current('/research') ? 'text-brass' : 'text-ink hover:text-brass'}
					aria-current={current('/research') ? 'page' : undefined}
				>
					Research
				</a>
				<a
					href={resolve('/matters')}
					class={current('/matters') ? 'text-brass' : 'text-ink hover:text-brass'}
					aria-current={current('/matters') ? 'page' : undefined}
				>
					Matters
				</a>
				{#if isStaffRole(user.role)}
					<a
						href={resolve('/desk')}
						class={current('/desk') ? 'text-brass' : 'text-ink hover:text-brass'}
						aria-current={current('/desk') ? 'page' : undefined}
					>
						Desk
					</a>
				{/if}
			{/if}
		</nav>
		<div class="flex items-center gap-3 text-sm">
			{#if user}
				<span class="text-ink-soft">{user.name}</span>
				<form method="post" action={resolve('/logout')}>
					<button class="btn btn-line btn-small" type="submit">Sign out</button>
				</form>
			{:else}
				<a class="text-ink hover:text-brass" href={GITHUB_PAGES ? `${chamberApp}/login` : resolve('/login')}>Sign in</a>
				<a class="btn btn-small" href={GITHUB_PAGES ? `${chamberApp}/request-access` : resolve('/request-access')}>Request access</a>
			{/if}
		</div>
	</div>
</header>
