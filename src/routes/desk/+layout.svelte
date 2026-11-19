<script lang="ts">
	import DeskNav from '#lib/components/DeskNav.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<DeskNav />
{@render children()}
