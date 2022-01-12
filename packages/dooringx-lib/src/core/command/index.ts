/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 14:52:28
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\command\index.ts
 */
import UserConfig from '../../config';
import Store from '../store';
import { CommanderItem } from './commanderType';
import { keycodeFilter } from './keycode';

class CommanderWrapper {
	constructor(
		public store: Store,
		public commandMap: Record<string, CommanderItem> = {},
		public config: UserConfig
	) {}
	getList() {
		return this.commandMap;
	}
	register(item: CommanderItem) {
		item.init(); // 暂时什么都没做
		if (this.commandMap[item.name]) {
			// console.error(`${item.name} commander has registed`);
			return;
		}
		this.commandMap[item.name] = item; // 存储在 commandMap 中
		//注册快捷键，快捷键执行调用excute
		const remove = this.registerKeyBoard(item);
		
    //改写销毁方法
		const origindestroy = item.destroy;
		const newdestroy = () => {
			remove(); // 销毁快捷键监听事件
			origindestroy();
		};
		item.destroy = newdestroy;
	}

	registerKeyBoard(current: CommanderItem) {
    // 没设置快捷键，不做任何操作
		if (current.keyboard.length === 0) {
			return () => {};
		}

		const onKeydown = (e: KeyboardEvent) => {
			if (document.activeElement !== document.body && e.target !== document.body) {
				return;
			}
			const { shiftKey, altKey, ctrlKey, metaKey, key } = e;
			const keyString: string[] = [];
			if (ctrlKey || metaKey) keyString.push('Control');
			if (shiftKey) keyString.push('Shift');
			if (altKey) keyString.push('Alt');
			if (key !== 'Control' && key !== 'Shift' && key !== 'Alt') {
				const res = keycodeFilter(key);
				if (res !== undefined) {
					keyString.push(res);
				} else {
					keyString.push(key);
				}
			}
			const keyname = keyString.join('+');
			if (current.keyboard === keyname) {
				current.excute(this.store, this.config);
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	}

	unRegister(name: string) {
		if (!this.commandMap[name]) {
			console.error(`${name} commander not found`);
			return;
		}
		const item = this.commandMap[name];
		item.destroy();
		delete this.commandMap[item.name];
	}
	exec(name: string, options?: any) {
		if (!this.commandMap[name]) {
			console.error(`${name} commander not found`);
			return;
		}
		this.commandMap[name].excute(this.store, this.config, options);
	}
}
export default CommanderWrapper;
