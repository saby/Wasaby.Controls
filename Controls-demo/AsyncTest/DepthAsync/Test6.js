define('Controls-demo/AsyncTest/DepthAsync/Test6',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/DepthAsync/Test6',
      'css!Controls-demo/AsyncTest/AsyncTestDemo',
      'css!Controls-demo/AsyncTest/DepthAsync/Depth',
   ], function (Control, template) {
      'use strict';

      var testDepthModule = Control.extend({
         _template: template,
         _isGrid: true,
         _readOnly: false,

         _setGridState: function() {
            this._isGrid = !this._isGrid;
            this._forceUpdate();
         },
         _setReadState: function() {
            this._readOnly = !this._readOnly;
            this._forceUpdate();
         },
      });

      return testDepthModule;
   });
