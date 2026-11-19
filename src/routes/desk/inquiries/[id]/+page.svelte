<script lang="ts">
	import { page } from '$app/state';
	import { formatDate } from '#lib/text.ts';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.inquiry.subject} · Inquiries</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/desk/inquiries">Inquiries</a></p>
<h1 class="mt-3 font-serif text-4xl">{data.inquiry.subject}</h1>
<p class="mt-2 text-ink-soft">{data.inquiry.name} · {formatDate(data.inquiry.createdAt)}</p>
<dl class="mt-4 space-y-1">
	{#if data.inquiry.phone}<div>Phone: {data.inquiry.phone}</div>{/if}
	{#if data.inquiry.email}<div>Email: {data.inquiry.email}</div>{/if}
</dl>
<p class="mt-6 max-w-2xl whitespace-pre-line text-lg">{data.inquiry.message}</p>

<form class="mt-8 flex flex-wrap items-end gap-3" method="post">
	<Notice message={form?.message} />
	{#if page.url.searchParams.get('saved') === '1'}
		<p class="text-brass" role="status">Status saved.</p>
	{/if}
	<label>
		<span class="mb-1 block text-sm font-semibold">Status</span>
		<select class="field" name="status">
			{#each ['new', 'reviewed', 'closed'] as status (status)}
				<option value={status} selected={data.inquiry.status === status}>{status}</option>
			{/each}
		</select>
	</label>
	<button class="btn" type="submit">Save status</button>
</form>
