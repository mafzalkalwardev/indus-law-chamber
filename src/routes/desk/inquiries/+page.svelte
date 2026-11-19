<script lang="ts">
	import { formatDate } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Inquiries · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">Inquiries</h1>
{#if data.inquiries.length === 0}
	<p class="mt-6 text-ink-soft">No inquiries yet.</p>
{:else}
	<ul class="mt-6">
		{#each data.inquiries as item (item.id)}
			<li class="border-t border-line py-4">
				<a class="block hover:text-brass" href="/desk/inquiries/{item.id}">
					<span class="text-sm text-brass">{item.status} · {formatDate(item.createdAt)}</span>
					<span class="mt-1 block font-serif text-2xl">{item.subject}</span>
					<span class="text-ink-soft">{item.name}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
