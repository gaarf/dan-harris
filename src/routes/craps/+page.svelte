<script lang="ts">
	import { Craps } from '$lib/Craps';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { used } from 'svelte-preprocess-react';

  used(Craps);

	const cash = localStorageStore('cash', 500);

	function handleCashChange(amount: number) {
		cash.set(amount);
	}
</script>

<div class="mx-auto container mt-4">
		<react:Craps initialCash={$cash} onCashChange={handleCashChange} />
</div>

