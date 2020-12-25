/**
 * Утилита для Toolbar
 * @remark
 *  - содержит константы showType
 *  - фильтр для элементов меню
 *
 * <h3>Пример использования утилиты</h3>
 * <pre>
 * import {showType} from 'Controls/Utils/Toolbar';
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
 * @class Controls/Utils/Toolbar
 * @public
 */
/*
 * Utils for toolbar
 *  - contains constants showType
 *  - filter for menu items
 *
 * <h3>Usage example</h3>
 * <pre>
 * import {showType} from 'Controls/Utils/Toolbar';
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
 * @class Controls/Utils/Toolbar
 * @public
 */

export {showType, IShowType, getMenuItems, needShowMenu} from 'Controls/toolbars';
