/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:28:20
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-07 14:28:28
 * @FilePath: \visual-editor\src\plugin\commands\redo.ts
 */
import { CommanderItemFactory } from 'dooringx-lib';
const undo = new CommanderItemFactory(
	'redo', // 注册名 name
	'Control+Shift+z', // 快捷键名 keyboard
	(store) => {
		// excute
		store.redo();
	},
	'重做' // 展示名 display
);

export default undo;
