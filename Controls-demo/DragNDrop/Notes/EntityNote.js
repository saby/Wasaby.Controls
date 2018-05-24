define('Controls-demo/DragNDrop/Notes/EntityNote', ['Controls/DragNDrop/Entity/Item'],
   function(Entity) {
      'use strict';

      var EntityNote = Entity.extend({

         constructor: function(options) {
            EntityNote.superclass.constructor.apply(this, arguments);
            this._startPosition = options.item.get('position');
         },

         getStartPosition: function() {
            return this._startPosition;
         }
      });

      return EntityNote;
   });
