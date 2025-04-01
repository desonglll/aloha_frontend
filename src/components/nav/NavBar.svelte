<script lang="ts">
	import { goto } from '$app/navigation';

	const nav = [
		{ name: 'Home', url: '/' },
		{ name: 'UserGroup', url: '/user_group' }
	];
</script>
<div class="w-full">
	<nav class="px-3 py-3 bg-amber-100">
		{#each nav as item (item.name)}
			<button
				class="max-w-max px-3 py-1 mx-2 bg-amber-300 rounded-md hover:bg-amber-500 transform transition-colors cursor-pointer"
				on:click={() => goto(item.url)}>
				{item.name}
			</button>
		{/each}
	</nav>
</div>