<script lang="ts">
	import { paragraphs } from '#lib/text.ts';
	import { researchWhatsappMessage, whatsappHref } from '#lib/whatsapp.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const whatsapp = $derived(
		whatsappHref(data.settings.whatsapp, researchWhatsappMessage(data.note.title, data.note.citation))
	);
</script>

<svelte:head>
	<title>{data.note.title} · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/research">Research library</a></p>
<h1 class="mt-4 max-w-3xl font-serif text-5xl leading-tight">{data.note.title}</h1>
<p class="mt-3 text-ink-soft">
	{[data.note.citation, data.note.court, data.note.year, data.note.topic].filter(Boolean).join(' · ')}
</p>
<div class="mt-8 max-w-2xl">
	{#each paragraphs(data.note.summary) as paragraph, index (index)}
		<p class="mt-4 text-lg leading-relaxed whitespace-pre-line">{paragraph}</p>
	{/each}
</div>

{#if data.documents.length > 0}
	<h2 class="mt-10 font-serif text-2xl">Documents</h2>
	<ul class="mt-3">
		{#each data.documents as doc (doc.id)}
			<li class="border-t border-line py-3">
				<a class="underline" href="/files/{doc.id}">{doc.originalName}</a>
			</li>
		{/each}
	</ul>
{/if}

{#if whatsapp}
	<p class="mt-8">
		<a class="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp about this note</a>
	</p>
{/if}
