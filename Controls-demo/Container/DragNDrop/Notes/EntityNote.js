define('Controls-demo/Container/DragNDrop/Notes/EntityNote', ['Controls/Controllers/DragNDrop/Entity/Item', 'WS.Data/Di'],
   function(Entity, Di) {
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

      Di.register('dragentity.note', EntityNote);
      return EntityNote;
   });
