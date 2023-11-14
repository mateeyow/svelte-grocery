<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let componentClass: string = '';
	export let color = 'currentColor';
	export let title = '';
</script>

<button on:click class={componentClass} {title}>
	<Icon {icon} {color} />
</button>
