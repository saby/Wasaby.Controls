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
 *       <ws:partial
 *          template="Controls/grid:ItemTemplate"
 *          marker="{{false}}"
 *          highlightOnHover="{{false}}"
 *          clickable="{{false}}"
 *          colspan="{{true}}">
 *          <ws:colspanTemplate>
 *             <span>Это текст для объединенных ячеек.</span>
 *          </ws:colspanTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ Руководство разработчика}
 */

/**
 * @name Controls/grid:ItemTemplate#marker
 * @cfg {Boolean} Когда параметр установлен в значение true, активный элемент таблицы будет выделяться {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/ маркером}.
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
 * @name Controls/grid:ItemTemplate#colspan
 * @cfg {Boolean} Когда параметр установлен в значение true, ячейки будут объединены по горизонтали.
 * @default false
 */
/**
 * @name Controls/grid:ItemTemplate#colspanTemplate
 * @cfg {String|Function} Шаблон отображения объединенных ячеек.
 */
/**
 * @name Controls/grid:ItemTemplate#contentTemplate
 * @cfg {String|Function} Шаблон содержимого ячейки.
 * @remark
 * В области видимости шаблона доступен объект itemData. Из него можно получить доступ к свойству item — это объект, который содержит данные обрабатываемого элемента. Т.е. можно получить доступ к полям и их значениям.
 */
export default interface IItemTemplateOptions {
   marker?: boolean;
   highlightOnHover?: boolean;
   clickable?: boolean;
   colspan?: boolean;
   colspanTemplate?: string;
   contentTemplate?: string;
}