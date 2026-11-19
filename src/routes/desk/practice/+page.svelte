<script lang="ts">
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Practice · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">Practice areas</h1>
<Notice message={form?.message} />
<ul class="mt-6 space-y-6">
	{#each data.areas as area (area.id)}
		<li>
			<form class="grid gap-3 border border-line bg-card p-4" method="post" action="?/update">
				<input type="hidden" name="id" value={area.id} />
				<label>
					<span class="mb-1 block text-sm font-semibold">Title</span>
					<input class="field" name="title" required value={area.title} />
				</label>
				<label>
					<span class="mb-1 block text-sm font-semibold">Summary</span>
					<textarea class="field" name="summary" rows="3">{area.summary}</textarea>
				</label>
				<label>
					<span class="mb-1 block text-sm font-semibold">Sort order</span>
					<input class="field" name="sortOrder" type="number" value={area.sortOrder} />
				</label>
				<button class="btn w-fit" type="submit">Save</button>
			</form>
			<form method="post" action="?/remove">
				<input type="hidden" name="id" value={area.id} />
				<button class="btn btn-line btn-small mt-2" type="submit">Remove</button>
			</form>
		</li>
	{/each}
</ul>
<form class="mt-8 grid max-w-xl gap-3 border border-line p-4" method="post" action="?/create">
	<h2 class="font-serif text-2xl">Add an area</h2>
	<input class="field" name="title" placeholder="Title" required />
	<textarea class="field" name="summary" rows="3" placeholder="Summary"></textarea>
	<button class="btn w-fit" type="submit">Add</button>
</form>
