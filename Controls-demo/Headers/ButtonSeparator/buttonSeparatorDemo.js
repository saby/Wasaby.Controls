define('Controls-demo/Headers/ButtonSeparator/buttonSeparatorDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Headers/ButtonSeparator/buttonSeparatorDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             MemorySource,
             template) {
   'use strict';

   var separatorStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'accent'
         },
         {
            title: 'additional'
         },
         {
            title: 'main'
         }
      ]
   });

   var ModuleClass = Control.extend(
      {
         _template: template,
         _separatorSelectedStyle: 'accent',
         _separatorStyleSource: separatorStyleSource,
         _bold: true,
         _eventName: 'no event',

         clickIcon: function(e) {
            this._iconValue = !this._iconValue;
            this._eventName = 'click';
         },

         separatorChangeStyle: function(e, key) {
            this._separatorSelectedStyle = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
