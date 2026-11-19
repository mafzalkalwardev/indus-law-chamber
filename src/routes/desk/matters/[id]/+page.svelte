<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import { formatDate } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.matter.reference} · Desk</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/desk/matters">Matters</a></p>
<h1 class="mt-3 font-serif text-4xl">{data.matter.title}</h1>
{#if data.saved}<p class="mt-3 text-brass" role="status">Saved.</p>{/if}
<Notice message={form?.message} />

<form class="mt-6 grid max-w-3xl gap-4" method="post" action="?/save">
	<Field label="Reference" name="reference" required value={data.matter.reference} />
	<Field label="Title" name="title" required value={data.matter.title} />
	<Field label="Court" name="court" value={data.matter.court} />
	<label>
		<span class="mb-1.5 block text-sm font-semibold text-ink-soft">Status</span>
		<select class="field" name="status">
			{#each ['Open', 'Hearing', 'Closed'] as status (status)}
				<option value={status} selected={data.matter.status === status}>{status}</option>
			{/each}
		</select>
	</label>
	<Field label="Next date" name="nextDate" type="date" value={data.matter.nextDate} />
	<Field label="Internal notes" name="internalNotes" textarea rows={4} value={data.matter.internalNotes} />
	<fieldset>
		<legend class="mb-2 text-sm font-semibold text-ink-soft">Clients who can see this matter</legend>
		{#if data.people.length === 0}
			<p class="text-sm text-ink-soft">Approve an account on the People page before assigning it.</p>
		{:else}
			<ul class="space-y-2">
				{#each data.people as person (person.id)}
					<li>
						<label class="flex items-center gap-2">
							<input type="checkbox" name="assignee" value={person.id} checked={data.assigned.includes(person.id)} />
							<span>{person.name} · {person.email}</span>
						</label>
					</li>
				{/each}
			</ul>
		{/if}
	</fieldset>
	<button class="btn w-fit" type="submit">Save matter</button>
</form>

<section class="mt-12 max-w-3xl">
	<h2 class="font-serif text-3xl">Client updates</h2>
	<form class="mt-4 grid gap-3" method="post" action="?/addUpdate">
		<Field label="Update the client can read" name="body" textarea rows={3} />
		<button class="btn w-fit" type="submit">Post update</button>
	</form>
	<ul class="mt-4 space-y-3">
		{#each data.updates as update (update.id)}
			<li class="border border-line p-3">
				<p class="text-sm text-brass">{formatDate(update.createdAt)}</p>
				<p class="mt-1 whitespace-pre-line">{update.body}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="mt-12 max-w-3xl">
	<h2 class="font-serif text-3xl">Documents</h2>
	<form class="mt-4 flex flex-wrap items-end gap-3" method="post" action="?/upload" enctype="multipart/form-data">
		<label>
			<span class="mb-1.5 block text-sm font-semibold text-ink-soft">File</span>
			<input class="field" name="file" type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" />
		</label>
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
