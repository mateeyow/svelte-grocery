<script lang="ts">
	import { groceries as groceryStore } from '$lib/stores/groceries';

	export let purchased: boolean;
	export let item: string;
	export let id: string;
	export let childId: string = '';

	export function focus() {
		inputEl.focus();
	}

	export function changeState() {
		groceryStore.changeState(id, childId);
	}

	let inputEl: HTMLInputElement;

	function onKeydown(this: HTMLSpanElement, evt: KeyboardEvent) {
		if (evt.key === 'Enter' || evt.key === 'Tab') {
			evt.preventDefault();
			this.blur();
		}
	}

	function onBlur(this: HTMLInputElement) {
		const { value } = this;

		if (!value) {
			groceryStore.remove(id, childId);
			return;
		}

		groceryStore.addOrRename(value, id, childId);
	}
</script>

<input type="checkbox" checked={purchased} on:change={changeState} class="w-6 h-6" />
<input
	type="text"
	bind:value={item}
	on:keydown={onKeydown}
	on:blur={onBlur}
	class="text-slate-800 mx-4 my-2 disabled:bg-transparent focus:border-slate-800 focus-visible:outline-slate-400 py-2 ps-1"
	class:line-through={purchased}
	class:text-slate-400={purchased}
	disabled={purchased}
	bind:this={inputEl}
/>

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
