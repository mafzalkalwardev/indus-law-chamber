<script lang="ts">
	import { enhance } from '$app/forms';
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Sign in · {data.settings.chamberName}</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Sign in</p>
	<h1 class="mt-3 font-serif text-4xl">Chamber account</h1>
	<p class="mt-3 text-ink-soft">Approved accounts can read the chamber’s research library and their own matters.</p>
	<form class="mt-8 grid gap-4" method="post" use:enhance>
		<Notice message={form?.message} />
		<Field label="Email" name="email" type="email" required value={form?.email} />
		<Field label="Password" name="password" type="password" required />
		<button class="btn" type="submit">Sign in</button>
	</form>
	<p class="mt-6 text-sm">
		Need an account? <a class="text-brass underline" href="/request-access">Request access</a>
	</p>
</div>
