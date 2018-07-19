define('Controls-demo/Example/resource/BaseDemoInput',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/resource/BaseDemoInput/BaseDemoInput',

      'css!Controls-demo/Example/resource/Base',
      'css!Controls-demo/Example/resource/BaseDemoInput/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _switchBlocker: function() {
            this._lock = !this._lock;
         }
      });
   }
);
