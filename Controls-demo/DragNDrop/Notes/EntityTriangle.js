define('Controls-demo/DragNDrop/Notes/EntityTriangle', ['Controls/DragNDrop/Entity/Item'],
   function(Entity) {
      'use strict';

      var EntityTriangle = Entity.extend({

         constructor: function(options) {
            EntityTriangle.superclass.constructor.apply(this, arguments);
            this._startSize = options.item.get('size');
         },

         getStartSize: function() {
            return this._startSize;
         }
      });

      return EntityTriangle;
   });
