define('Controls-demo/OperationsPanel/Demo/Demo', [
   'Core/Control',
   'tmpl!Controls-demo/OperationsPanel/Demo/Demo',
   'WS.Data/Source/Memory',
   'Controls-demo/OperationsPanel/Demo/Data',
   'css!Controls-demo/OperationsPanel/Demo/Demo',
   'tmpl!Controls-demo/OperationsPanel/Demo/PersonInfo'
], function(
   Control,
   template,
   Memory,
   Data
) {
   'use strict';

   return Control.extend({
      _multiSelectVisibility: 'hidden',
      _panelVisible: false,
      _template: template,

      _viewSource: new Memory({
         idProperty: 'id',
         data: Data.employees
      }),

      gridData: Data,
      gridColumns: [
         {
            template: 'tmpl!Controls-demo/OperationsPanel/Demo/PersonInfo'
         }
      ],

      _openClick: function() {
         this._panelVisible = !this._panelVisible;
         this._multiSelectVisibility = this._panelVisible ? 'visible' : 'hidden';
      }
   });
});
