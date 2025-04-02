<script lang="ts">
	import type { UserGroup } from '../../routes/user_group/+page.server';
	import SimpleButton from '../button/SimpleButton.svelte';

	export let groupData: UserGroup[];
</script>
<section class="container px-4 mx-auto">
	<h2 class="text-lg font-medium text-gray-800 dark:text-white">User Group</h2>

	<div class="flex flex-col mt-6">
		<div class="flex justify-end">
			<SimpleButton content="Add Group"/>
			<SimpleButton content="Delete Group" type="delete"/>
		</div>
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">

					<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead class="bg-gray-50 dark:bg-gray-800">
						<tr>

							<th scope="col"
									class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
								Group Id
							</th>

							<th scope="col"
									class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
								Group Name
							</th>

							<th scope="col" class="relative py-3.5 px-4">
								<span class="sr-only">Edit</span>
							</th>
						</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
						<tr>
							{#each groupData as group (group.id)}

								<td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
									<div
										class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
										{group.id}
									</div>
								</td>
								<td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
									<div>
										<h2 class="font-medium text-gray-800 dark:text-white ">{group.group_name}</h2>
										<p class="text-sm font-normal text-gray-600 dark:text-gray-400">Description</p>
									</div>
								</td>

								<td class="px-4 py-4 text-sm whitespace-nowrap">
									<button
										aria-label="Edit"
										class="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
												 stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round"
														d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
										</svg>
									</button>
								</td>
							{/each}
						</tr>

						</tbody>
					</table>

				</div>
			</div>
		</div>
	</div>

	<div class="flex items-center justify-between mt-6">
		<a href=""
			 class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
					 class="w-5 h-5 rtl:-scale-x-100">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
			</svg>

			<span>
                previous
            </span>
		</a>

		<div class="items-center hidden md:flex gap-x-3">
			<a href="" class="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">1</a>
		</div>

		<a href=""
			 class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>
                Next
            </span>

			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
					 class="w-5 h-5 rtl:-scale-x-100">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
			</svg>
		</a>
	</div>
</section>