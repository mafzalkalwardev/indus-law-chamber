<script lang="ts">
	import { formatDate } from '#lib/text.ts';
	import { matterWhatsappMessage, whatsappHref } from '#lib/whatsapp.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const whatsapp = $derived(
		whatsappHref(data.settings.whatsapp, matterWhatsappMessage(data.matter.reference, data.matter.title))
	);
</script>

<svelte:head>
	<title>{data.matter.reference} · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/matters">Your matters</a></p>
<p class="mt-4 text-sm text-brass">{data.matter.reference}</p>
<h1 class="mt-2 font-serif text-4xl">{data.matter.title}</h1>
<dl class="mt-6 grid gap-4 sm:grid-cols-3">
	<div>
		<dt class="text-sm text-brass">Status</dt>
		<dd>{data.matter.status}</dd>
	</div>
	<div>
		<dt class="text-sm text-brass">Court</dt>
		<dd>{data.matter.court || '—'}</dd>
	</div>
	<div>
		<dt class="text-sm text-brass">Next date</dt>
		<dd>{data.matter.nextDate || '—'}</dd>
	</div>
</dl>

{#if whatsapp}
	<p class="mt-6">
		<a class="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp about this matter</a>
	</p>
{/if}

<section class="mt-12">
	<h2 class="font-serif text-3xl">Updates</h2>
	{#if data.updates.length === 0}
		<p class="mt-4 text-ink-soft">No updates yet.</p>
	{:else}
		<ul class="mt-4 space-y-4">
			{#each data.updates as update (update.id)}
				<li class="border border-line bg-card p-4">
					<p class="text-sm text-brass">{formatDate(update.createdAt)}</p>
					<p class="mt-2 whitespace-pre-line">{update.body}</p>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<section class="mt-12">
	<h2 class="font-serif text-3xl">Documents</h2>
	{#if data.documents.length === 0}
		<p class="mt-4 text-ink-soft">No documents on this matter.</p>
	{:else}
		<ul class="mt-4">
			{#each data.documents as doc (doc.id)}
				<li class="border-t border-line py-3">
					<a class="underline" href="/files/{doc.id}">{doc.originalName}</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
