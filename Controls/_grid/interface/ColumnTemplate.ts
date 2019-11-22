/**
 * Шаблон, который по умолчанию используется для отображения ячеек в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ColumnTemplate
 * @author Авраменко А.С.
 * @see Controls/_grid/interface/IGridControl/Column.typedef
 * @see Controls/grid:IGridControl#columns
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/ Руководство разработчика}
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.grid:View>
 *    <ws:columns>
 *       <ws:Array>
 *          <ws:Object displayProperty="Name">
 *             <ws:template>
 *                <ws:partial template="Controls/grid:ColumnTemplate">
 *                   <ws:contentTemplate>
 *                      <div title="{{template.itemData.item.Name}}">
 *                         {{template.itemData.item.Name}}
 *                      </div>
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:columns>
 * </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/grid:ColumnTemplate#contentTemplate
 * @cfg {String|Function} Вёрстка, описывающая содержимое ячейки.
 * @remark
 * В области видимости шаблона доступен объект **itemData**. Из него можно получить доступ к следующим свойствам:
 * 
 * * **columnIndex** — порядковый номер колонки. Отсчет от 0.
 * * **index** — порядковый номер строки. Отсчет от 0.
 * * **isEditing** — признак {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/edit/ редактирования по месту}.
 * * **item** — элемент, данные которого отображаются в колонке.
 * * **column** — {@link Controls/_grid/interface/IGridControl/Column.typedef конфигурация колонки}.
 * @example
 * **Пример 1.** В следующем примере показано как получить доступ к itemData, если опция настраивается в рамках родительского шаблона.
 * <pre>
 * <Controls.grid:View>
 *    <ws:columns>
 *       <ws:Array>
 *          <ws:Object displayProperty="Name">
 *             <ws:template>
 *                <ws:partial template="Controls/grid:ColumnTemplate">
 *                   <ws:contentTemplate>
 *                      <div title="{{template.itemData.item.Name}}">
 *                         {{template.itemData.item.Name}}
 *                      </div>
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:columns>
 * </Controls.grid:View>
 * </pre>
 * **Пример 2.** В следующем примере показано как получить доступ к itemData, если опция настраивается в отдельном файле.
 * При этом в директиве ws:partial нужно передать опцию scope.
 * <pre class="brush: html">
 * <!-- Child.wml -->
 * <ws:partial template="Controls/grid:ColumnTemplate" scope="{{_options}}">
 *    <ws:contentTemplate>
 *       <div>{{itemData.item.id}} - {{itemData.item.author}}</div>
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * <pre class="brush: html">
 * <!-- Parent.wml -->
 * <Controls.grid:View>
 *    <ws:columns>
 *       <ws:Array>
 *          <ws:Object displayProperty="Name" template="{{ myTemplate }}" />
 *       </ws:Array>
 *    </ws:columns>
 * </Controls.grid:View>
 * </pre>
 * <pre class="brush: js">
 * define('MyControl',
 *    ['UI/Base', 'wml!Parent', 'wml!Child'], 
 *    function(Base, template, myTemplate) {
 *    var ModuleClass = Base.Control.extend({
 *       _template: template,
 *       myTemplate: myTemplate,
 *       // логика работы контрола
 *    });
 *    return ModuleClass;
 * });
 * </pre>
 */
export default interface IColumnTemplateOptions {
   contentTemplate?: string;
}