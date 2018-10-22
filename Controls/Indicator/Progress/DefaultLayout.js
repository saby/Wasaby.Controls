define(
   'Controls/Indicator/Progress/DefaultLayout',
   [
      'Controls/Indicator/Progress/BaseController',
      'wml!Controls/Indicator/Progress/DefaultLayout/DefaultLayout',

      'css!Controls/Indicator/Progress/DefaultLayout/DefaultLayout'
   ],
   function(
      BaseController,
      template
   ) {
      'use strict';

      /**
       * Default layout of progress bar
       *
       * @class Controls/Indicator/Progress/DefaultLayout
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
