<script lang="ts">
	import { enhance } from '$app/forms';

	let groupName = '';
	let isSubmitting = false;

	const formEl = (form: HTMLFormElement) => {
		enhance(form, async ({ cancel }) => {
			if (!groupName.trim()) {
				console.log('Group name can\'t be empty');
				return cancel();
			}
			isSubmitting = true;
			return async ({ result }) => {
				await new Promise(resolve => setTimeout(resolve, 1000));
				isSubmitting = false;
				if (result.type === 'success') {
					console.log('Successfully submitted');
					groupName = '';
				} else {
					console.log('Error submitting');
				}
			};
		});
	};
</script>

<section class="mt-6 max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 ">
	<h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">Account settings</h2>

	<form use:formEl method="POST">
		<div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
			<div>
				<label class="text-gray-700 dark:text-gray-200" for="group_name">Group Name</label>
				<input id="group_name"
							 type="text"
							 name="groupName"
							 bind:value={groupName}
							 class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
			</div>
		</div>

		<div class="flex justify-end mt-6">
			<button
				class="transition-all justify-center {isSubmitting?'w-30':'w-20'} flex cursor-pointer px-8 py-2.5 leading-5 text-white duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
				Save
				<svg class="size-5 ml-1 {isSubmitting?'animate-spin':'hidden '} text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
						 viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</button>
		</div>
	</form>
</section>
