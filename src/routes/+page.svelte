<script lang="ts">
	import { resolve } from '$app/paths';
	import { GITHUB_PAGES } from '$app/env/public';
	import { chamberApp } from '#lib/site.ts';
	import { formatDate } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.settings.chamberName}</title>
	<meta name="description" content={data.settings.aboutIntro} />
</svelte:head>

<section class="grid items-end gap-12 border-b border-line pb-14 lg:grid-cols-12">
	<div class="lg:col-span-7">
		<p class="text-xs font-semibold tracking-[0.22em] text-brass uppercase">A chamber in practice</p>
		<h1 class="mt-4 max-w-xl font-serif text-5xl leading-[1.05] text-ink md:text-6xl">
			{data.settings.chamberName}
		</h1>
		<p class="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft">{data.settings.aboutIntro}</p>
		<p class="mt-4 text-lg">Principal, {data.settings.principalName}</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a class="btn" href={resolve('/contact')}>Discuss a matter</a>
			<a class="btn btn-line" href={GITHUB_PAGES ? `${chamberApp}/request-access` : resolve('/request-access')}>Request library access</a>
		</div>
	</div>
	<ol class="lg:col-span-5">
		{#each data.areas as area, index (area.id)}
			<li class="border-t border-line py-4">
				<a class="group grid grid-cols-[auto_1fr] gap-4" href={resolve('/practice')}>
					<span class="font-serif text-brass">0{index + 1}</span>
					<span>
						<span class="block font-serif text-2xl group-hover:text-brass">{area.title}</span>
						<span class="mt-1 block text-ink-soft">{area.summary}</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>
</section>

<section class="grid gap-10 py-14 md:grid-cols-[1fr_1.4fr]">
	<div>
		<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">From the chamber</p>
		<h2 class="mt-3 font-serif text-4xl">Articles</h2>
		<p class="mt-3 text-ink-soft">Notes the chamber publishes in its own words.</p>
	</div>
	<div>
		{#if data.articles.length === 0}
			<p class="border-t border-line pt-4 text-ink-soft">New articles will appear here when the chamber publishes them.</p>
		{:else}
			<ul>
				{#each data.articles as article (article.id)}
					<li class="border-t border-line py-4">
						<a href={resolve('/articles/[slug]', { slug: article.slug })} class="block hover:text-brass">
							<span class="font-serif text-2xl">{article.title}</span>
							{#if article.publishedAt}
								<span class="mt-1 block text-sm text-ink-soft">{formatDate(article.publishedAt)}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
			<p class="mt-4"><a class="text-brass underline" href={resolve('/articles')}>All articles</a></p>
		{/if}
	</div>
</section>
