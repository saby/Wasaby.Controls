define('Controls-demo/Buttons/BackButton/backDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Buttons/BackButton/backDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function(Control,
   MemorySource,
   template) {
   'use strict';

   var backStyleSource = new MemorySource({
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

   var backSizeSource = new MemorySource({
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
         }
      ]
   });

   var ModuleClass = Control.extend(
      {
         _template: template,
         _backSelectedStyle: 'default',
         _backSelectedSize: 'm',
         _backStyleSource: null,
         _backSizeSource: null,
         _backCaption: 'Back',
         _eventName: 'no event',
         _beforeMount: function() {
            this._backStyleSource = backStyleSource;
            this._backSizeSource = backSizeSource;
         },
         clickHandler: function(e) {
            this._eventName = 'click';
         },

         backChangeStyle: function(e, key) {
            this._backSelectedStyle = key;
         },

         backChangeSize: function(e, key) {
            this._backSelectedSize = key;
         },
         reset: function() {
            this._eventName = 'no event';
         }
      }
   );
   return ModuleClass;
});
