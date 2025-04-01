import axios from '$lib/axios';
import type { PageLoad } from '../../../.svelte-kit/types/src/routes/user_group/$types';

export const load: PageLoad = async () => {
	try {
		const response = await axios.get('http://localhost:8080/user_groups');

		if (response.status === 200) {
			return {
				userGroups: response.data
			};
		} else {
			return {
				error: 'Failed to load user group'
			};
		}
	} catch (error) {
		console.error('Error occurred while fetching user groups:', error);
		return {
			error: 'An error occurred while fetching data'
		};
	}
};
