define('Controls-demo/Buttons/BackButton/backDemo', [
   'Core/Control',
   'Types/source',
   'wml!Controls-demo/Buttons/BackButton/backDemo',
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
         _backSelectedStyle: 'default',
         _backSelectedSize: 'm',
         _backStyleSource: null,
         _backSizeSource: null,
         _backCaption: 'Back',
         _eventName: 'no event',
         _beforeMount: function() {
            this._backStyleSource = new source.Memory({
               keyProperty: 'title',
               data: [
                  {
                     title: 'primary'
                  },
                  {
                     title: 'secondary'
                  }
               ]
            });
            this._backSizeSource = new source.Memory({
               keyProperty: 'title',
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
