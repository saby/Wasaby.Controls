define('Controls-demo/List/Remove', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/List/Remove/Remove',
   'css!Controls-demo/List/Remove/Remove'
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
         this._children.list.remove([this._idForRemove]);
      }
   });
   return ModuleClass;
});