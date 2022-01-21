/*
 * @Author: yehuozhili
 * @Date: 2021-02-25 21:16:58
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-28 22:05:04
 * @FilePath: \dooringx\packages\dooringx-lib\src\config\index.tsx
 */
import React from 'react';
import { IBlockType, IStoreData } from '../core/store/storetype';
import { ComponentClass, FunctionComponent, ReactNode } from 'react';
import { ComponentItemFactory } from '../core/components/abstract';
import { marklineConfig } from '../core/markline/marklineConfig';
import { CommanderItem } from '../core/command/commanderType';
import { contextMenuState } from '../core/contextMenu';
import {
	FormComponentRegister,
	formComponentRegisterFn,
} from '../core/components/formComponentRegister';
import { deepCopy } from '../core/utils';
import { LeftRegistComponentMapItem } from '../core/crossDrag';
import { FunctionCenterType } from '../core/functionCenter';
import { EventCenter } from '../core/eventCenter';
import { DataCenter } from '../core/dataCenter';
import { createModal, unmountMap } from '../components/modalRender';
import { scaleState } from '../core/scale/state';
import { CommanderItemFactory } from '../core/command/abstract';
import MmodalMask from '../core/components/defaultFormComponents/modalMask';
import CommanderWrapper from '../core/command';
import { focusState } from '../core/focusHandler/state';
import ComponentRegister from '../core/components';
import { StoreChanger } from '../core/storeChanger';
import Store from '../core/store';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { wrapperMoveState } from '../components/wrapperMove/event';
import { wrapperMoveState as iframeWrapperMoveState } from '../components/IframeWrapperMove/event';
// 组件部分

/**
 *
 * @urlFn 组件异步加载函数
 * @component  组件默认导出
 * @export
 * @interface CacheComponentValueType
 */
export interface CacheComponentValueType {
	component?: ComponentItemFactory;
}
export type CacheComponentType = Record<string, CacheComponentValueType> | {};
export type AsyncCacheComponentType = Record<string, () => Promise<any>>;

/**
 *
 *
 * @export 左侧的图标 custom 自定义渲染
 * @interface LeftMapRenderListPropsItemCategory
 */
export interface LeftMapRenderListPropsItemCategory {
	type: string;
	icon: ReactNode;
	custom?: boolean;
	customRender?: ReactNode;
	displayName?: string;
}

/**
 *
 *
 * @export 右侧的图标配置
 * @interface RightMapRenderListPropsItemCategory
 */
export interface RightMapRenderListPropsItemCategory {
	type: string;
	icon: ReactNode;
	custom?: boolean;
	customRender?: (type: string, current: IBlockType) => ReactNode;
}

// 设置部分
export interface InitConfig {
	/**
	 * 初始化store
	 * @type {IStoreData[]}
	 * @memberof InitConfig
	 */
	initStoreData: IStoreData[];

	/**
	 *  左边tab页组件渲染包括异步路径  { type: 'basic', component: 'button', img: 'http://xxxx/1.jpg' ,url:'' },
	 * @memberof InitConfig
	 */
	leftAllRegistMap: LeftRegistComponentMapItem[];
	/**
	 * 左边tab页图标配置
	 * type icon custom customRender
	 * @memberof InitConfig
	 */
	leftRenderListCategory: LeftMapRenderListPropsItemCategory[];
	/**
	 * 右边tab页图标配置
	 * type icon custom customRender
	 * @memberof InitConfig
	 */
	rightRenderListCategory: RightMapRenderListPropsItemCategory[];

	/**
	 *
	 * 右侧全局自定义
	 * @memberof InitConfig
	 */
	rightGlobalCustom: ((config: UserConfig) => ReactNode) | null | undefined;

	/**
	 * 组件加载缓存判定，用来设置不异步加载的组件
	 * @memberof InitConfig
	 */
	initComponentCache: CacheComponentType;

	/**
	 *
	 * 内置函数配置
	 * @memberof InitConfig
	 */
	initFunctionMap: FunctionCenterType;

	/**
	 *
	 * 内置数据中心配置数据
	 * @memberof InitConfig
	 */
	initDataCenterMap: Record<string, any>;

	/**
	 *
	 * commander 指令集合
	 * @type {Array<CommanderItemFactory>}
	 * @memberof InitConfig
	 */
	initCommandModule: Array<CommanderItemFactory>;

	/**
	 *
	 *  右侧配置项
	 * @type {(Record<
	 *   string,
	 *   FunctionComponent<any> | ComponentClass<any, any>
	 * >)}
	 * @memberof InitConfig
	 */
	initFormComponents: Record<string, FunctionComponent<any> | ComponentClass<any, any>>;

	/**
	 *
	 * 容器拉伸图标
	 * @type {ReactNode}
	 * @memberof InitConfig
	 */
	containerIcon: ReactNode;
}

export const defaultStore: IStoreData = {
	container: {
		width: 375,
		height: 667,
	},
	block: [],
	modalMap: {},
	dataSource: {
		defaultKey: 'defaultValue',
	},
	globalState: {
		containerColor: 'rgba(255,255,255,1)',
		title: 'dooring',
		bodyColor: 'rgba(255,255,255,1)',
		script: [],
	},
	modalConfig: {},
};

export const defaultConfig: InitConfig = {
	initStoreData: [defaultStore],
	leftAllRegistMap: [],
	leftRenderListCategory: [],
	rightGlobalCustom: null,
	rightRenderListCategory: [],
	initComponentCache: {
		modalMask: { component: MmodalMask }, // 这个组件不配置显示
	},
	initFunctionMap: {
		打开弹窗函数: {
			fn: (_ctx, next, config, args) => {
				const modalName = args['_modal']; // 配置的弹窗名称
				const storeData = config.getStore().getData();
				createModal(modalName, storeData, config);
				next();
			},
			config: [
				{
					name: '弹窗名称',
					data: ['modal'],
					options: {
						receive: '_modal',
						multi: false,
					},
				},
			],
			name: '打开弹窗函数',
		},
		关闭弹窗函数: {
			fn: (_ctx, next, _config, args) => {
				const modalName = args['_modal'];
				const fn = unmountMap.get(modalName);
				if (fn) {
					fn();
				}
				next();
			},
			config: [
				{
					name: '弹窗名称',
					data: ['modal'],
					options: {
						receive: '_modal',
						multi: false,
					},
				},
			],
			name: '关闭弹窗函数',
		},
	},
	initDataCenterMap: {},
	initCommandModule: [],
	initFormComponents: {},
	containerIcon: <VerticalAlignMiddleOutlined />,
};

/**
 *
 * 部分无法合并属性如果b传了会以b为准
 * initstore不合并
 * leftallregistmap合并
 * leftRenderListCategory合并
 * rightRenderListCategory合并
 * rightGlobalCustom 不合并
 * initComponentCache合并
 * initFunctionMap合并
 * initDataCenterMap合并
 * initCommandModule合并
 * initFormComponents合并
 * containerIcon不合并
 *
 * @export InitConfig
 */
export function userConfigMerge(a: Partial<InitConfig>, b?: Partial<InitConfig>): InitConfig {
	const mergeConfig: InitConfig = {
		initStoreData: [defaultStore],
		leftAllRegistMap: [],
		leftRenderListCategory: [],
		rightRenderListCategory: [],
		initComponentCache: {},
		initFunctionMap: {},
		initDataCenterMap: {},
		initCommandModule: [],
		rightGlobalCustom: null,
		initFormComponents: {},
		containerIcon: null,
	};
	if (!b) {
		return userConfigMerge(mergeConfig, a);
	}
	mergeConfig.initStoreData = b.initStoreData
		? [...b.initStoreData]
		: a.initStoreData
		? [...a.initStoreData]
		: [defaultStore];

	mergeConfig.containerIcon = b.containerIcon ? b.containerIcon : a.containerIcon;

	mergeConfig.rightGlobalCustom = b.rightGlobalCustom ? b.rightGlobalCustom : a.rightGlobalCustom;

	mergeConfig.leftAllRegistMap = b.leftAllRegistMap
		? a.leftAllRegistMap
			? [...a.leftAllRegistMap, ...b.leftAllRegistMap]
			: [...b.leftAllRegistMap]
		: a.leftAllRegistMap
		? [...a.leftAllRegistMap]
		: [];
	mergeConfig.leftRenderListCategory = b.leftRenderListCategory
		? a.leftRenderListCategory
			? [...a.leftRenderListCategory, ...b.leftRenderListCategory]
			: [...b.leftRenderListCategory]
		: a.leftRenderListCategory
		? [...a.leftRenderListCategory]
		: [...defaultConfig.leftRenderListCategory];
	mergeConfig.rightRenderListCategory = b.rightRenderListCategory
		? a.rightRenderListCategory
			? [...a.rightRenderListCategory, ...b.rightRenderListCategory]
			: [...b.rightRenderListCategory]
		: a.rightRenderListCategory
		? [...a.rightRenderListCategory]
		: [...defaultConfig.rightRenderListCategory];
	mergeConfig.initComponentCache = {
		...a.initComponentCache,
		...b.initComponentCache,
	};
	mergeConfig.initFunctionMap = {
		...a.initFunctionMap,
		...b.initFunctionMap,
	};
	mergeConfig.initFormComponents = {
		...a.initFormComponents,
		...b.initFormComponents,
	};
	mergeConfig.initDataCenterMap = {
		...a.initDataCenterMap,
		...b.initDataCenterMap,
	};
	mergeConfig.initCommandModule = b.initCommandModule
		? a.initCommandModule
			? [...a.initCommandModule, ...b.initCommandModule]
			: [...b.initCommandModule]
		: a.initCommandModule
		? [...a.initCommandModule]
		: [];
	return mergeConfig;
}

/**
 *
 *
 * @export 用户配置项
 * @class UserConfig
 */
export class UserConfig {
	public initConfig: InitConfig;
	public store = new Store(); // 得到 Store 实例，类似于 redux
	public componentRegister = new ComponentRegister(); // 得到 ComponentRegister 实例
	public formRegister = new FormComponentRegister(); // 得到 FormComponentRegister 的实例
	public storeChanger = new StoreChanger(); // 得到 StoreChanger 实例
	public componentCache = {};
	public asyncComponentUrlMap = {} as AsyncCacheComponentType;
	public marklineConfig = marklineConfig;
	public commanderRegister: CommanderWrapper;
	public contextMenuState = contextMenuState;
	public eventCenter: EventCenter;
	public dataCenter: DataCenter;
	public scaleState = scaleState;
	public focusState = focusState;
	public collapsed = false;
	public ticker = true;
	public timeline = false;
	public waitAnimate = false;
	public wrapperMoveState = wrapperMoveState;
	public iframeWrapperMoveState = iframeWrapperMoveState;
	public refreshIframe = () => {};
	public sendParent = (message: any) => {
		window.parent.postMessage(message, '*');
	};
	public iframeOrigin = '';
	public iframeId = 'yh-container-iframe';
	public i18n = true;
	public SCRIPTGLOBALNAME = 'DOORINGXPLUGIN';
	public scriptLoading = false;
	public leftForceUpdate = () => {};
	public customMap: Record<string, any> = {};
	constructor(initConfig?: Partial<InitConfig>) {
		const mergeConfig = userConfigMerge(defaultConfig, initConfig); // 合并配置项
		this.initConfig = mergeConfig; // 初始配置
		this.commanderRegister = new CommanderWrapper(this.store, {}, this); // 得到 CommanderWrapper 实例
    // initFunctionMap 默认有「打开弹窗函数」、「关闭弹窗函数」
		this.eventCenter = new EventCenter({}, mergeConfig.initFunctionMap); // 得到 EventCenter 实例，其中包含 functionCenter
		this.dataCenter = new DataCenter(mergeConfig.initDataCenterMap); // 得到 DataCenter 实例，用来管理页面数据，包括全局数据
		this.init();
		// 右侧配置项注册 初始注册组件暂时固定
	}

  // 左、右、画布组件注册、事件注册
	toRegist() {
		const modules = this.initConfig.initFormComponents; // 右侧组件导入，plugin/formComponents 目录下模块集合，格式：{ 'actionButton': export default 的模块 }
		formComponentRegisterFn(this.formRegister, modules); // 同步注册模块，将 modules 注册到 this.formRegister 的 formMap 属性中, 格式：formMap = { 'actionButton': export default 的模块 }

    // 如果要同步导入组件，则需要将组件放入配置项的initComponentCache中，这样在载入时便会注册进componentRegister里
		const cache = this.initConfig.initComponentCache;
		this.componentCache = cache;
		// 拿到组件缓存后，注册到 this.componentRegister 的 componentMap 属性中
		Object.values(cache).forEach((v) => {
			if ((v as CacheComponentValueType).component) {
				this.registComponent((v as CacheComponentValueType).component!);
			}
		});
		// 左侧组件，异步组件注册地址
		this.initConfig.leftAllRegistMap.forEach((v) => {
			if (v.urlFn) {
				//@ts-ignore
				this.asyncComponentUrlMap[v.component] = v.urlFn; // v.urlFn 存储在 this.asyncComponentUrlMap 中，格式：{ [组件名]: urlFn }
			}
		});
		// 注册画布上组件，最初 this.store.getData() 为 initStoreData，init() 中上面处理过，block 为 []
		this.store.getData().block.forEach((v) => {
			this.asyncRegistComponent(v.name);
		});

		// 注册data
		this.dataCenter = new DataCenter(this.initConfig.initDataCenterMap); // 得到 DataCenter 实例
		
    //数据需要加上store上的
    // 需要判断是否在弹窗状态。如果在弹窗状态，数据以 storeChanger 为准，否则就以store为准
    // 最初 this.store.getData() 为 initStoreData，将 this.dataCenter 的 dataMap 设置为 store 的 dataSource
		this.dataCenter.initAddToDataMap(this.store.getData(), this.storeChanger);
		
    // 修改事件与数据初始
    // constructor 中处理过了，这里有处理一遍，目前看没变化
		this.eventCenter = new EventCenter({}, this.initConfig.initFunctionMap);
		
    // 收集画布所有事件到 eventMap 中
		this.eventCenter.syncEventMap(this.store.getData(), this.storeChanger);
	}

	init() {
    // 在 store 中注册初始 store 数据，将 storeDataList 设置为 initStoreData  
		this.store.resetToInitData(deepCopy(this.initConfig.initStoreData), true);
		this.toRegist();
	}

	getCollapse() {
		return this.collapsed;
	}

	getStoreJSON() {
		return JSON.stringify(this.store.getData());
	}

	parseStoreJson(json: string) {
		return JSON.parse(json);
	}

	resetData(data: IStoreData[]) {
		this.store.resetToInitData(data, true);
		this.toRegist();
	}

	getWrapperMove() {
		return {
			data: this.wrapperMoveState,
			iframe: this.iframeWrapperMoveState,
		};
	}

	getFocusState() {
		return this.focusState;
	}
	getScaleState() {
		return this.scaleState;
	}
	getDataCenter() {
		return this.dataCenter;
	}
	getEventCenter() {
		return this.eventCenter;
	}
	getStoreChanger() {
		return this.storeChanger;
	}
	getConfig() {
		return this.initConfig;
	}
	getStore() {
		return this.store;
	}
	getComponentRegister() {
		return this.componentRegister;
	}
	getContextMenuState() {
		return this.contextMenuState;
	}
	getFormRegister() {
		return this.formRegister;
	}
	getCommanderRegister() {
		return this.commanderRegister;
	}

	/**
	 *
	 * 以默认设置重置配置项
	 * @param {Partial<InitConfig>} v
	 * @memberof UserConfig
	 */
	resetConfig(v: Partial<InitConfig>) {
		const mergeConfig = userConfigMerge(defaultConfig, v);
		this.initConfig = mergeConfig;
		this.init();
		this.leftForceUpdate();
		this.store.forceUpdate();
	}
	/**
	 *  会重置配置，请修改配置后增加
	 * 异步增加左侧tab页
	 * @memberof UserConfig
	 */
	addLeftCategory(v: LeftMapRenderListPropsItemCategory[]) {
		const obj = {} as InitConfig;
		obj.leftRenderListCategory = v;
		this.initConfig = userConfigMerge(this.initConfig, obj);
		this.init();
		this.leftForceUpdate();
		this.store.forceUpdate();
	}

	/**
	 *  会重置配置，请修改配置后增加
	 * 异步增加右侧tab页
	 * @memberof UserConfig
	 */
	addRightCategory(v: RightMapRenderListPropsItemCategory[]) {
		const obj = {} as InitConfig;
		obj.rightRenderListCategory = v;
		this.initConfig = userConfigMerge(this.initConfig, obj);
		this.init();
		this.leftForceUpdate();
		this.store.forceUpdate();
	}

	/**
	 * 会重置配置，请修改配置后增加
	 * 异步增加组件map
	 * @memberof UserConfig
	 */
	addCoRegistMap(v: LeftRegistComponentMapItem) {
		const obj = {} as InitConfig;
		obj.leftAllRegistMap = [v];
		this.initConfig = userConfigMerge(this.initConfig, obj);
		this.init();
		this.leftForceUpdate();
		this.store.forceUpdate();
	}

	/**
	 *会重置配置，请修改配置后增加
	 * 异步修改config 重置store
	 * @memberof UserConfig
	 */
	setConfig(v: Partial<InitConfig>) {
		this.initConfig = userConfigMerge(this.initConfig, v);
		this.init();
		this.leftForceUpdate();
		this.store.forceUpdate();
	}

	/**
	 *
	 * 同步注册指令
	 * @param {CommanderItem} command
	 * @memberof UserConfig
	 */
	registCommander(command: CommanderItem) {
		this.commanderRegister.register(command);
	}

	/**
	 *
	 * 用于修改markline配置
	 * @returns
	 * @memberof UserConfig
	 */
	getMarklineConfig() {
		return this.marklineConfig;
	}

	getComponentCache() {
		return this.componentCache;
	}
	/**
	 *
	 * 同步注册组件
	 * @param {ComponentItemFactory} item
	 * @memberof UserConfig
	 */
	registComponent(item: ComponentItemFactory) {
		this.componentRegister.register(item);
	}
	/**
	 *
	 * 异步注册组件，会判定缓存是否存在，缓存中不存在，加入缓存
	 * @param {string} name 组件名
	 * @memberof UserConfig
	 */
	async asyncRegistComponent(name: string) {
		//判定缓存
		if (
			!(this.componentCache as Record<string, CacheComponentValueType>)[name] &&
			this.asyncComponentUrlMap[name]
		) {
			const chunk = await this.asyncComponentUrlMap[name](); // 加载的组件
			const chunkDefault = chunk.default; // 导出的组件
			this.componentRegister.register(chunkDefault);

      // 加入缓存
			(this.componentCache as Record<string, CacheComponentValueType>)[name] = {
				component: chunkDefault,
			};
			this.componentRegister.emitEvent(name);
		}
	}

	scriptRegistComponentSingle(item: ComponentItemFactory, leftProps: LeftRegistComponentMapItem) {
		this.registComponent(item);
		this.addCoRegistMap(leftProps);
	}

	// foreach可能导致问题
	// scriptRegistComponentMulti(
	// 	items: ComponentItemFactory[],
	// 	leftProps: LeftRegistComponentMapItem[]
	// ) {
	// 	items.forEach((item) => {
	// 		this.registComponent(item);
	// 	});
	// 	const obj = {} as InitConfig;
	// 	obj.leftAllRegistMap = leftProps;
	// 	this.initConfig = userConfigMerge(this.initConfig, obj);
	// 	this.init();
	// 	this.store.forceUpdate();
	// }

	/**
	 *
	 * 分类信息需要单独存储后加载
	 * @param {string} src  url地址
	 * @param {Partial<LeftRegistComponentMapItem>} leftProps 分类
	 * @param {Function} [callback] 回调
	 * @return {*}
	 * @memberof UserConfig
	 */
	scriptSingleLoad(
		src: string,
		leftProps: Partial<LeftRegistComponentMapItem>,
		callback?: Function
	) {
		let isEdit = this.storeChanger.isEdit();
		let storeData = this.store.getData();
		let globalState = storeData.globalState;
		if (isEdit) {
			storeData = this.storeChanger.getOrigin()!.now;
			globalState = storeData.globalState;
		}
		if (globalState['script'].includes(src)) {
			console.error(src + 'scripts have been loaded');
			return;
		}
		if (!this.scriptLoading) {
			this.scriptLoading = true;
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				const item = window[this.SCRIPTGLOBALNAME as any] as unknown as ComponentItemFactory;
				try {
					const left = leftProps;
					left.component = item.name;
					left.displayName = item.display;
					this.scriptRegistComponentSingle(item, left as LeftRegistComponentMapItem);
				} catch (e) {
					console.error(e);
				}
				// 前面加载会重置store 新增组件需要事件初始化
				setTimeout(() => {
					window[this.SCRIPTGLOBALNAME as any] = undefined as any;
					isEdit = this.storeChanger.isEdit();
					globalState = this.store.getData().globalState;
					if (isEdit) {
						globalState = this.storeChanger.getOrigin()!.now.globalState;
					}
					globalState['script'].push(src);
					storeData.globalState = globalState;
					this.store.resetToInitData([storeData], true);
					this.store.forceUpdate();
					this.scriptLoading = false;
					if (callback) {
						callback();
					}
				});
			};
			document.body.appendChild(script);
		}
	}
}

export default UserConfig;
