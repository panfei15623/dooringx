/*
 * @Author: yehuozhili
 * @Date: 2021-02-27 21:33:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-18 19:54:56
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\index.tsx
 */

import { InitConfig } from 'dooringx-lib';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';
import { ContainerOutlined, PlayCircleOutlined, HighlightOutlined } from '@ant-design/icons';
import commandModules from './commanderModules';
import { functionMap } from './functionMap';
import { Formmodules } from './formComponentModules';
import InputCo from './registComponents/inputCo';

/**
 * 左侧组件
 * 支持同步导入或者异步导入
 */
const LeftRegistMap: LeftRegistComponentMapItem[] = [
	{
		type: 'basic',
		component: 'button',
		img: 'icon-anniu',
		imgCustom: <PlayCircleOutlined />,
		displayName: '按钮',
		urlFn: () => import('./registComponents/button'), // 如果需要异步导入组件，则需要填写urlFn，需要一个返回promise的函数
	},
	{
		type: 'basic',
		component: 'input',
		img: 'icon-anniu',
		displayName: '输入框',
	},
];

export const defaultConfig: Partial<InitConfig> = {
	leftAllRegistMap: LeftRegistMap, // 左侧组件
	leftRenderListCategory: [
		// 左侧面板
		{
			type: 'basic',
			icon: <HighlightOutlined />,
			displayName: '基础',
		},
		{
			type: 'business',
			icon: <HighlightOutlined />,
			displayName: '业务组件',
		},
		{
			type: 'media',
			icon: <PlayCircleOutlined />,
			displayName: '媒体组件',
		},
		{
			type: 'xxc',
			icon: <ContainerOutlined />,
			custom: true, // 当custom为true时，可以使用customRender自定义渲染
			displayName: '自定义',
			customRender: <div>我是自定义渲染</div>,
		},
	],
	initComponentCache: {
		// 如果需要同步导入组件，则需要将组件放入配置项的initComponentCache中，这样在载入时便会注册进componentRegister里
		input: { component: InputCo },
	},
	rightRenderListCategory: [
		// 右侧面板
		{
			type: 'style',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					外观
				</div>
			),
		},
		{
			type: 'animate',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					动画
				</div>
			),
		},
		{
			type: 'fn',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					函数
				</div>
			),
		},
		{
			type: 'actions',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					事件
				</div>
			),
		},
	],
	initFunctionMap: functionMap, // 函数导入做成对象置入initFunctionMap
	initCommandModule: commandModules, // 命令对象导入到 initCommandModule
	initFormComponents: Formmodules, // 右侧组件导入，将开发的组件配成一个对象放入initFormComponents即可
};

export default defaultConfig;
