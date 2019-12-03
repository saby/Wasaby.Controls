/* eslint-disable */
define('Controls/interface/ITreeGridItemTemplate', [
], function() {

   /**
    * Интерфейс для компонентов с настраиваемым отображением элементов в контроле {@link Controls/treeGrid:View Дерево}.
    *
    * @interface Controls/interface/ITreeGridItemTemplate
    * @public
    * @author Авраменко А.С.
    */
   /*
    * Interface for components with customizable display of elements in TreeGrid control.
    *
    * @interface Controls/interface/ITreeGridItemTemplate
    * @public
    */

   /**
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplate
    * @cfg {Function} Устанавливает шаблон отображения элемента.
    * @default Controls/treeGrid:ItemTemplate
    * @remark
    * См. <a href="/materials/demo-ws4-tree-grid-item-template">демо-пример</a>.
    * Может быть переопределён с помощью {@link Controls/interface/ITreeGridItemTemplate#itemTemplateProperty itemTemplateProperty}.
    * @example
    * <pre>
    *    <Controls.treeGrid:View>
    *       <ws:itemTemplate>
    *          <ws:partial template="Controls/treeGrid:ItemTemplate" levelIndentSize="null" expanderSize="l" expanderIcon="node" />
    *       </ws:itemTemplate>
    *    </Controls.treeGrid:View>
    * </pre>
    * @see Controls/interface/ITreeGridItemTemplate#itemTemplateProperty
    */

   /*
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplate
    * @cfg {Function} Template for item render.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Example</a>.
    * @remark
    * Base itemTemplate for Controls.treeGrid:View: "Controls/treeGrid:ItemTemplate".
    * Inside the template scope, object itemData is available, allowing you to access the render data (for example: item, key, etc.).
    * Base itemTemplate supports these parameters:
    * <ul>
    *     <li>
    *       clickable {Boolean} - Cursor type (default or pointer).
    *       <ul>
    *          <li>true - cursor pointer</li>
    *          <li>false - cursor default</li>
    *       </ul>
    *       Default: <b>true</b>
    *    </li>
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
    *       <ws:itemTemplate>
    *          <ws:partial template="Controls/treeGrid:ItemTemplate" levelIndentSize="null" expanderSize="l" expanderIcon="node" />
    *       </ws:itemTemplate>
    *    </Controls.treeGrid:View>
    * </pre>
    */

   /**
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplateProperty
    * @cfg {String} Устанавливает имя свойства элемента, которое содержит имя шаблона, используемого для отрисовки элементов.
    * Если не определено, используется {@link Controls/interface/ITreeGridItemTemplate#itemTemplate itemTemplate}.
    * @remark
    * См. <a href="/materials/demo-ws4-tree-grid-item-template">демо-пример</a>.
    * @see Controls/interface/ITreeGridItemTemplate#itemTemplate
    */
   /*
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Example</a>.
    */

});
