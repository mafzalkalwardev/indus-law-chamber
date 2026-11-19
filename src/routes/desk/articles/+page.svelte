<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Articles · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">Articles</h1>
<form class="mt-6 flex max-w-xl flex-wrap items-end gap-3" method="post">
	<Notice message={form?.message} />
	<div class="min-w-64 flex-1"><Field label="New article title" name="title" required value={form?.title} /></div>
	<button class="btn" type="submit">Create draft</button>
</form>
<ul class="mt-8">
	{#each data.articles as article (article.id)}
		<li class="border-t border-line py-4">
			<a class="hover:text-brass" href="/desk/articles/{article.id}">
				<span class="text-sm text-brass">{article.status}</span>
				<span class="mt-1 block font-serif text-2xl">{article.title}</span>
			</a>
		</li>
	{:else}
		<li class="mt-6 text-ink-soft">No articles yet.</li>
	{/each}
</ul>
