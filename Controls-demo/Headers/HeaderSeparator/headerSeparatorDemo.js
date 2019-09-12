define('Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo', [
   'Core/Control',
   'Types/source',
   'wml!Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo',
   'Types/collection',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             source,
             template) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _iconSelectedStyle: 'primary',
         _iconStyleSource: null,
         _eventName: 'no event',
         _beforeMount: function() {
            this._iconStyleSource = new source.Memory({
               keyProperty: 'title',
               data: [
                  {
                     title: 'secondary'
                  },
                  {
                     title: 'primary'
                  }
               ]
            });
         },

         activatedHandler: function(e) {
            this._eventName = 'activated';
         },

         deactivatedHandler: function(e) {
            this._eventName = 'deactivated';
         },

         iconChangeStyle: function(e, key) {
            this._iconSelectedStyle = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
