define('Controls/interface/IItemTemplate', [
], function() {

   /**
    * Interface for components with customizable display of elements.
    *
    * @interface Controls/interface/IItemTemplate
    * @public
    * @author Герасимов А.М.
    */

   /**
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
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-list-item-template">Example</a>.
    */
});
