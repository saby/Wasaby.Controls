/* eslint-disable */
define('Controls/interface/IItemTemplate', [
], function() {

   /**
    * Интерфейс для контролов с возможностью настройки отображения элементов.
    *
    * @interface Controls/interface/IItemTemplate
    * @public
    * @author Герасимов А.М.
    */

   /*
    * Interface for components with customizable display of elements.
    *
    * @interface Controls/interface/IItemTemplate
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/interface/IItemTemplate#itemTemplate
    * @cfg {Function} Шаблон элемента списка.
    * <a href="/materials/demo-ws4-list-item-template">Демо-пример</a>.
    * @remark
    * По умолчанию используется шаблон "Controls/list:ItemTemplate".
    *
    * Базовый шаблон itemTemplate поддерживает следующие параметры:
    * - contentTemplate {Function} — Шаблон содержимого элемента;
    * - highlightOnHover {Boolean} — Выделять элемент при наведении на него курсора мыши.
    * - clickable {Boolean} - Тип курсора (false - default или true - pointer) По умолчанию true.
    *
    * В области видимости шаблона доступен объект itemData, позволяющий получить доступ к данным рендеринга (например, элемент, ключ и т.д.).
    *
    * Подробнее о работе с шаблоном читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/list/templates/item/">руководстве разработчика</a>.
    * @example
    * <pre>
    *    <Controls.list:View>
    *       <ws:itemTemplate>
    *          <ws:partial template="Controls/list:ItemTemplate">
    *             <ws:contentTemplate>
    *                <span>{{itemTemplate.itemData.item.description}}</span>
    *             </ws:contentTemplate>
    *          </ws:partial>
    *       </ws:itemTemplate>
    *    </Controls.list:View>
    * </pre>
    */

   /*
    * @name Controls/interface/IItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * <a href="/materials/demo-ws4-list-item-template">Example</a>.
    * @remark
    * Base itemTemplate for Controls.list:View: "Controls/list:ItemTemplate".
    * Inside the template scope, object itemData is available, allowing you to access the render data (for example: item, key, etc.).
    * Base itemTemplate supports these parameters:
    * <ul>
    *    <li>contentTemplate {Function} - Template for render item content.</li>
    *    <li>highlightOnHover {Boolean} - Enable highlighting item by hover.</li>
    *    <li>clickable {Boolean} - Cursor type (false - default or true - pointer) By default: true.</li>
    * </ul>
    * @example
    * Using custom template for item rendering:
    * <pre>
    *    <Controls.list:View>
    *       <ws:itemTemplate>
    *          <ws:partial template="Controls/list:ItemTemplate">
    *             <ws:contentTemplate>
    *                <span>{{contentTemplate.itemData.item.description}}</span>
    *             </ws:contentTemplate>
    *          </ws:partial>
    *       </ws:itemTemplate>
    *    </Controls.list:View>
    * </pre>
    */

   /**
    * @name Controls/interface/IItemTemplate#itemTemplateProperty
    * @cfg {String} Имя свойства, содержащего ссылку на шаблон элемента. Если значение свойства не передано, то для отрисовки используется itemTemplate.
    * <a href="/materials/demo-ws4-list-item-template">Демо-пример</a>.
    */

   /*
    * @name Controls/interface/IItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-list-item-template">Example</a>.
    */
});
