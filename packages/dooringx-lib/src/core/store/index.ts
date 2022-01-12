/*
 * @Author: yehuozhili
 * @Date: 2021-03-14 04:29:09
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-16 11:18:41
 * @FilePath: \dooringx\packages\dooringx-lib\src\core\store\index.ts
 */
import { IStoreData } from './storetype';
import { storeChangerState } from '../storeChanger/state';

export const initialData: IStoreData = {
	container: { // 画布的尺寸
		width: 375,
		height: 667,
	},
	block: [],
	modalMap: {},
	dataSource: {},
	globalState: {},
	modalConfig: {},
};

class Store {
	static instance: Store;
	constructor(
		public storeDataList: IStoreData[] = [initialData],
		public listeners: Array<Function> = [],
		public current: number = 0,
		public forceupdate: Function = () => {}
	) {}

	getData() {
		return this.storeDataList[this.current];
	}
	getStoreList() {
		return this.storeDataList;
	}

	getListeners() {
		return this.listeners;
	}

	getIndex() {
		return this.current;
	}
	/**
	 *
	 * 重置需要注册事件
	 * @param {IStoreData[]} initData
	 * @param {boolean} [check=false] 检查编辑弹窗状态
	 * @memberof Store
	 */
	resetToInitData(initData: IStoreData[], check = false) {
		this.storeDataList = initData;
		this.current = 0;
		//如果是编辑模式，需要修改
		if (storeChangerState.modalEditName !== '' && check) {
			storeChangerState.modalEditName = '';
		}
		this.emit(); // 执行监听函数
	}
	/**
	 *
	 * 注意重置需要注册事件
	 * @param {IStoreData[]} initData
	 * @param {number} current
	 * @param {boolean} [check=false]
	 * @memberof Store
	 */
	resetToCustomData(initData: IStoreData[], current: number, check = false) {
		this.storeDataList = initData;
		this.current = current;
		//如果是编辑模式，需要修改
		if (storeChangerState.modalEditName !== '' && check) {
			storeChangerState.modalEditName = '';
		}
		this.emit();
	}
	resetListeners() {
		this.listeners = [];
	}

	replaceList(list: IStoreData[]) {
		this.storeDataList = list;
	}

	setForceUpdate(fn: Function) {
		this.forceupdate = fn;
	}
	forceUpdate() {
		this.forceupdate();
	}

	setIndex(num: number) {
		this.current = num;
	}

	redo() {
		const maxLength = this.storeDataList.length;
		if (this.current + 1 < maxLength) {
			this.current = this.current + 1;
			this.emit();
		}
	}

	undo() {
		if (this.current > 0) {
			this.current = this.current - 1;
			this.emit();
		}
	}

	cleanRedundant(index: number) {
		this.storeDataList = this.storeDataList.slice(0, index + 1);
	}

	setData(data: IStoreData) {
		// 如果current不是最后那个，说明后面的被undo过的，如果要新增，那么需要清除之前的
		let flag = true;
		if (this.current + 1 !== this.storeDataList.length) {
			this.cleanRedundant(this.current);
			flag = false;
		}
		this.current = this.current + 1;
		this.storeDataList[this.current] = data;
		if (flag && this.current + 1 !== this.storeDataList.length) {
			this.storeDataList.length = this.current + 1;
		}

		this.emit();
	}

	cleanLast() {
		if (this.current <= 1) {
			return;
		}
		const removeIndex = this.current - 1;
		this.storeDataList.splice(removeIndex, 1);
		this.current = this.current - 1;
	}

	emit() {
		this.listeners.forEach((fn) => {
			fn(this.getData());
		});
	}

	subscribe(listener: Function) {
		this.listeners.push(listener);
		return () => (this.listeners = this.listeners.filter((v) => v !== listener));
	}
}

export default Store;
