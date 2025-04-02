<script lang="ts">
	import type { PageProps } from './$types';
	import type { UserGroup } from './+page.server';
	import Table from '../../components/table/Table.svelte';

	let { data }: PageProps = $props();
	let userGroups: UserGroup[] = $state([]);
	if (data.userGroups) {
		userGroups = data.userGroups;
	}
	console.log(data.userGroups);
</script>

<h2>User Group</h2>



<Table groupData={userGroups} />