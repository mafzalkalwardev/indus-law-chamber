<script lang="ts">
	import { enhance } from '$app/forms';
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Request access · {data.settings.chamberName}</title>
</svelte:head>

<div class="mx-auto max-w-lg">
	<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Library access</p>
	<h1 class="mt-3 font-serif text-4xl">Ask the chamber for a login</h1>
	<p class="mt-3 text-ink-soft">
		A login lets you read research notes the chamber itself publishes. It is switched on only after the chamber approves the request.
	</p>

	{#if form?.success}
		<p class="mt-8 border border-line bg-card p-6" role="status">
			The request is in. You can sign in after the chamber approves this email.
		</p>
	{:else}
		<form class="mt-8 grid gap-4" method="post" use:enhance>
			<Notice message={form?.message} />
			<Field label="Name" name="name" required value={form?.values?.name} />
			<Field label="Email" name="email" type="email" required value={form?.values?.email} />
			<Field label="Password" name="password" type="password" required />
			<Field label="What you want to look up" name="note" textarea rows={4} value={form?.values?.note} />
			<label class="hp">
				Website
				<input name="website" tabindex="-1" autocomplete="off" />
			</label>
			<button class="btn w-fit" type="submit">Submit request</button>
		</form>
	{/if}
</div>
