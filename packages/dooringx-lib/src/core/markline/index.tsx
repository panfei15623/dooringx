/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-27 15:14:34
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\markline\index.tsx
 */
import React from 'react';
import { useMemo } from 'react';
import UserConfig from '../../config';
import { marklineCalRender } from './calcRender';

export function MarklineX(props: any) {
	return (
		<div
			className="yh-markline"
			style={{
				borderTop: '1px dotted #2196f3',
				position: 'absolute',
				width: '100%',
				top: props.top,
				display: props.display,
				zIndex: 9999,
			}}
		></div>
	);
}
export function MarklineY(props: any) {
	return (
		<div
			className="yh-markline"
			style={{
				borderLeft: '1px dotted #2196f3',
				position: 'absolute',
				height: '100%',
				left: props.left,
				display: props.display,
				zIndex: 9999,
			}}
		></div>
	);
}

export function NormalMarkLineRender(props: { config: UserConfig; iframe: boolean }) {
	const lines = marklineCalRender(props.config, props.iframe); // 画对齐线
	const render = useMemo(() => {
		return (
			<>
				{lines.x.map((v, i) => {
					return <MarklineX key={i} top={v}></MarklineX>;
				})}
				{lines.y.map((v, i) => {
					return <MarklineY key={i} left={v}></MarklineY>;
				})}
			</>
		);
	}, [lines]);
	return <>{render}</>;
}
