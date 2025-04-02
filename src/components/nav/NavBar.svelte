<script lang="ts">
	import { page } from '$app/state';


	const nav = [
		{ name: 'Home', url: '/' },
		{ name: 'UserGroup', url: '/user_group' }
	];
</script>

<nav class="w-full bg-white shadow dark:bg-gray-800">
	<div class="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
		{#each nav as n (n.name)}
			<a href={n.url}
				 class="border-b-2  hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 {page.url.pathname===n.url?'border-blue-500':'border-transparent'} hover:border-blue-500 mx-1.5 sm:mx-6">{n.name}</a>
		{/each}
	</div>
</nav>