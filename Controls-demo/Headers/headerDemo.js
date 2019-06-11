define('Controls-demo/Headers/headerDemo', [
   'Core/Control',
   'Types/source',
   'wml!Controls-demo/Headers/headerDemo',
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
         _headerSelectedSize: 'm',
         _selectedStyle: 'primary',
         _headerSizeSource: null,
         _headerStyleSource: null,
         _caption: 'Header',
         _readOnly: false,
         _eventName: 'no event',
         _beforeMount: function() {
            this._headerSizeSource = new source.Memory({
               idProperty: 'title',
               data: [
                  { title: 'xs' },
                  { title: 's' },
                  { title: 'm' },
                  { title: 'l' },
                  { title: 'xl' },
                  { title: '2xl' },
                  { title: '3xl' },
                  { title: '4xl' },
                  { title: '5xl' }
               ]
            });
            this._headerStyleSource = new source.Memory({
               idProperty: 'title',
               data: [
                  { title: 'primary' },
                  { title: 'secondary' },
                  { title: 'label' },
                  { title: 'danger' },
                  { title: 'success' },
                  { title: 'default' },
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
      }
   );
   return ModuleClass;
});
