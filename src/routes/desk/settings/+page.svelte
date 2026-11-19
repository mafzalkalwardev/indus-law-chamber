<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Settings · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">Settings</h1>
<p class="mt-3 max-w-2xl text-ink-soft">
	Leave phone, WhatsApp, email, and address blank until the chamber supplies them. WhatsApp buttons stay hidden without a number.
</p>
<Notice message={form?.message} />
<form class="mt-6 grid max-w-2xl gap-4" method="post">
	<Field label="Chamber name" name="chamberName" required value={data.current.chamberName} />
	<Field label="Principal name" name="principalName" required value={data.current.principalName} />
	<Field label="About introduction" name="aboutIntro" textarea rows={4} value={data.current.aboutIntro} />
	<Field label="Phone" name="phone" value={data.current.phone} />
	<Field label="WhatsApp number" name="whatsapp" value={data.current.whatsapp} />
	<Field label="Email" name="email" type="email" value={data.current.email} />
	<Field label="Address" name="address" textarea rows={3} value={data.current.address} />
	<Field label="Hours" name="hours" value={data.current.hours} />
	<button class="btn w-fit" type="submit">Save settings</button>
</form>
