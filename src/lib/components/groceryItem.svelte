<script lang="ts">
	import type { Grocery } from '$lib/stores/groceries';
	import { groceries } from '$lib/stores/groceries';
	import GroceryActions from '$lib/components/groceryActions.svelte';
	import GroceryInput from '$lib/components/groceryInput.svelte';
	import { tick, type SvelteComponent } from 'svelte';

	export let grocery: Grocery;

	let inputEl: SvelteComponent;

	const onAddChild = async () => {
		groceries.addChild(grocery.id);

		await tick();
		inputEl.focus();
	};
</script>

<li>
	<div class="flex items-center text-xl">
		<GroceryInput {...grocery} />
		<GroceryActions {onAddChild} id={grocery.id} />
	</div>
	<ul class="mx-9">
		{#each [...grocery.groceries] as [_, childGrocery]}
			<li>
				<div class="flex items-center text-xl">
					<GroceryInput
						bind:this={inputEl}
						{...childGrocery}
						id={grocery.id}
						childId={childGrocery.id}
					/>
					<GroceryActions childId={childGrocery.id} id={grocery.id} />
				</div>
			</li>
		{/each}
	</ul>
</li>
