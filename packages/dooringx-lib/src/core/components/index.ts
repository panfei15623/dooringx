/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-10 18:34:34
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\components\index.ts
 */
import { ComponentItem } from './componentItem';

/**
 *
 * 注册组件需要异步的，由注册时效果决定。
 * 主要是存放所有已注册组件。可以在其render时提供对应context
 * @class ComponentRegister
 */
class ComponentRegister {
	constructor(
		public componentMap: Record<string, ComponentItem> = {},
		public componentList: ComponentItem[] = [],
		public listener: Function[] = [],
		public eventMap: Record<string, Function[]> = {}
	) {}
	getMap() {
		return this.componentMap;
	}
	getList() {
		return this.componentList;
	}
	getComp(name: string) {
		return this.componentMap[name];
	}

	subscribe(fn: Function) {
		this.listener.push(fn);
		return () => this.listener.filter((v) => v !== fn);
	}

	emit() {
		this.listener.forEach((v) => v());
	}

	on(event: string, fn: Function) {
		if (!this.eventMap[event]) {
			this.eventMap[event] = [];
		}
		this.eventMap[event].push(fn);
		return () => this.eventMap[event].filter((v) => v !== fn);
	}
	emitEvent(event: string) {
		if (!this.eventMap[event]) {
			return;
		}

    // 执行该组件对应的事件? todo
		this.eventMap[event].forEach((v) => v());
	}

	register(item: ComponentItem) {
		if (this.componentMap[item.name]) {
			// console.error(`${item.name} component has registed`);
			return;
		}

    // 将 initComponentCache 中的组件存入componentMap，格式： { [name]: component }
		this.componentMap[item.name] = item;
		this.componentList.push(item); // 将 component 存入 componentList
		this.emit(); // 触发监听函数
		item.init(); // 初始化组件，目前没做处理
	}

	unRegister(name: string) {
		if (!this.componentMap[name]) {
			console.error(`${name} component not found`);
			return;
		}
		const item = this.componentMap[name];
		item.destroy();
		this.emit();
		this.componentList = this.componentList.filter((v) => v !== item);
		delete this.componentMap[item.name];
	}
}
export default ComponentRegister;
