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
            title: 'secondary'
         },
         {
            title: 'additional'
         },
         {
            title: 'primary'
         }
      ]
   });

   var ModuleClass = Control.extend(
      {
         _template: template,
         _separatorSelectedStyle: 'secondary',
         _separatorStyleSource: separatorStyleSource,
         _bold: true,
         _activeFlag: false,
         _eventName: 'no event',

         activatedHandler: function(e) {
            this._activeFlag = true;
         },

         deactivatedHandler: function(e) {
            this._eventName = 'deactivated';
         },

         valueChangedHandler: function(e, value) {
            this._iconValue = value;
            this._eventName = 'valueChanged';
            if (this._activeFlag) {
               this._eventName += ' activated';
            }
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
