<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Research · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Research library</p>
<h1 class="mt-3 font-serif text-5xl">Notes published by the chamber</h1>
<p class="mt-4 max-w-2xl text-ink-soft">
	These are the chamber’s own notes and the documents it has confirmed it may publish. This library is not a copy of any other law site.
</p>

<form class="mt-8 flex flex-wrap gap-3" method="get">
	<label class="min-w-64 flex-1">
		<span class="sr-only">Search</span>
		<input class="field" name="q" value={data.q} placeholder="Title, citation, court, topic, or year" />
	</label>
	<button class="btn" type="submit">Search</button>
</form>

{#if data.notes.length === 0}
	<p class="mt-8 text-lg text-ink-soft">No published notes match this search.</p>
{:else}
	<ul class="mt-8">
		{#each data.notes as note (note.id)}
			<li class="border-t border-line py-5">
				<a class="block hover:text-brass" href="/research/{note.id}">
					<span class="font-serif text-3xl">{note.title}</span>
					<span class="mt-2 block text-ink-soft">
						{[note.citation, note.court, note.year, note.topic].filter(Boolean).join(' · ')}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
