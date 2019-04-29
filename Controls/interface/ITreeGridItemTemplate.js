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
    *    <li>
    *       levelIndentSize {String} - Size of hierarchical indent.
    *       <ul>
    *          <li>s - S size of hierarchical indent</li>
    *          <li>m - M size of hierarchical indent</li>
    *          <li>l - L size of hierarchical indent</li>
    *          <li>xl - XL size of hierarchical indent</li>
    *       </ul>
    *       Default: <b>s</b>
    *    </li>
    *    <li>
    *       expanderSize {String} - Size of nodes and hidden nodes expanders.
    *       <ul>
    *          <li>s - S size of nodes and hidden nodes expanders</li>
    *          <li>m - M size of nodes and hidden nodes expanders</li>
    *          <li>l - L size of nodes and hidden nodes expanders</li>
    *          <li>xl - XL size of nodes and hidden nodes expanders</li>
    *       </ul>
    *       Default: <b>s</b>
    *    </li>
    *    <li>
    *       expanderIcon {String} - Icon of nodes and hidden nodes expanders.
    *       <ul>
    *          <li>none - No icon of expander.</li>
    *          <li>node - Icon of expander like in node.</li>
    *          <li>hiddenNode - Icon of expander like in hidden node.</li>
    *       </ul>
    *    </li>
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
