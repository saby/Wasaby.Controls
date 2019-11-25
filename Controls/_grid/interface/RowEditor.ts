/**
 * Шаблон, который используют для настройки отображения элемента табличного представления в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/edit/ режиме редактирования}.
 * @class Controls/grid:RowEditor
 * @author Авраменко А.С.
 * @see Controls/grid:View#itemTemplate
 * @example
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate">
 *          <ws:contentTemplate>
 *             Этот отображается в режиме просмотра.
 *             <ws:partial template="{{itemTemplate.itemActionsTemplate}}" />
 *          </ws:contentTemplate>
 *       </ws:partial>
 *       <ws:partial template="Controls/grid:RowEditor" scope="{{_options}}">
 *          <ws:content>
 *             Этот отображается в режиме редактирования.
 *             <Controls.dropdown:Combobox bind:selectedKey="itemData.item.documentSign" ... />
 *          </ws:content>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/grid:RowEditor#content
 * @cfg {String|Function} Шаблон, описывающий содержимое элемента в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/edit/ режиме редактирования}.
 * @default undefined
 */

export default interface IRowEditorOptions {
   content?: string;
}