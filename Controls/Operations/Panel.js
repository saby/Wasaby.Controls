define('Controls/Operations/Panel', [
   'Core/Control',
   'tmpl!Controls/Operations/Panel/Panel'
], function(Control, template) {
   'use strict';

   /**
    * Control for grouping operations.
    * <a href="/materials/demo-ws4-operations-panel">Демо-пример</a>.
    *
    * @class Controls/Operations/Panel
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/IExpandable
    * @control
    * @public
    * @demo Controls-demo/OperationsPanel/Panel
    */

   /**
    * @name Controls/Operations/Panel#multiSelectorVisibility
    * @cfg {Boolean} multiSelector Show multiSelector block.
    */

   /**
    * @name Controls/Operations/Panel#rightTemplate
    * @cfg {Function} Template displayed on the right side of the panel.
    */

   /**
    * @event Controls/Operations/Panel#itemClick Occurs when item was clicked.
    * @param {WS.Data/Entity/Record} item Clicked item.
    */

   return Control.extend({
      _template: template
   });
});
