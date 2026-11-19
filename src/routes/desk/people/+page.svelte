<script lang="ts">
	import Field from '#lib/components/Field.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import { formatDate } from '#lib/text.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	function noteFor(userId: string) {
		return data.requests.find((request) => request.userId === userId)?.note ?? '';
	}
</script>

<svelte:head>
	<title>People · Desk</title>
</svelte:head>

<h1 class="font-serif text-4xl">People</h1>
<p class="mt-3 max-w-2xl text-ink-soft">Approve a request before that person can sign in. New public requests stay off until you approve them.</p>
<Notice message={form?.message} />

<ul class="mt-8 space-y-6">
	{#each data.people as person (person.id)}
		<li class="border border-line bg-card p-4">
			<p class="font-serif text-2xl">{person.name}</p>
			<p class="text-sm text-ink-soft">{person.email} · joined {formatDate(person.createdAt)}</p>
			{#if noteFor(person.id)}
				<p class="mt-2 whitespace-pre-line text-ink-soft">Request: {noteFor(person.id)}</p>
			{/if}
			<form class="mt-4 flex flex-wrap items-end gap-3" method="post" action="?/updateUser">
				<input type="hidden" name="userId" value={person.id} />
				<label>
					<span class="mb-1 block text-sm font-semibold">Role</span>
					<select class="field" name="role">
						{#each ['member', 'staff', 'admin'] as role (role)}
							<option value={role} selected={person.role === role}>{role}</option>
						{/each}
					</select>
				</label>
				<label class="flex items-center gap-2 pb-2">
					<input type="checkbox" name="approved" checked={person.approved} />
					<span>Approved</span>
				</label>
				<button class="btn btn-small" type="submit">Save</button>
			</form>
		</li>
	{/each}
</ul>

<form class="mt-10 grid max-w-xl gap-4 border border-line p-5" method="post" action="?/create">
	<h2 class="font-serif text-2xl">Create an account</h2>
	<Field label="Name" name="name" required />
	<Field label="Email" name="email" type="email" required />
	<Field label="Password" name="password" type="password" required />
	<label>
		<span class="mb-1.5 block text-sm font-semibold">Role</span>
		<select class="field" name="role">
			<option value="member">member</option>
			<option value="staff">staff</option>
			<option value="admin">admin</option>
		</select>
	</label>
	<label class="flex items-center gap-2">
		<input type="checkbox" name="approved" checked />
		<span>Approved, so they can sign in now</span>
	</label>
	<button class="btn w-fit" type="submit">Create account</button>
</form>
