<script lang="ts">
	export let content: string;
	export let type: string = 'simple';
</script>

<button
	class="mx-2 my-2 cursor-pointer px-6 py-2 font-medium tracking-wide text-white bg-blue-600 hover:bg-blue-500 capitalize transition-colors duration-300 transform rounded-lg
	{type === 'delete' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}">
	{content}
</button>
