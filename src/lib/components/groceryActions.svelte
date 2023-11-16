<script lang="ts">
	import IconButton from '$lib/components/iconButton.svelte';

	export let onAddChild: null | (() => Promise<void>) = null;
	export let onRemoveGrocery: () => void;
</script>

<div class="ms-auto text-slate-500 text-2xl flex">
	{#if onAddChild}
		<IconButton
			icon="bx:plus"
			componentClass="mr-4"
			title="Add child grocery"
			on:click={onAddChild}
		/>
	{/if}
	<IconButton
		icon="bx:trash"
		on:click={onRemoveGrocery}
		color="bg-slate-300"
		title="Delete grocery"
	/>
</div>
