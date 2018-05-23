define('Controls/Controllers/DragNDrop/Entity', ['Core/core-extend'],
   function(extend) {
      'use strict';

      var Entity = extend({

         constructor: function(options) {
            this._options = options;
         },

         getOwner: function() {
            return this._options.owner;
         }
      });

      return Entity;
   });
