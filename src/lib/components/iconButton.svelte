<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let color = 'currentColor';
</script>

<button on:click>
	<Icon {icon} {color} />
</button>
