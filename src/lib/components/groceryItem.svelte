<script lang="ts">
	import type { Grocery } from '$lib/stores/groceries';
	import { groceries } from '$lib/stores/groceries';
	import IconButton from '$lib/components/iconButton.svelte';

	export let grocery: Grocery;
</script>

<li>
	<input
		type="checkbox"
		checked={grocery.purchased}
		on:change={() => groceries.changeState(grocery.item)}
	/>
	{grocery.item}
	<!-- <IconButton icon="bx:plus" /> -->
	<IconButton icon="bx:trash" on:click={() => groceries.remove(grocery.item)} />
</li>
