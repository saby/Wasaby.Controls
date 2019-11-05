define('Controls-demo/SelectionStrategies/ListWithOperationsPanel', [
   'Core/Control',
   'wml!Controls-demo/SelectionStrategies/ListWithOperationsPanel'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template,
      _expanded: false,
      _operationsPanelVisible: false,
      _selectedKeys: null,
      _excludedKeys: null,

      _beforeMount: function() {
         this._selectedKeys = [28];
         this._excludedKeys = [];
      }
   });
});
