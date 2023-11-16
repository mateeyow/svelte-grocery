<script lang="ts">
	import type { Grocery } from '$lib/stores/groceries';
	import { createGroceryStore, groceries } from '$lib/stores/groceries';
	import GroceryActions from '$lib/components/groceryActions.svelte';
	import { SvelteComponent, onMount, tick } from 'svelte';
	import GroceryInput from '$lib/components/groceryInput.svelte';

	export let grocery: Grocery;

	let inputEl: SvelteComponent;
	let childStore: typeof groceries;

	const onAddChild = async () => {
		groceries.addChild(grocery.item);
		await tick();
		if (inputEl) {
			inputEl.focus();
		}
	};

	onMount(() => {
		childStore = createGroceryStore();
	});
</script>

<li>
	<div class="flex items-center text-xl">
		<GroceryInput {...grocery} />
		<GroceryActions {onAddChild} onRemoveGrocery={() => groceries.remove(grocery.item)} />
	</div>
	<ul class="mx-9">
		{#each grocery.groceries as child}
			<li>
				<div class="flex items-center text-xl">
					<GroceryInput bind:this={inputEl} {...child} />
					<GroceryActions onRemoveGrocery={() => console.log('remove')} />
				</div>
			</li>
		{/each}
	</ul>
</li>
