define('Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             MemorySource,
             template) {
   'use strict';

   var iconStyleSource = new MemorySource({
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

   var ModuleClass = Control.extend(
      {
         _template: template,
         _iconSelectedStyle: 'primary',
         _iconStyleSource: iconStyleSource,
         _eventName: 'no event',

         clickHandler: function(e) {
            this._eventName = 'click';
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
