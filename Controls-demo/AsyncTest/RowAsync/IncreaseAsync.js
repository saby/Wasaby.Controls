define('Controls-demo/AsyncTest/RowAsync/IncreaseAsync',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/RowAsync/IncreaseAsync',
      'css!Controls-demo/AsyncTest/AsyncTestDemo',
   ],
   function(Control, template) {
      'use strict';

      var rowAsyncModule = Control.extend({
         _template: template,
         _isOpen: false,

         _setOpen: function() {
            this._isOpen = !this._isOpen;
            this._forceUpdate();
         },
      });
      return rowAsyncModule;
   }
);
