define('Controls-demo/LoadingIndicator/IndicatorContainer', [
   'Core/Control',
   'wml!Controls-demo/LoadingIndicator/IndicatorContainer',
   'css!Controls-demo/LoadingIndicator/IndicatorContainer'
], function(Control, tmpl) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      _open: function() {
         this._children.loadingIndicator.show({});
      }
   });

   return module;
});
