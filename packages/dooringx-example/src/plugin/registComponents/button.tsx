/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:35:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-05 15:10:31
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\registComponents\button.tsx
 */

import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
	changeUserValue,
	ComponentItemFactory,
	createPannelOptions,
	useDynamicAddEventCenter,
} from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';

function ButtonTemp(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	const eventCenter = useMemo(() => {
		return pr.config.getEventCenter();
	}, [pr.config]);

	/**
	 * param1：render 的四个参数组成的对象
	 * param2：注册的时机名，必须跟 id 相关，否则多个组件可能导致名称冲突
	 * param3：时机描述
	 */
	useDynamicAddEventCenter(pr, `${pr.data.id}-init`, '初始渲染时机'); //注册名必须带id 约定！
	useDynamicAddEventCenter(pr, `${pr.data.id}-click`, '点击执行时机');
	useEffect(() => {
		// 模拟抛出事件
		if (pr.context === 'preview') {
			eventCenter.runEventQueue(`${pr.data.id}-init`, pr.config);
		}
	}, [eventCenter, pr.config, pr.context, pr.data.id]);

	const [text, setText] = useState('');
	const op1 = props.op1;
	useEffect(() => {
		let unregist = () => {};
		if (op1) {
			const functionCenter = eventCenter.getFunctionCenter();
			unregist = functionCenter.register(
				`${pr.data.id}+changeText`,
				async (ctx, next, config, args: any, _eventList, iname) => {
					const userSelect = iname.data;
					const ctxVal = changeUserValue(
						userSelect['改变文本数据源'],
						args,
						'_changeval',
						config,
						ctx
					);
					const text = ctxVal[0];
					setText(text);
					next();
				},
				[
					{
						name: '改变文本数据源',
						data: ['ctx', 'input', 'dataSource'],
						options: {
							receive: '_changeval',
							multi: false,
						},
					},
				],
				`${pr.data.id}+改变文本函数`
			);
		}
		return () => {
			unregist();
		};
	}, [op1]);

	return (
		<Button
			style={{
				width: pr.data.width ? pr.data.width : props.sizeData[0],
				height: pr.data.height ? pr.data.height : props.sizeData[1],
				borderRadius: props.borderRadius + 'px',
				border: `${props.borderData.borderWidth}px ${props.borderData.borderStyle} ${props.borderData.borderColor}`,
				backgroundColor: props.backgroundColor,
				color: props.fontData.color,
				fontSize: props.fontData.fontSize,
				fontWeight: props.fontData.fontWeight,
				fontStyle: props.fontData.fontStyle,
				textDecoration: props.fontData.textDecoration,
				lineHeight: props.lineHeight,
			}}
			onClick={() => {
				eventCenter.runEventQueue(`${pr.data.id}-click`, pr.config);
			}}
		>
			{text ? text : props.text}
		</Button>
	);
}

// 组件需要导出一个由ComponentItemFactory生成的对象
const MButton = new ComponentItemFactory(
	'button', // name：组件注册名
	'按钮', // display：展示
	// props：右侧面板的配置项，键为右侧面板分类，值为配置项
	{
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '文字',
			}),
		],
		fn: [
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '改变文本函数',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	// initData：配置组件初始值
	{
		props: {
			text: 'yehuozhili',
			sizeData: [100, 30],
			backgroundColor: 'rgba(0,132,255,1)',
			lineHeight: 1,
			borderRadius: 0,
			op1: false,
			borderData: {
				borderWidth: 0,
				borderColor: 'rgba(0,0,0,1)',
				borderStyle: 'solid',
			},
			fontData: {
				fontSize: 14,
				textDecoration: 'none',
				fontStyle: 'normal',
				color: 'rgba(255,255,255,1)',
				fontWeight: 'normal',
			},
		},
		width: 100, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		height: 30, // 绝对定位元素初始必须有宽高，否则适配会有问题。
		rotate: {
			canRotate: true,
			value: 0,
		},
		canDrag: true, // false就不能拖
	},
	/**
	 * render
	 * @param data
	 * @param context 一般只有preview和edit，用来进行环境判断
	 * @param store
	 * @param config 可以拿到所有数据，用来制作事件时使用
	 * @returns
	 */
	(data, context, store, config) => {
		return <ButtonTemp data={data} store={store} context={context} config={config}></ButtonTemp>;
	},
	// resize 判断是否能缩放
	true
);

export default MButton;
