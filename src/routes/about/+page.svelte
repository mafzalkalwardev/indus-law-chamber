<script lang="ts">
	import { initials } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const person = $derived(data.principal);
</script>

<svelte:head>
	<title>About · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">About</p>
<h1 class="mt-3 font-serif text-5xl">The chamber</h1>
<p class="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft">{data.settings.aboutIntro}</p>

{#if person}
	<article class="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-[8rem_1fr]">
		{#if person.photoStoredName}
			<img
				class="h-32 w-32 object-cover"
				src="/portraits/{person.id}"
				alt={person.name}
				width="128"
				height="128"
			/>
		{:else}
			<div class="flex h-32 w-32 items-center justify-center bg-ink font-serif text-3xl text-paper" aria-hidden="true">
				{initials(person.name)}
			</div>
		{/if}
		<div>
			<h2 class="font-serif text-3xl">{person.name}</h2>
			<p class="mt-1 text-brass">{person.roleTitle}</p>
			{#if person.bio}
				<p class="mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed">{person.bio}</p>
			{/if}
			{#if person.courts}
				<p class="mt-5"><span class="font-semibold">Courts. </span>{person.courts}</p>
			{/if}
			{#if person.education}
				<p class="mt-2"><span class="font-semibold">Education. </span>{person.education}</p>
			{/if}
		</div>
	</article>
{/if}
