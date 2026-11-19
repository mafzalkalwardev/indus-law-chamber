<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Research · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">Research notes</h1>
<form class="mt-6 flex max-w-xl flex-wrap items-end gap-3" method="post">
	<Notice message={form?.message} />
	<div class="min-w-64 flex-1"><Field label="New note title" name="title" required value={form?.title} /></div>
	<button class="btn" type="submit">Create draft</button>
</form>
<ul class="mt-8">
	{#each data.notes as note (note.id)}
		<li class="border-t border-line py-4">
			<a class="hover:text-brass" href="/desk/research/{note.id}">
				<span class="text-sm text-brass">{note.status}</span>
				<span class="mt-1 block font-serif text-2xl">{note.title}</span>
			</a>
		</li>
	{:else}
		<li class="mt-6 text-ink-soft">No notes yet.</li>
	{/each}
</ul>
