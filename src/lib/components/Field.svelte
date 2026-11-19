<script lang="ts">
	let {
		label,
		name,
		value = '',
		type = 'text',
		required = false,
		textarea = false,
		rows = 5
	}: {
		label: string;
		name: string;
		value?: string | number | null;
		type?: string;
		required?: boolean;
		textarea?: boolean;
		rows?: number;
	} = $props();
</script>

<label class="block">
	<span class="mb-1.5 block text-sm font-semibold text-ink-soft">{label}</span>
	{#if textarea}
		<textarea class="field" {name} {required} {rows}>{value ?? ''}</textarea>
	{:else}
		<input class="field" {name} {type} {required} value={value ?? ''} />
	{/if}
</label>
