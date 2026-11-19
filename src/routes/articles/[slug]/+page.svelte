<script lang="ts">
	import { formatDate, paragraphs } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.article.title} · {data.settings.chamberName}</title>
	{#if data.article.excerpt}
		<meta name="description" content={data.article.excerpt} />
	{/if}
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/articles">Articles</a></p>
<h1 class="mt-4 max-w-3xl font-serif text-5xl leading-tight">{data.article.title}</h1>
{#if data.article.publishedAt}
	<p class="mt-3 text-ink-soft">{formatDate(data.article.publishedAt)}</p>
{/if}
{#if data.article.excerpt}
	<p class="mt-6 max-w-2xl text-xl text-ink-soft">{data.article.excerpt}</p>
{/if}
<div class="mt-8 max-w-2xl">
	{#each paragraphs(data.article.body) as paragraph, index (index)}
		<p class="mt-4 text-lg leading-relaxed whitespace-pre-line">{paragraph}</p>
	{/each}
</div>
