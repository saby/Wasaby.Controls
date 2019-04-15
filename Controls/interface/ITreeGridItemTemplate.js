define('Controls/interface/ITreeGridItemTemplate', [
], function() {

   /**
    * Interface for components with customizable display of elements in TreeGrid control.
    *
    * @interface Controls/interface/ITreeGridItemTemplate
    * @public
    */

   /**
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Example</a>.
    * @remark
    * Base itemTemplate for Controls.treeGrid:View: "Controls/treeGrid:ItemTemplate".
    * Inside the template scope, object itemData is available, allowing you to access the render data (for example: item, key, etc.).
    * Base itemTemplate supports these parameters:
    * <ul>
    *    <li>levelIndentSize {String} - Size of hierarchical indent.</li>
    *    <li>expanderSize {String} - Size of nodes and hidden nodes expanders.</li>
    *    <li>expanderIcon {String} - Icon of nodes and hidden nodes expanders.</li>
    * </ul>
    * @example
    * Using custom template for item rendering:
    * <pre>
    *    <Controls.treeGrid:View>
    *       <itemTemplate>
    *          <ws:partial template="Controls/treeGrid:ItemTemplate" levelIndentSize="null" expanderSize="l" expanderIcon="node" />
    *       </itemTemplate>
    *    </Controls.treeGrid:View>
    * </pre>
    */

   /**
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Example</a>.
    */

});
