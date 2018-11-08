define('Controls/Operations/Panel', [
   'Core/Control',
   'wml!Controls/Operations/Panel/Panel'
], function(Control, template) {
   'use strict';

   /**
    * Control for grouping operations.
    * <a href="/materials/demo-ws4-operations-panel">Демо-пример</a>.
    *
    * @class Controls/Operations/Panel
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/interface/IExpandable
    * @control
    * @public
    * @author Зайцев А.С.
    * @demo Controls-demo/OperationsPanel/Panel
    *
    * @css @background-color_OperationsPanel Background color of the panel.
    * @css @height_OperationsPanel Height of panel.
    * @css @spacing_OperationsPanel__item-between-icon-caption Spacing between icon and caption in items.
    * @css @spacing_OperationsPanel-between-items Spacing between items.
    * @css @margin_OperationsPanel__rightTemplate Margin of rightTemplate.
    */

   /**
    * @name Controls/Operations/Panel#multiSelectorVisibility
    * @cfg {Boolean} Show the block with the operations of the mark.
    * @remark
    * Mark operations allow you to select, deselect, or invert the selection in the entire list.
    * @example
    * Hide the block with the operations of the mark:
    * <pre>
    *    <Controls.Operations.Panel multiSelectorVisibility="{{false}}" />
    * </pre>
    */

   /**
    * @name Controls/Operations/Panel#rightTemplate
    * @cfg {Function} Template displayed on the right side of the panel.
    * @example
    * <pre>
    *    <Controls.Operations.Panel rightTemplate="tmpl!MyModule/OperationsPanelRightTemplate" />
    * </pre>
    */

   /**
    * @event Controls/Operations/Panel#itemClick Occurs when item was clicked.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Clicked item.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Operations.Panel on:itemClick="onPanelItemClick()" />
    * </pre>
    * JS:
    * <pre>
    *    onPanelItemClick: function(e, selection) {
    *       var itemId = item.get('id');
    *       switch (itemId) {
    *          case 'remove':
    *             this._removeItems();
    *             break;
    *          case 'move':
    *             this._moveItems();
    *             break;
    *    }
    * </pre>
    */

   return Control.extend({
      _template: template
   });
});
