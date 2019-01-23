define(
   'Controls/Indicator/Progress/Bar',
   [
      'Core/Control',
      'wml!Controls/Indicator/Progress/Bar/Bar',
      'Types/entity',

      'css!Controls/Indicator/Progress/Bar/Bar'
   ],
   function(
      Control,
      template,
      entity
   ) {
      'use strict';

      /**
       * Control that renders progress bar
       *
       * @class Controls/Indicator/Progress/Bar
       * @extends Core/Control
       *
       * @public
       *
       * @author Baranov M.A.
       *
       * @demo Controls-demo/Indicator/ProgressBar/ProgressBar
       */


      /**
       * @name Controls/Indicator/Progress/Bar#value
       * @cfg {Number} Progress in percents (ratio of the filled part)
       */

      var
         Bar = Control.extend({
            _template: template
         });

      Bar.getOptionTypes = function() {
         return {
            value: entity.descriptor(Number).required()
         };
      };

      Bar.getDefaultOptions = function() {
         return {
            value: 0
         };
      };

      return Bar;
   }
);
