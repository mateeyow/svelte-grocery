<script lang="ts">
	import type { Grocery } from '$lib/stores/groceries';
	import { groceries } from '$lib/stores/groceries';
	import GroceryActions from '$lib/components/groceryActions.svelte';
	import GroceryInput from '$lib/components/groceryInput.svelte';

	export let grocery: Grocery;

	const onAddChild = async () => {
		console.log('add child');
		// groceries.addChild(grocery.item);
		// await tick();
		// if (inputEl) {
		// 	inputEl.focus();
		// }
	};
</script>

<li>
	<div class="flex items-center text-xl">
		<GroceryInput {...grocery} />
		<GroceryActions
			{onAddChild}
			onRemoveGrocery={() => groceries.remove(grocery.id)}
			id={grocery.id}
		/>
	</div>
	<!-- <ul class="mx-9">
		{#each grocery.groceries as child}
			<li>
				<div class="flex items-center text-xl">
					<GroceryInput bind:this={inputEl} {...child} />
					<GroceryActions onRemoveGrocery={() => console.log('remove')} />
				</div>
			</li>
		{/each}
	</ul> -->
</li>
