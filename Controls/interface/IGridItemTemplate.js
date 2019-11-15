/* eslint-disable */
define('Controls/interface/IGridItemTemplate', [
], function() {

   /**
    * Интерфейс для настройки отображения табличного представления.
    *
    * @interface Controls/interface/IGridItemTemplate
    * @public
    */

   /*
    * Interface for components with customizable display of elements in Grid control.
    *
    * @interface Controls/interface/IGridItemTemplate
    * @public
    */

   /**
    * @name Controls/interface/IGridItemTemplate#itemTemplate
    * @cfg {Function} Шаблон отображения элемента таблицы.
    * См. <a href="/materials/demo-ws4-grid-item-template">демо-пример</a>.
    * @default Controls/grid:ItemTemplate
    * @remark
    * Подробнее о параметрах шаблона читайте {@link Controls/grid:ItemTemplate здесь}.
    * Подробнее работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ здесь}.
    * @see itemTemplateProperty
    */

   /*
    * @name Controls/interface/IGridItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * <a href="/materials/demo-ws4-grid-item-template">Example</a>.
    * @remark
    * Base itemTemplate for Controls.grid:View: "Controls/grid:ItemTemplate".
    * Inside the template scope, object itemData is available, allowing you to access the render data (for example: item, key, etc.).
    * Base itemTemplate supports these parameters:
    * <ul>
    *    <li>highlightOnHover {Boolean} - Enable highlighting item by hover.</li>
    *    <li>
    *       clickable {Boolean} - Cursor type (default или pointer).
    *       <ul>
    *          <li>true - cursor pointer</li>
    *          <li>false - cursor default</li>
    *       </ul>
    *       By default: <b>true</b>
    *    </li>
    * </ul>
    * @example
    * Using custom template for item rendering:
    * <pre>
    *    <Controls.grid:View>
    *       <ws:itemTemplate>
    *          <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}"/>
    *       </ws:itemTemplate>
    *    </Controls.grid:View>
    * </pre>
    */

   /**
    * @name Controls/interface/IGridItemTemplate#itemTemplateProperty
    * @cfg {String} Имя свойства элемента, содержащего шаблон для рендеринга. Если не задано, используется itemTemplate.
    * <a href="/materials/demo-ws4-grid-item-template">Example</a>.
    * @see itemTemplate
    */

   /*
    * @name Controls/interface/IGridItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-grid-item-template">Example</a>.
    */

});
