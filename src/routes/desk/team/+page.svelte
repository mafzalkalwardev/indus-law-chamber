<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Team · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">Team</h1>
<p class="mt-3 max-w-2xl text-ink-soft">
	The principal’s biography, courts, and education are shown on the About page. Empty fields stay hidden.
</p>
<ul class="mt-6">
	{#each data.team as person (person.id)}
		<li class="border-t border-line py-4">
			<a class="hover:text-brass" href="/desk/team/{person.id}">
				<span class="font-serif text-2xl">{person.name}</span>
				<span class="mt-1 block text-ink-soft">{person.roleTitle}{person.isPrincipal ? ' · Principal' : ''}</span>
			</a>
		</li>
	{/each}
</ul>
<form class="mt-8 grid max-w-xl gap-4 border border-line bg-card p-5" method="post">
	<h2 class="font-serif text-2xl">Add a person</h2>
	<Notice message={form?.message} />
	<Field label="Name" name="name" required value={form?.name} />
	<Field label="Role" name="roleTitle" required value={form?.roleTitle} />
	<button class="btn w-fit" type="submit">Add</button>
</form>
