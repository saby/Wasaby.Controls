/**
 * Шаблон, который по умолчанию используется для отображения заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы} в {@link Controls/grid:View таблице}, {@link Controls/treeGrid:View дереве} и {@link Controls/explorer:View иерархическом проводнике}.
 * 
 * @class Controls/_grid/interface/GroupTemplate
 * @mixes Controls/list:IBaseGroupTemplate
 * @author Авраменко А.С.
 * @see Controls/interface/IGroupedGrid#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" scope="{{ groupTemplate }}">
 *          <ws:contentTemplate>
 *             <ws:if data="{{contentTemplate.itemData.item === 'tasks'}}">Задачи</ws:if>
 *             <ws:if data="{{contentTemplate.itemData.item === 'error'}}">Ошибки</ws:if>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ здесь}.
 * @public
 */
export default interface IGroupTemplateOptions {
   /**
    * @cfg {Number|undefined} Номер колонки, относительно которой происходит горизонтальное выравнивание заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы}.
    * @default undefined
    * @remark
    * В значении undefined выравнивание отключено.
    */
   columnAlignGroup?: number;
}