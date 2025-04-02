import type { Actions } from '@sveltejs/kit';
import axios from 'axios';
import type { UserGroup } from '../+page.server';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const groupName = formData.get('groupName');

		if (!groupName || typeof groupName !== 'string' || !groupName.trim()) {
			return {
				type: 'failure',
				error: '用户组名称不能为空'
			};
		}

		try {
			await axios
				.post(
					'user_group',
					{
						group_name: groupName
					},
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}
				)
				.then((r) => {
					if (r.status === 200) {
						return {
							type: 'success',
							data: r.data as UserGroup
						};
					} else {
						return {
							type: 'error',
							data: []
						};
					}
				});
		} catch (error) {
			console.error('创建用户组错误:', error);
			return {
				type: 'failure',
				error: error instanceof Error ? error.message : '处理请求时发生错误'
			};
		}
	}
};
