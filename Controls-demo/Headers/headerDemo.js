define('Controls-demo/Headers/headerDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Headers/headerDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             MemorySource,
             template) {
   'use strict';

   var headerSizeSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 's'
         },
         {
            title: 'm'
         },
         {
            title: 'l'
         },
         {
            title: 'xl'
         }
      ]
   });

   var headerStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default'
         },
         {
            title: 'primary'
         }
      ]
   });

   var ModuleClass = Control.extend(
      {
         _template: template,
         _selectedSize: 'm',
         _selectedStyle: 'primary',
         _headerSizeSource: headerSizeSource,
         _headerStyleSource: headerStyleSource,
         _caption: 'test',
         _eventName: 'no event',

         clickHandler: function(e) {
            this._eventName = 'click';
         },

         changeSize: function(e, key) {
            this._selectedSize = key;
         },

         changeStyle: function(e, key) {
            this._selectedStyle = key;
         },
         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
