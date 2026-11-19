<script lang="ts">
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import WhatsAppFloat from '#lib/components/WhatsAppFloat.svelte';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import './layout.css';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<SiteHeader user={data.user} />
	<main class="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
		{@render children()}
	</main>
	<SiteFooter settings={data.settings} />
</div>
<WhatsAppFloat href={data.generalWhatsapp} />
