define('Controls-demo/Buttons/Close/CloseDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Buttons/Close/CloseDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function(Control,
   MemorySource,
   template) {
   'use strict';

   var closeStyleSource = new MemorySource({
      idProperty: 'title',
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

   var ModuleClass = Control.extend(
      {
         _template: template,
         _closeSelectedStyle: 'default',
         _closeStyleSource: null,
         _eventName: 'no event',
         _beforeMount: function() {
            this._closeStyleSource = closeStyleSource;
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
