define('Controls-demo/DragNDrop/Notes/EntityTriangle', ['Controls/dragnDrop'],
   function(dragnDrop) {
      'use strict';

      var EntityTriangle = dragnDrop._ItemEntity.extend({

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
