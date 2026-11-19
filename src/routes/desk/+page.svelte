<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const cards = $derived([
		['New inquiries', data.newInquiries, '/desk/inquiries'],
		['Open matters', data.openMatters, '/desk/matters'],
		['Research drafts', data.drafts, '/desk/research'],
		['Accounts waiting', data.pending, '/desk/people']
	] as const);
</script>

<svelte:head>
	<title>Desk · {data.settings.chamberName}</title>
</svelte:head>

<h1 class="font-serif text-4xl">Desk</h1>
<p class="mt-3 max-w-2xl text-ink-soft">Inquiries, matters, the chamber’s research notes, articles, and the public pages.</p>
<ul class="mt-8 grid gap-4 sm:grid-cols-2">
	{#each cards as [label, value, href] (href)}
		<li>
			<a class="block border border-line bg-card p-5 hover:border-brass" {href}>
				<span class="font-serif text-4xl">{value}</span>
				<span class="mt-2 block">{label}</span>
			</a>
		</li>
	{/each}
</ul>
