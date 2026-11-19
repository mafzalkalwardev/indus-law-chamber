<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Practice · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Practice</p>
<h1 class="mt-3 max-w-2xl font-serif text-5xl">Work the chamber takes on</h1>
<p class="mt-5 max-w-2xl text-lg text-ink-soft">
	These are the areas the chamber lists. A first conversation starts from the contact page.
</p>

<ul class="mt-10 grid gap-6 md:grid-cols-2">
	{#each data.areas as area (area.id)}
		<li class="border border-line bg-card p-6">
			<h2 class="font-serif text-3xl">{area.title}</h2>
			<p class="mt-3 leading-relaxed text-ink-soft">{area.summary}</p>
		</li>
	{/each}
</ul>

<p class="mt-10"><a class="btn" href="/contact">Discuss a matter</a></p>
