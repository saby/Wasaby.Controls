/**
 * Шаблон, который по умолчанию используется для отображения {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/header/ ячейки шапки} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:HeaderContent
 * @author Авраменко А.С.
 * @see Controls/_grid/interface/IGridControl/HeaderCell.typedef
 * @see Controls/grid:IGridControl#header
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/header/ здесь}.
 * @example
 * <pre>
 * <Controls.grid:View>
 *    <ws:header>
 *       <ws:Array>
 *          <ws:Object>
 *             <ws:template>
 *                <ws:partial template="Controls/grid:HeaderContent">
 *                   <ws:contentTemplate>
 *                      {{colData.column.title}}
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:header>
 * </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/grid:HeaderContent#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий содержимое ячейки.
 * @default undefined
 * @remark
 * В области видимости шаблона доступен объект **colData**.
 * Через него можно получить доступ к свойству **column**, которое содержит конфигурацию {@link https://wi.sbis.ru/docs/js/Controls/grid/IGridControl/typedefs/HeaderCell/ ячейки шапки}.
 */

export default interface IHeaderContentOptions {
   contentTemplate?: string;
}