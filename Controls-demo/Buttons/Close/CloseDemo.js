define('Controls-demo/Buttons/Close/CloseDemo', [
   'Core/Control',
   'Types/source',
   'wml!Controls-demo/Buttons/Close/CloseDemo',
   'Types/collection',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function(Control,
   source,
   template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template,
         _closeSelectedStyle: 'default',
         _closeStyleSource: null,
         _eventName: 'no event',
         _beforeMount: function() {
            this._closeStyleSource = new source.Memory({
               keyProperty: 'title',
               data: [
                  {
                     title: 'default'
                  },
                  {
                     title: 'primary'
                  },
                  {
                     title: 'light'
                  }
               ]
            });
         },
         clickHandler: function(e) {
            this._eventName = 'click';
         },

         closeChangeStyle: function(e, key) {
            this._closeSelectedStyle = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      }
   );
   return ModuleClass;
});
