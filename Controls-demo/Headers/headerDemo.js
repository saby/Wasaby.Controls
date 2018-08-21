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
         { title: 's'  },
         { title: 'm'  },
         { title: 'l'  },
         { title: 'xl' }
      ]
   });

   var headerStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         { title: 'primary'   },
         { title: 'secondary' }
      ]
   });

   var ModuleClass = Control.extend(
      {
         _template: template,
         _headerSelectedSize: 'm',
         _selectedStyle: 'primary',
         _headerSizeSource: headerSizeSource,
         _headerStyleSource: headerStyleSource,
         _caption: 'Header',
         _readOnly: false,
         _eventName: 'no event',

         activatedHandler: function(e) {
            this._eventName = 'activated';
         },

         deactivatedHandler: function(e) {
            this._eventName = 'deactivated';
         },

         changeSize: function(e, key) {
            this._headerSelectedSize = key;
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
