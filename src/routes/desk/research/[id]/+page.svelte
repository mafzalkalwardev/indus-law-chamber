<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.note.title} · Research</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/desk/research">Research</a></p>
<h1 class="mt-3 font-serif text-4xl">{data.note.title}</h1>
{#if data.saved}<p class="mt-3 text-brass" role="status">Saved.</p>{/if}
<Notice message={form?.message} />

<form class="mt-6 grid max-w-3xl gap-4" method="post" action="?/save">
	<Field label="Title" name="title" required value={data.note.title} />
	<Field label="Citation" name="citation" value={data.note.citation} />
	<div class="grid gap-4 sm:grid-cols-3">
		<Field label="Court" name="court" value={data.note.court} />
		<Field label="Year" name="year" value={data.note.year} />
		<Field label="Topic" name="topic" value={data.note.topic} />
	</div>
	<Field label="Chamber note" name="summary" textarea rows={8} value={data.note.summary} />
	<label>
		<span class="mb-1.5 block text-sm font-semibold text-ink-soft">Visibility</span>
		<select class="field" name="status">
			<option value="draft" selected={data.note.status !== 'published'}>Draft</option>
			<option value="published" selected={data.note.status === 'published'}>Published</option>
		</select>
	</label>
	<label class="flex items-start gap-2">
		<input type="checkbox" name="rightsConfirmed" checked={data.note.rightsConfirmed} />
		<span>The chamber has the right to publish this note and any file attached to it.</span>
	</label>
	<button class="btn w-fit" type="submit">Save note</button>
</form>

<section class="mt-12 max-w-3xl">
	<h2 class="font-serif text-3xl">File</h2>
	<p class="mt-2 text-sm text-ink-soft">Upload only a document the chamber is allowed to keep and show.</p>
	<form class="mt-4 flex flex-wrap items-end gap-3" method="post" action="?/upload" enctype="multipart/form-data">
		<input class="field" name="file" type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" />
		<button class="btn" type="submit">Upload</button>
	</form>
	<ul class="mt-4">
		{#each data.documents as doc (doc.id)}
			<li class="flex items-center justify-between gap-3 border-t border-line py-3">
				<a class="underline" href="/files/{doc.id}">{doc.originalName}</a>
				<form method="post" action="?/removeDocument">
					<input type="hidden" name="documentId" value={doc.id} />
					<button class="btn btn-line btn-small" type="submit">Remove</button>
				</form>
			</li>
		{/each}
	</ul>
</section>
