<script lang="ts">
	import { enhance } from '$app/forms';
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Matters · Desk</title>
</svelte:head>

<div class="flex flex-wrap items-end justify-between gap-4">
	<h1 class="font-serif text-4xl">Matters</h1>
</div>

<form class="mt-6 grid max-w-xl gap-4 border border-line bg-card p-5" method="post" use:enhance>
	<h2 class="font-serif text-2xl">Open a matter</h2>
	<Notice message={form?.message} />
	<Field label="Reference" name="reference" required value={form?.reference} />
	<Field label="Title" name="title" required value={form?.title} />
	<button class="btn w-fit" type="submit">Create matter</button>
</form>

<ul class="mt-8">
	{#each data.matters as matter (matter.id)}
		<li class="border-t border-line py-4">
			<a class="hover:text-brass" href="/desk/matters/{matter.id}">
				<span class="text-sm text-brass">{matter.reference} · {matter.status}</span>
				<span class="mt-1 block font-serif text-2xl">{matter.title}</span>
			</a>
		</li>
	{:else}
		<li class="border-t border-line py-4 text-ink-soft">No matters yet.</li>
	{/each}
</ul>
