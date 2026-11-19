<script lang="ts">
	import { page } from '$app/state';
</script>

<h1 class="font-serif text-4xl">{page.status}</h1>
<p class="mt-3 text-lg text-ink-soft">{page.error?.message ?? 'Something went wrong.'}</p>
<p class="mt-6"><a class="btn" href="/">Back to the chamber</a></p>
