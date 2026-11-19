<script lang="ts">
	let { href }: { href: string | null } = $props();
</script>

{#if href}
	<a
		class="fixed right-5 bottom-5 z-20 bg-[#128C7E] px-4 py-3 font-semibold text-white shadow-lg"
		href={href}
		target="_blank"
		rel="noopener noreferrer"
	>
		WhatsApp
	</a>
{/if}
