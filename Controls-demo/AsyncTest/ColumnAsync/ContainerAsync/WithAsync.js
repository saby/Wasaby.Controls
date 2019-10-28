define('Controls-demo/AsyncTest/ColumnAsync/ContainerAsync/WithAsync',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/ColumnAsync/ContainerAsync/WithAsync',
      'css!Controls-demo/AsyncTest/AsyncTestDemo',
   ], function (Control, template) {
      'use strict';

      var withAsyncModule = Control.extend({
         _template: template,
         _isOpen: false,

         _setOpen: function() {
            this._isOpen = !this._isOpen;
            this._forceUpdate();
         },
      });

      return withAsyncModule;
   });
