define('Controls-demo/Operations/Remove', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Operations/Remove/Remove',
   'css!Controls-demo/Operations/Remove/Remove'
], function (BaseControl, MemorySource, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _idForRemove: 0,

      constructor: function() {
         ModuleClass.superclass.constructor.apply(this, arguments);
         this._viewSource = new MemorySource({
            idProperty: 'id',
            data: [{
                  id: 1,
                  title: 'Запись 1'
               }, {
                  id: 2,
                  title: 'Запись 2'
               }, {
                  id: 3,
                  title: 'Запись 3'
               }]
         });
      },

      _removeItem: function() {
         this._children.list.removeItems(this._idForRemove);
      }
   });
   return ModuleClass;
});