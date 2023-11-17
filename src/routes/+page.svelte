<script lang="ts">
	import GroceryItem from '$lib/components/groceryItem.svelte';
	import { groceries, allGroceries } from '$lib/stores/groceries';
	import { chosenFilter, filters } from '$lib/stores/filter';

	let value = '';

	const onEnter = (evt: KeyboardEvent) => {
		if (evt.key === 'Enter') {
			groceries.addOrRename(value);
			value = '';
		}
	};
</script>

<svelte:head>
	<title>Grocery List</title>
</svelte:head>

<div class="w-full p-2 m-4 md:p-4 md:m-10 flex flex-col items-center">
	<div class="w-full md:w-9/12 flex flex-col">
		<label class="relative w-full">
			<input
				type="text"
				bind:value
				placeholder="Please enter your grocery item"
				class="h-20 w-full text-2xl text-slate-500 p-4 rounded-md border border-slate-500"
				on:keydown={onEnter}
			/>
		</label>
		<div class="flex mt-1">
			{#each filters as filter}
				<label
					class="capitalize text-slate-500 cursor-pointer pr-2 flex filter-label text-xs"
					class:text-slate-900={filter === $chosenFilter}
					class:font-medium={filter === $chosenFilter}
				>
					<input type="radio" name="filter" value={filter} bind:group={$chosenFilter} />
					{filter}
				</label>
			{/each}
		</div>

		<div class="mt-14 bg-white p-4 rounded-md">
			{#if $allGroceries.length === 0}
				<h3 class="text-xl text-slate-500">No groceries yet</h3>
			{/if}
			<ul>
				{#each $allGroceries as grocery (grocery.id)}
					<GroceryItem {grocery} />
				{/each}
			</ul>
		</div>
	</div>
</div>

<style lang="postcss">
	input[type='radio'] {
		-webkit-appearance: none;
		appearance: none;
		font: inherit;
		color: currentColor;
	}

	label.filter-label:not(:last-child)::after {
		--border-color: rgb(100 116 139);
		display: block;
		content: '';
		width: 1px;
		height: 100%;
		background: var(--border-color);
		margin-left: 0.5rem;
		transform: rotate(20deg);
	}
</style>
