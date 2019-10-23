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
         this._selectedKeys = [];
         this._excludedKeys = [];
      },

      _onOperationsPanelOpened: function() {
         this._operationsPanelVisible = true;
      },

      _expandedChangedHandler: function (event, state) {
         this._expanded = state;
      }
   });
});
