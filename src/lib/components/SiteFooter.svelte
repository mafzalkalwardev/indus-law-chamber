<script lang="ts">
	let {
		settings
	}: {
		settings: {
			chamberName: string;
			address: string;
			phone: string;
			email: string;
			hours: string;
		};
	} = $props();
</script>

<footer class="mt-20 bg-ink text-paper">
	<div class="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
		<div>
			<p class="font-serif text-2xl">{settings.chamberName}</p>
			<p class="mt-3 max-w-xs text-paper/80">Counsel for clients of the chamber, and a private library of its own notes.</p>
		</div>
		<div>
			<p class="text-xs tracking-[0.16em] text-brass-bright uppercase">Chambers</p>
			{#if settings.address}
				<p class="mt-3 whitespace-pre-line">{settings.address}</p>
			{:else}
				<p class="mt-3 text-paper/70">Address to be added by the chamber.</p>
			{/if}
			{#if settings.hours}
				<p class="mt-3 text-paper/80">{settings.hours}</p>
			{/if}
		</div>
		<div>
			<p class="text-xs tracking-[0.16em] text-brass-bright uppercase">Contact</p>
			<ul class="mt-3 space-y-1">
				{#if settings.phone}<li>{settings.phone}</li>{/if}
				{#if settings.email}<li><a class="underline decoration-brass-bright" href="mailto:{settings.email}">{settings.email}</a></li>{/if}
				<li><a class="underline decoration-brass-bright" href="/contact">Write to the chamber</a></li>
			</ul>
		</div>
	</div>
</footer>
