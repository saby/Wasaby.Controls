define('Controls-demo/Headers/Counter/counterDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Headers/Counter/counterDemo',
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
         _counterSelectedSize: 'l',
         _counterSelectedStyle: 'primary',
         _counterSizeSource: null,
         _counterStyleSource: null,
         _counterCaption: '12',
         _eventName: 'no event',
         _beforeMount: function() {
            this._counterSizeSource = new MemorySource({
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
            this._counterStyleSource = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 'secondary'
                  },
                  {
                     title: 'primary'
                  },
                  {
                     title: 'disabled'
                  }
               ]
            });
         },

         activatedHandler: function(e) {
            this._eventName = 'activated';
         },

         deactivatedHandler: function(e) {
            this._eventName = 'deactivated';
         },

         counterChangeSize: function(e, key) {
            this._counterSelectedSize = key;
         },

         counterChangeStyle: function(e, key) {
            this._counterSelectedStyle = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
