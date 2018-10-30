define(
   'Controls/Indicator/Progress/CompactLayout',
   [
      'Controls/Indicator/Progress/BaseController',
      'wml!Controls/Indicator/Progress/CompactLayout/CompactLayout',

      'css!Controls/Indicator/Progress/CompactLayout/CompactLayout'
   ],
   function(
      BaseController,
      template
   ) {
      'use strict';

      /**
       * Compact layout of progress bar
       *
       * @class Controls/Indicator/Progress/CompactLayout
       * @extends Controls/Indicator/Progress/BaseController
       * @demo Controls-demo/Indicator/ProgressBar/ProgressBar
       *
       * @public
       *
       * @author Baranov M.A.
       */

      return BaseController.extend({
         _template: template
      });
   }
);
