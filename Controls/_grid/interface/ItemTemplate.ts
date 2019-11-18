/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ItemTemplate
 * @author Авраменко А.С.
 * @demo Controls-demo/List/Grid/WI/ItemTemplate
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
 * В области видимости шаблона доступен объект itemData. Из него можно получить доступ к свойству item — это объект, который содержит данные обрабатываемого элемента. Т.е. можно получить доступ к полям и их значениям.
 * 
 * Дополнительно о шаблоне:
 * 
 * * {@link Controls/grid:IItemTemplateOptions Параметры шаблона}
 * * {@link https://wi.sbis.ru/doc/platform/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ Руководство разработчика}
 */

/**
 * Интерфейс для {@link Controls/grid:ItemTemplate шаблона отображения элемента} в табличном представлении.
 * @interface Controls/grid:IItemTemplateOptions
 * @author Авраменко А.С.
 */
/**
 * @name Controls/grid:IItemTemplateOptions#marker
 * @cfg {Boolean} Когда параметр установлен в значение true, активный элемент таблицы будет выделяться <a href="/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/">маркером</a>.
 * @default true
 */
/**
 * @name Controls/grid:IItemTemplateOptions#highlightOnHover
 * @cfg {Boolean} Когда параметр установлен в значение true, элемент таблицы будет подсвечиваться при наведении курсора мыши.
 * @default true
 */
/**
 * @name Controls/grid:IItemTemplateOptions#clickable
 * @cfg {Boolean} Когда параметр установлен в значение true, используется <a href="https://developer.mozilla.org/ru/docs/Web/CSS/cursor">курсор</a> pointer, а в значении false — default.
 * @default true
 */
/**
 * @name Controls/grid:IItemTemplateOptions#colspan
 * @cfg {Boolean} Когда параметр установлен в значение true, ячейки будут объединены по горизонтали.
 * @default false
 */
/**
 * @name Controls/grid:IItemTemplateOptions#colspanTemplate
 * @cfg {String|Function} Шаблон отображения объединенных ячеек.
 */
/**
 * @name Controls/grid:IItemTemplateOptions#contentTemplate
 * @cfg {String|Function} Шаблон содержимого ячейки.
 */
export default interface IItemTemplateOptions {
   marker?: boolean;
   highlightOnHover?: boolean;
   clickable?: boolean;
   colspan?: boolean;
   colspanTemplate?: string;
   contentTemplate?: string;
}