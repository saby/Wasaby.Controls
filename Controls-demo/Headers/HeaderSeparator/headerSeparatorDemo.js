define('Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             MemorySource,
             template) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _iconSelectedStyle: 'primary',
         _iconStyleSource: null,
         _eventName: 'no event',
         _beforeMount: function() {
            this._iconStyleSource = new MemorySource({
               idProperty: 'title',
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
