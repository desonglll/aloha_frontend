<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	console.log(data.userGroups);
</script>

<h2>User Group</h2>