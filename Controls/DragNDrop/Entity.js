define('Controls/DragNDrop/Entity', ['Core/core-extend'],
   function(extend) {
      'use strict';

      /**
       * The base class for the inheritors of the drag'n'drop entity.
       * You can customize an entity in any way by passing any data to the options.
       * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
       * @class Controls/DragNDrop/Entity
       * @public
       * @author Авраменко А.С.
       * @category DragNDrop
       */

      var Entity = extend({
         constructor: function(options) {
            this._options = options;
         }
      });

      return Entity;
   });
