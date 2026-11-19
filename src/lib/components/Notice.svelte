<script lang="ts">
	let { message }: { message?: string | null } = $props();
</script>

{#if message}
	<p class="border border-line bg-card px-3 py-2 text-brass" role="status">{message}</p>
{/if}
