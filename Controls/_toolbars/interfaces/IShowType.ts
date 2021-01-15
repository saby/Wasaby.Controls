
/**
 * Позволяет настроить, какие {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи} будут показаны на панели, а какие — в меню. Влияет на порядок отображения опций записи по {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/swipe-mobile/ свайпу}.
 * Подробнее о размещении опций записи читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/ здесь}.
 * <pre class="brush: js">
 * // TypeScript
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
 * @public
 */
export enum showType {
   /**
    * Опция отображается в меню опций и в контекстном меню.
    */
   MENU,
   /**
    * Опция отображается в меню опций и в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/menu-visibility/ контекстном меню}, а также на панели опций.
    */
   MENU_TOOLBAR,
   /**
    * Опция отображается только на панели опций.
    */
   TOOLBAR
}
