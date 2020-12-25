
export interface IShowType {
   /**
    * Show only in Menu.
    */
   MENU: showType;
   /**
    * Show in Menu and Toolbar.
    */
   MENU_TOOLBAR: showType;
   /**
    * Show only in Toolbar
    */
   TOOLBAR: showType;
}

/**
 * @typedef {String} showType
 * @description
 * Позволяет настроить, какие опции записи будут показаны по ховеру, а какие - в доп.меню.
 * Влияет на порядок отображения опций записи по свайпу.
 * Экспортируемый enum: Controls/itemActions:TItemActionShowType
 * @variant MENU показывать опцию только в дополнительном меню
 * @variant MENU_TOOLBAR показывать опцию в дополнительном меню и тулбаре
 * @variant TOOLBAR показывать опцию только в тулбаре
 * <pre>
 * import {showType} from 'Controls/toolbars';
 *  .....
 * this._defaultItems = [
 *     {
 *         id: '1',
 *         showType: showType.TOOLBAR,
 *         icon: 'icon-Time icon-medium',
 *         '@parent': false,
 *         parent: null
 *     },
 *     {
 *         id: '3',
 *         icon: 'icon-Print icon-medium',
 *         title: 'Распечатать',
 *         '@parent': false,
 *         parent: null
 *      }
 *  ];
 * </pre>
 */
export enum showType {
   MENU,
   MENU_TOOLBAR,
   TOOLBAR
}