define('Controls/interface/IGridItemTemplate', [
], function() {

   /**
    * Interface for components with customizable display of elements in Grid control.
    *
    * @interface Controls/interface/IGridItemTemplate
    * @public
    */

   /**
    * @name Controls/interface/IGridItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * <a href="/materials/demo-ws4-grid-item-template">Example</a>.
    * @remark
    * Base itemTemplate for Controls.grid:View: "Controls/grid:ItemTemplate".
    * Inside the template scope, object itemData is available, allowing you to access the render data (for example: item, key, etc.).
    * Base itemTemplate supports these parameters:
    * <ul>
    *    <li>highlightOnHover {Boolean} - Enable highlighting item by hover.</li>
    * </ul>
    * @example
    * Using custom template for item rendering:
    * <pre>
    *    <Controls.grid:View>
    *       <itemTemplate>
    *          <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}"/>
    *       </itemTemplate>
    *    </Controls.grid:View>
    * </pre>
    */

   /**
    * @name Controls/interface/IGridItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-grid-item-template">Example</a>.
    */

});
