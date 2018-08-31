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
   var ModuleClass = Control.extend(
      {
         _template: template,
         _headerSelectedSize: 'm',
         _selectedStyle: 'primary',
         _headerSizeSource: null,
         _headerStyleSource: null,
         _caption: 'Header',
         _readOnly: false,
         _eventName: 'no event',
         _beforeMount: function() {
            this._headerSizeSource = new MemorySource({
               idProperty: 'title',
               data: [
                  { title: 's'  },
                  { title: 'm'  },
                  { title: 'l'  },
                  { title: 'xl' }
               ]
            });
            this._headerStyleSource = new MemorySource({
               idProperty: 'title',
               data: [
                  { title: 'primary'   },
                  { title: 'secondary' }
               ]
            });
         },

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
