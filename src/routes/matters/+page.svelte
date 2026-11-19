<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Your matters · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Client portal</p>
<h1 class="mt-3 font-serif text-5xl">Your matters</h1>
<p class="mt-3 max-w-2xl text-ink-soft">Only matters the chamber has assigned to this account are listed here.</p>

{#if data.matters.length === 0}
	<p class="mt-8 border-t border-line pt-6 text-lg">No matters are assigned to this account yet.</p>
	<p class="mt-4"><a class="text-brass underline" href="/research">Open the research library</a></p>
{:else}
	<ul class="mt-8">
		{#each data.matters as matter (matter.id)}
			<li class="border-t border-line py-5">
				<a class="block hover:text-brass" href="/matters/{matter.id}">
					<span class="text-sm text-brass">{matter.reference}</span>
					<span class="mt-1 block font-serif text-3xl">{matter.title}</span>
					<span class="mt-2 block text-ink-soft">
						{matter.status}{matter.court ? ` · ${matter.court}` : ''}{matter.nextDate ? ` · Next date ${matter.nextDate}` : ''}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
