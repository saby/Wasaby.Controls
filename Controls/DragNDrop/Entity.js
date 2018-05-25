define('Controls/DragNDrop/Entity', ['Core/core-extend'],
   function(extend) {
      'use strict';

      var Entity = extend({
         constructor: function(options) {
            this._options = options;
         }
      });

      return Entity;
   });
