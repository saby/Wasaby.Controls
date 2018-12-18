define('Controls-demo/Example/Label',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Label/Label',

      'Controls/Label',
      'css!Controls-demo/Example/Label/Label',
      'css!Controls-demo/Example/resource/Base'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _limitedCaption: 'Label with limited width',

         _switchBlocker: function() {
            this._lock = !this._lock;
         }
      });
   });
