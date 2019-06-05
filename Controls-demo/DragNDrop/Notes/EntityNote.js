define('Controls-demo/DragNDrop/Notes/EntityNote', ['Controls/dragnDrop'],
   function(dragnDrop) {
      'use strict';

      var EntityNote = dragnDrop._ItemEntity.extend({

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
