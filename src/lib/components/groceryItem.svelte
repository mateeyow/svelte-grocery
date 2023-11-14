<script lang="ts">
	import type { Grocery } from '$lib/stores/groceries';
	import { groceries } from '$lib/stores/groceries';
	import IconButton from '$lib/components/iconButton.svelte';

	export let grocery: Grocery;

	function onKeydown(this: HTMLSpanElement, evt: KeyboardEvent) {
		if (evt.key === 'Enter' || evt.key === 'Tab') {
			evt.preventDefault();
			this.blur();
		}
	}

	function onBlur(this: HTMLInputElement) {
		const { value } = this;

		if (!value) {
			groceries.remove(grocery.item);
		}

		groceries.rename(value, grocery.item);
	}

	const onAddChild = () => {
		console.log('new child');
	};
</script>

<li class="flex items-center text-xl">
	<input
		type="checkbox"
		checked={grocery.purchased}
		on:change={() => groceries.changeState(grocery.item)}
		class="w-6 h-6"
	/>
	<input
		type="text"
		value={grocery.item}
		on:keydown={onKeydown}
		on:blur={onBlur}
		class="text-slate-800 mx-4 my-2 disabled:bg-transparent focus:border-slate-800 focus-visible:outline-slate-400 py-2 ps-1"
		class:line-through={grocery.purchased}
		class:text-slate-400={grocery.purchased}
		disabled={grocery.purchased}
	/>
	<div class="ms-auto text-slate-500 text-2xl flex">
		<IconButton
			icon="bx:plus"
			componentClass="mr-4"
			title="Add child grocery"
			on:click={onAddChild}
		/>
		<IconButton
			icon="bx:trash"
			on:click={() => groceries.remove(grocery.item)}
			color="bg-slate-300"
			title="Delete grocery"
		/>
	</div>
</li>

<style lang="postcss">
	input[type='checkbox'] {
		--checkbox-color: rgb(148 163 184);
		-webkit-appearance: none;
		appearance: none;
		font: inherit;
		color: currentColor;
		border: 0.15em solid currentColor;
		border-radius: 0.15em;
		transform: translateY(-0.075em);
		display: grid;
		place-content: center;
	}

	input[type='checkbox']::before {
		content: '';
		width: 0.65em;
		height: 0.65em;
		transform: scale(0);
		transition: 120ms transform ease-in-out;
		box-shadow: inset 1em 1em var(--checkbox-color);
		transform-origin: bottom left;
		clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
	}

	input[type='checkbox']:checked::before {
		transform: scale(1);
	}

	input[type='checkbox']:focus {
		outline: max(1px, 0.1em) solid var(--checkbox-color);
		outline-offset: max(1px, 0.15em);
	}
</style>
