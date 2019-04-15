import Env = require('Env/Env');
import getDimensions = require('Controls/Utils/getDimensions');

   

   var lastId = 0;

   export = {

      /**
       * The position property with sticky value is not supported in ie and edge lower version 16.
       * https://developer.mozilla.org/ru/docs/Web/CSS/position
       */
      isStickySupport: function() {
         return !Env.detection.isIE || Env.detection.IEVersion > 15;
      },

      getNextId: function() {
         return lastId++;
      },

      get _lastId() {
         return lastId - 1;
      },

      getOffset: function(parentElement, element, position) {
         //TODO redo after complete https://online.sbis.ru/opendoc.html?guid=7c921a5b-8882-4fd5-9b06-77950cbe2f79
         parentElement = (parentElement && parentElement.get) ? parentElement.get(0) : parentElement;
         element = (element && element.get) ? element.get(0) : element;

         var
            offset = getDimensions(element),
            parrentOffset = getDimensions(parentElement);
         if (position === 'top') {
            return offset.top - parrentOffset.top;
         } else {
            return parrentOffset.bottom - offset.bottom;
         }
      }
   };

