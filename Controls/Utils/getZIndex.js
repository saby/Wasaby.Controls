/**
 * Created by as.krasilnikov on 29.10.2018.
 */
define('Controls/Utils/getZIndex', ['Core/helpers/isNewEnvironment'], function(isNewEnvironment) {

   'use strict';

   var ZINDEX_STEP = 50;

   return function getZIndex(instance) {
      if (document && !isNewEnvironment()) {
         var container = $(instance.getContainer());
         var parentArea = container.closest('.controls-compoundAreaNew__floatArea, .ws-float-area-stack-cut-wrapper, .controls-Popup, .controls-FloatArea, .ws-window');
         if (parentArea.length) {
            return parseInt(parentArea.css('z-index'), 10) + ZINDEX_STEP;
         }
         return ZINDEX_STEP;
      }
      return undefined;
   };
});
