<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.person.name} · Team</title>
</svelte:head>

<p class="text-sm"><a class="text-brass underline" href="/desk/team">Team</a></p>
<h1 class="mt-3 font-serif text-4xl">{data.person.name}</h1>
{#if data.saved}<p class="mt-3 text-brass" role="status">Saved.</p>{/if}
<Notice message={form?.message} />

<form class="mt-6 grid max-w-2xl gap-4" method="post" action="?/save" enctype="multipart/form-data">
	<Field label="Name" name="name" required value={data.person.name} />
	<Field label="Role" name="roleTitle" required value={data.person.roleTitle} />
	<Field label="Biography" name="bio" textarea rows={6} value={data.person.bio} />
	<Field label="Courts" name="courts" value={data.person.courts} />
	<Field label="Education" name="education" value={data.person.education} />
	<Field label="Sort order" name="sortOrder" type="number" value={data.person.sortOrder} />
	<label class="flex items-center gap-2">
		<input type="checkbox" name="isPrincipal" checked={data.person.isPrincipal} />
		<span>Principal, shown on the About page</span>
	</label>
	<label>
		<span class="mb-1.5 block text-sm font-semibold text-ink-soft">Portrait</span>
		<input class="field" name="photo" type="file" accept=".png,.jpg,.jpeg,.webp" />
	</label>
	{#if data.person.photoStoredName}
		<img class="h-24 w-24 object-cover" src="/portraits/{data.person.id}" alt="" width="96" height="96" />
	{/if}
	<button class="btn w-fit" type="submit">Save</button>
</form>
<form class="mt-4" method="post" action="?/remove">
	<button class="btn btn-line" type="submit">Remove from team</button>
</form>
