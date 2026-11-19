<script lang="ts">
	import { initials } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Team · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Team</p>
<h1 class="mt-3 font-serif text-5xl">Who appears for the chamber</h1>

<ul class="mt-10 divide-y divide-line border-y border-line">
	{#each data.team as person (person.id)}
		<li class="grid gap-6 py-8 md:grid-cols-[8rem_1fr]">
			{#if person.photoStoredName}
				<img class="h-32 w-32 object-cover" src="/portraits/{person.id}" alt="" width="128" height="128" />
			{:else}
				<div class="flex h-32 w-32 items-center justify-center bg-paper-deep font-serif text-3xl" aria-hidden="true">
					{initials(person.name)}
				</div>
			{/if}
			<div>
				<h2 class="font-serif text-3xl">{person.name}</h2>
				<p class="mt-1 text-brass">{person.roleTitle}</p>
				{#if person.bio}
					<p class="mt-4 max-w-2xl whitespace-pre-line leading-relaxed">{person.bio}</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>
