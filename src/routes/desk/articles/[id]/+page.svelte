<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.article.title} · Articles</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/desk/articles">Articles</a></p>
<h1 class="mt-3 font-serif text-4xl">{data.article.title}</h1>
{#if data.saved}<p class="mt-3 text-brass" role="status">Saved.</p>{/if}
{#if data.article.status === 'published'}
	<p class="mt-2"><a class="text-brass underline" href="/articles/{data.article.slug}">View public page</a></p>
{/if}
<Notice message={form?.message} />
<form class="mt-6 grid max-w-3xl gap-4" method="post" action="?/save">
	<Field label="Title" name="title" required value={data.article.title} />
	<Field label="Slug" name="slug" value={data.article.slug} />
	<Field label="Excerpt" name="excerpt" textarea rows={3} value={data.article.excerpt} />
	<Field label="Body" name="body" textarea rows={12} value={data.article.body} />
	<label>
		<span class="mb-1.5 block text-sm font-semibold text-ink-soft">Visibility</span>
		<select class="field" name="status">
			<option value="draft" selected={data.article.status !== 'published'}>Draft</option>
			<option value="published" selected={data.article.status === 'published'}>Published</option>
		</select>
	</label>
	<button class="btn w-fit" type="submit">Save article</button>
</form>
