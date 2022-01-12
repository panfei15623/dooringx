/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:22:51
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-05 14:53:12
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\functionMap\index.ts
 */
import { FunctionCenterType } from 'dooringx-lib/dist/core/functionCenter';

export const functionMap: FunctionCenterType = {
	上下文转对象: {
		// 函数内容
		fn: (ctx, next, _config, args) => {
			const arr = args['_sk'];
			const key = args['_r'];
			const param: Record<string, any> = {};
			arr.forEach((v: string) => {
				param[v] = ctx[v];
			});
			ctx[key] = param;
			console.log(ctx);
			next();
		},
		// 配置项，数组里每个配置会显示出来让用户去配置
		config: [
			{
				name: '输入要获取的上下文', // 展示名字
				data: ['ctx'], // 代表数据去哪里获取
				options: {
					receive: '_sk', // 表示会从 args 哪个键上获取该值
					multi: true, // 是否允许多个选项配置
				},
			},
			{
				name: '输入要生成的上下文',
				data: ['ctx'],
				options: {
					receive: '_r',
					multi: false,
				},
			},
		],
		name: '上下文转对象', // 展示名字
	},
};
