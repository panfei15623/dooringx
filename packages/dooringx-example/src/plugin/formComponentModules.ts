/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:29:38
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-12 11:24:56
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\formComponentModules.ts
 *
 */

import { ComponentClass } from 'react';
import { FunctionComponent } from 'react';

/**
 * https://webpack.docschina.org/guides/dependency-management/
 * https://juejin.cn/post/6844903583113019405
 * 使用 require.context() ，这个方法有 3 个参数:
 * 要搜索的文件夹目录
 * 是否还应该搜索它的子目录
 * 一个匹配文件的正则表达式
 * require.context() 返回一个 require 函数，可以加载模块
 * 这个函数有 3 个属性：
 * resolve 是一个函数，它返回请求被解析后得到的模块 id。
 * keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的 request(https://webpack.docschina.org/glossary/#r) 组成。
 * id 是上下文模块里面所包含的模块 id. 它可能在你使用 module.hot.accept 的时候被用到
 */
const modulesFiles = (require as any).context('./formComponents', true, /\.(js|tsx)$/);

/**
 * 将 formComponents 目录下模块存储在以 { moduleName: {} } 形式存储在 modules 中
 */
export const Formmodules: Record<string, FunctionComponent<any> | ComponentClass<any, any>> =
	/**
	 * modulePath 是 ./模块名.tsx
	 */
	modulesFiles.keys().reduce((modules: any, modulePath: any) => {
		const tmp = modulePath.split('.');
		const name = tmp[tmp.length - 2].slice(1);
		const value = modulesFiles(modulePath);
		modules[name] = value.default;
		return modules;
	}, {});
