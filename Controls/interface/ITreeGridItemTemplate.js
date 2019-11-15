/* eslint-disable */
define('Controls/interface/ITreeGridItemTemplate', [
], function() {

   /**
    * Интерфейс для компонентов с настраиваемымм отображением элементов в контроле TreeGrid.
    *
    * @interface Controls/interface/ITreeGridItemTemplate
    * @public
    */
   /*
    * Interface for components with customizable display of elements in TreeGrid control.
    *
    * @interface Controls/interface/ITreeGridItemTemplate
    * @public
    */

   /**
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplate
    * @cfg {Function} Шаблон отображения элемента.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Демо-пример</a>.
    * @remark
    * Базовый шаблон отображения элемента для Controls/treeGrid:View: "Controls/treeGrid:ItemTemplate".
    * Внутри шаблона доступен объект itemData, позволяющий получить доступ к данным для рендеринга (например: item, key, etc.).
    * Базовый шаблон отображения itemTemplate поддерживает следующие параметры:
    * <ul>
    *    <li>
    *       clickable {Boolean} - Тип курсора (default или pointer).
    *       <ul>
    *          <li>true - курсор pointer</li>
    *          <li>false - курсор default</li>
    *       </ul>
    *       По умолчанию: <b>true</b>
    *    </li>
    *    <li>
    *       levelIndentSize {String} - Размер отступа элемента иерархии.
    *       <ul>
    *          <li>s - размер S</li>
    *          <li>m - размер M</li>
    *          <li>l - размер L</li>
    *          <li>xl - размер XL</li>
    *       </ul>
    *       По умолчанию: <b>s</b>
    *    </li>
    *    <li>
    *       expanderSize {String} - Размер иконки узла (скрытого узла).
    *       <ul>
    *          <li>s - размер S</li>
    *          <li>m - размер M</li>
    *          <li>l - размер L</li>
    *          <li>xl - размер XL</li>
    *       </ul>
    *       По умолчанию: <b>s</b>
    *    </li>
    *    <li>
    *       expanderIcon {String} - Стиль отображения иконки узла (скрытого узла).
    *       <ul>
    *          <li>none - иконки всех узлов не отображаются.</li>
    *          <li>node - иконки всех узлов отображаются как иконки узлов.</li>
    *          <li>hiddenNode - иконки всех узлов отображаются как иконки скрытых узлов.</li>
    *       </ul>
    *    </li>
    * </ul>
    * @example
    * Использование кастомного шаблона для отрисовки элементов:
    * <pre>
    *    <Controls.treeGrid:View>
    *       <ws:itemTemplate>
    *          <ws:partial template="Controls/treeGrid:ItemTemplate" levelIndentSize="null" expanderSize="l" expanderIcon="node" />
    *       </ws:itemTemplate>
    *    </Controls.treeGrid:View>
    * </pre>
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
    * @cfg {String} Имя свойства элемента, которое содержит имя шаблона, используемого для отрисовки элементов. Если не определено, используется itemTemplate.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Демо-пример</a>.
    */
   /*
    * @name Controls/interface/ITreeGridItemTemplate#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * <a href="/materials/demo-ws4-tree-grid-item-template">Example</a>.
    */

});
