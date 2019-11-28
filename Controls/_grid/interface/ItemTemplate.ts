/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ItemTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#itemTemplate
 * @see Controls/grid:View#itemTemplateProperty
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate" marker="{{false}}">
 *          <ws:contentTemplate>
 *             {{ contentTemplate. }}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ здесь}.
 */

/**
 * @name Controls/grid:ItemTemplate#marker
 * @cfg {Boolean} Когда параметр установлен в значение true, активный элемент будет выделяться {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/ маркером}.
 * @default true
 */
/**
 * @name Controls/grid:ItemTemplate#highlightOnHover
 * @cfg {Boolean} Когда параметр установлен в значение true, элемент таблицы будет подсвечиваться при наведении курсора мыши.
 * @default true
 */
/**
 * @name Controls/grid:ItemTemplate#clickable
 * @cfg {Boolean} Когда параметр установлен в значение true, используется {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсор} pointer, а в значении false — default.
 * @default true
 */
/**
 * @name Controls/grid:ItemTemplate#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий содержимое элемента.
 * @default undefined
 * @remark
 * В области видимости шаблона доступен объект **itemData**.
 * Из него можно получить доступ к свойству **item** — это объект, который содержит данные обрабатываемого элемента.
 */
/**
 * @name Controls/grid:ItemTemplate#itemActionsTemplate
 * @cfg {String|Function} Шаблон позволяет отобразить панель {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/ опций записи}, когда задан пользовательский шаблон (см. contentTemplate) в Controls/grid:ItemTemplate.
 * Шаблон достаточно встроить в нужное место contentTemplate с помощью директивы {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}.
 * @default wml!Controls/_list/ItemActions/resources/ItemActionsTemplate
 * @example
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate"
 *          marker="{{false}}"
 *          highlightOnHover="{{false}}"
 *          clickable="{{false}}">
 *          <ws:contentTemplate>
 *             Это мой шаблон отображения элемента.
 *             <ws:partial template="{{itemTemplate.itemActionsTemplate}}" />
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 */
export default interface IItemTemplateOptions {
   marker?: boolean;
   highlightOnHover?: boolean;
   clickable?: boolean;
   contentTemplate?: string;
   itemActionsTemplate?: string;
}