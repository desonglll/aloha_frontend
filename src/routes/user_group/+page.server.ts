import axios from '$lib/axios';

export interface UserGroup {
	id: string;
	group_name: string;
}

export const load = async () => {
	try {
		const response = await axios.get('http://localhost:8080/user_groups');

		if (response.status === 200) {
			return {
				userGroups: response.data as UserGroup[],
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
