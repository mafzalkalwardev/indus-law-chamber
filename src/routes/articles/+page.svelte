<script lang="ts">
	import { formatDate } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Articles · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Articles</p>
<h1 class="mt-3 font-serif text-5xl">Writing from the chamber</h1>

{#if data.articles.length === 0}
	<p class="mt-8 border-t border-line pt-6 text-lg text-ink-soft">No articles have been published yet.</p>
{:else}
	<ul class="mt-8">
		{#each data.articles as article (article.id)}
			<li class="border-t border-line py-6">
				<a href="/articles/{article.slug}" class="block max-w-2xl hover:text-brass">
					<h2 class="font-serif text-3xl">{article.title}</h2>
					{#if article.excerpt}
						<p class="mt-2 text-ink-soft">{article.excerpt}</p>
					{/if}
					{#if article.publishedAt}
						<p class="mt-2 text-sm text-brass">{formatDate(article.publishedAt)}</p>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}
