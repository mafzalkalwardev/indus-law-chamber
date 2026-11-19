<script lang="ts">
	import { enhance } from '$app/forms';
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import { generalWhatsappMessage, whatsappHref } from '#lib/whatsapp.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const whatsapp = $derived(whatsappHref(data.settings.whatsapp, generalWhatsappMessage));
</script>

<svelte:head>
	<title>Contact · {data.settings.chamberName}</title>
</svelte:head>

<p class="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Contact</p>
<h1 class="mt-3 font-serif text-5xl">Discuss a matter</h1>
<p class="mt-4 max-w-2xl text-lg text-ink-soft">
	Send the outline of the matter. The chamber reads every inquiry. This form does not create a lawyer-client relationship.
</p>

<div class="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
	{#if form?.success}
		<p class="border border-line bg-card p-6 text-lg" role="status">
			The inquiry is with the chamber. Someone will reply using the details you left.
		</p>
	{:else}
		<form class="grid gap-4" method="post" use:enhance>
			<Notice message={form?.message} />
			<Field label="Name" name="name" required value={form?.values?.name} />
			<Field label="Phone" name="phone" value={form?.values?.phone} />
			<Field label="Email" name="email" type="email" value={form?.values?.email} />
			<Field label="Subject" name="subject" required value={form?.values?.subject} />
			<Field label="Message" name="message" textarea required value={form?.values?.message} />
			<label class="hp">
				Website
				<input name="website" tabindex="-1" autocomplete="off" />
			</label>
			<button class="btn w-fit" type="submit">Send inquiry</button>
		</form>
	{/if}

	<aside class="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
		<h2 class="font-serif text-2xl">Chambers</h2>
		<dl class="mt-4 space-y-3">
			{#if data.settings.address}
				<div>
					<dt class="text-sm text-brass">Address</dt>
					<dd class="whitespace-pre-line">{data.settings.address}</dd>
				</div>
			{/if}
			{#if data.settings.phone}
				<div>
					<dt class="text-sm text-brass">Phone</dt>
					<dd>{data.settings.phone}</dd>
				</div>
			{/if}
			{#if data.settings.email}
				<div>
					<dt class="text-sm text-brass">Email</dt>
					<dd><a class="underline" href="mailto:{data.settings.email}">{data.settings.email}</a></dd>
				</div>
			{/if}
			{#if data.settings.hours}
				<div>
					<dt class="text-sm text-brass">Hours</dt>
					<dd>{data.settings.hours}</dd>
				</div>
			{/if}
		</dl>
		{#if whatsapp}
			<p class="mt-6">
				<a class="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp the chamber</a>
			</p>
		{/if}
	</aside>
</div>
